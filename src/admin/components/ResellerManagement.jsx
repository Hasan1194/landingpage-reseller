import { useEffect, useState } from "react";
import { Edit, Save, X, Download } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp, increment } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ResellerManagement() {
    const [resellers, setResellers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState({});
    const [historyList, setHistoryList] = useState([]);
    const [filterMonth, setFilterMonth] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [modalType, setModalType] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const exportAllResellersToPDF = async () => {
        setIsExporting(true);

        try {
            const { jsPDF } = await import('jspdf');
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF('landscape'); 
            
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(40, 40, 40);
            doc.text('PT IMAH TEUWEUL INDONESIA', 14, 15);

            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(201, 162, 74); 
            doc.text('LAPORAN DATA RESELLER', 14, 24);

            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            const now = new Date();
            const dateStr = now.toLocaleDateString('id-ID', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const timeStr = now.toLocaleTimeString('id-ID');
            doc.text(`Tanggal Cetak: ${dateStr}, ${timeStr}`, 14, 30);

            doc.setDrawColor(201, 162, 74);
            doc.setLineWidth(0.5);
            doc.line(14, 33, 283, 33);

            const totalResellers = resellers.length;
            const totalPoints = resellers.reduce((sum, r) => sum + r.points, 0);
            const avgPoints = Math.round(totalPoints / totalResellers);
            const totalPrizes = resellers.reduce((sum, r) => sum + (r.prize || 0), 0);

            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(40, 40, 40);
            
            const statsY = 38;
            const boxHeight = 18;
            const boxWidth = 65;
            const spacing = 5;

            doc.setFillColor(59, 130, 246); 
            doc.roundedRect(14, statsY, boxWidth, boxHeight, 2, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text('TOTAL RESELLER', 16, statsY + 5);
            doc.setFontSize(16);
            doc.text(totalResellers.toString(), 16, statsY + 13);

            doc.setFillColor(34, 197, 94); 
            doc.roundedRect(14 + boxWidth + spacing, statsY, boxWidth, boxHeight, 2, 2, 'F');
            doc.setFontSize(8);
            doc.text('TOTAL POIN', 16 + boxWidth + spacing, statsY + 5);
            doc.setFontSize(16);
            doc.text(totalPoints.toLocaleString('id-ID'), 16 + boxWidth + spacing, statsY + 13);

            doc.setFillColor(168, 85, 247); 
            doc.roundedRect(14 + (boxWidth + spacing) * 2, statsY, boxWidth, boxHeight, 2, 2, 'F');
            doc.setFontSize(8);
            doc.text('RATA-RATA POIN', 16 + (boxWidth + spacing) * 2, statsY + 5);
            doc.setFontSize(16);
            doc.text(avgPoints.toLocaleString('id-ID'), 16 + (boxWidth + spacing) * 2, statsY + 13);

            const tableColumn = [
                'No',
                'Nama',
                'Email',
                'No Telepon',
                'Alamat',
                'Total Poin',
                'Hadiah'
            ];

            const tableRows = resellers.map((user, index) => [
                index + 1,
                user.name,
                user.email,
                `+62${user.phonenumber}`,
                user.address,
                user.points.toLocaleString('id-ID'),
                user.prize || '-'
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: statsY + boxHeight + 8,
                theme: 'striped',
                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1
                },
                headStyles: {
                    fillColor: [201, 162, 74],
                    textColor: [255, 255, 255],
                    fontSize: 10,
                    fontStyle: 'bold',
                    halign: 'center',
                    valign: 'middle'
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 12 }, // No
                    1: { halign: 'left', cellWidth: 40 },   // Nama
                    2: { halign: 'left', cellWidth: 50 },   // Email
                    3: { halign: 'center', cellWidth: 35 }, // No Telepon
                    4: { halign: 'left', cellWidth: 65 },   // Alamat
                    5: { halign: 'right', cellWidth: 30 },  // Total Poin
                    6: { halign: 'center', cellWidth: 20 }  // Hadiah
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251]
                },
                didDrawPage: function(data) {
                    const pageCount = doc.internal.getNumberOfPages();
                    const pageSize = doc.internal.pageSize;
                    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

                    doc.setFontSize(9);
                    doc.setTextColor(100, 100, 100);
                    doc.text(
                        `Halaman ${doc.internal.getCurrentPageInfo().pageNumber} dari ${pageCount}`,
                        pageWidth / 2,
                        pageHeight - 10,
                        { align: 'center' }
                    );

                    doc.setFontSize(8);
                    doc.text('PT Imah Teuweul Indonesia', 14, pageHeight - 10);
                    doc.text('Kuningan, Jawa Barat', 14, pageHeight - 6);

                    doc.text('www.madumakun.com', pageWidth - 14, pageHeight - 10, { align: 'right' });
                    doc.text('madumakun@gmail.com', pageWidth - 14, pageHeight - 6, { align: 'right' });
                }
            });

            const finalY = doc.lastAutoTable.finalY + 10;
            if (finalY < 180) {
                doc.setDrawColor(201, 162, 74);
                doc.setLineWidth(0.3);
                doc.line(14, finalY, 283, finalY);

                doc.setFontSize(9);
                doc.setTextColor(100, 100, 100);
                doc.setFont(undefined, 'italic');
                doc.text('Catatan: Data ini adalah laporan resmi yang dihasilkan oleh sistem.', 14, finalY + 6);
                doc.text('Untuk informasi lebih lanjut, hubungi admin sistem.', 14, finalY + 11);
            }

            const timestamp = now.toISOString().split('T')[0];
            doc.save(`Laporan_Reseller_${timestamp}.pdf`);

            console.log('PDF exported successfully!');

        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Gagal mengexport PDF. Silakan coba lagi.');
        } finally {
            setIsExporting(false);
        }
    };

    const calculateTotalPoint = (pointHistory = []) => {
        return pointHistory.reduce((total, item) => {
            if (item.type === 'IN') return total + item.amount
            if (item.type === 'OUT') return total - item.amount
            return total
        }, 0)
    }

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "-";

        if (timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }

        if (timestamp instanceof Date) {
            return timestamp.toLocaleDateString('id-ID');
        }

        return new Date(timestamp).toLocaleDateString('id-ID');
    };

    const exportToPDF = async () => {
        setIsExporting(true);
        
        try {
            const { jsPDF } = await import('jspdf');
            const autoTable = (await import('jspdf-autotable')).default;
            
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.setTextColor(40, 40, 40);
            doc.text(`Riwayat Poin - ${selectedUser.name}`, 14, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Email: ${selectedUser.email}`, 14, 28);
            doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 33);
            doc.text(`Total Transaksi: ${filteredHistory.length}`, 14, 38);

            const totalPoints = filteredHistory.reduce((sum, item) => sum + item.amount, 0);
            doc.setFontSize(11);
            doc.setTextColor(40, 40, 40);
            doc.text(`Total Poin: ${totalPoints}`, 14, 45);

            doc.setDrawColor(200, 200, 200);
            doc.line(14, 48, 196, 48);

            autoTable(doc, {
                startY: 52,
                head: [[
                    "No",
                    "Jumlah Poin",
                    "Tipe",
                    "Deskripsi",
                    "Tanggal"
                ]],
                body: filteredHistory.map((item, index) => ([
                    index + 1,
                    item.amount > 0 ? `+${item.amount}` : item.amount,
                    item.type,
                    item.description,
                    formatTimestamp(item.timestamp)
                ])),
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [201, 162, 74], 
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 15 }, // No
                    1: { halign: 'right', cellWidth: 25 },  // Jumlah
                    2: { halign: 'center', cellWidth: 30 }, // Tipe
                    3: { halign: 'left', cellWidth: 70 },   // Deskripsi
                    4: { halign: 'center', cellWidth: 30 }  // Tanggal
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                didParseCell: function(data) {
                    if (data.column.index === 1 && data.section === 'body') {
                        const amount = filteredHistory[data.row.index].amount;
                        if (amount > 0) {
                            data.cell.styles.textColor = [34, 197, 94];
                        } else if (amount < 0) {
                            data.cell.styles.textColor = [239, 68, 68];
                        }
                    }
                }
            });

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `Halaman ${i} dari ${pageCount}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                );
                doc.text(
                    'PT Imah Teuweul Indonesia',
                    14,
                    doc.internal.pageSize.height - 10
                );
            }

            const fileName = `Riwayat_Poin_${selectedUser.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            console.log('PDF exported successfully!');
            
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Gagal mengexport PDF. Silakan coba lagi.');
        } finally {
            setIsExporting(false);
        }
    };

    const openHistoryModal = async (user) => {
        setSelectedUser(user);
        setModalType('history');

        const historyRef = collection(db, "users", user.id, "pointHistory");
        const snapshot = await getDocs(historyRef);

        const history = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
        }));

        setHistoryList(history);
    };

    const filteredHistory = historyList
        .filter((item) => {
        if (!filterMonth) return true;
        const date = item.timestamp?.toDate();
        const month = date?.getMonth() + 1;
        return month == filterMonth;
        })
        .sort((a, b) => 
        sortOrder === "desc" 
            ? b.amount - a.amount 
            : a.amount - b.amount
        );

    const fetchResellers = async () => {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        const data = snapshot.docs
        .filter((d) => d.data().role === "resellers")
        .map((d) => ({
            id: d.id,
            ...d.data()
        }));

        setResellers(data);
    };

    useEffect(() => {
        fetchResellers();
    }, []);

    const openEditModal = (user) => {
        setSelectedUser(user);
        setModalType('edit');
        setEditData({
        points: user.points,
        prize: user.prize,
        description: ""
        });
    };

    const closeModal = () => {
        setSelectedUser(null);
        setModalType(null);
        setEditData({});
        setHistoryList([]);
        setFilterMonth("");
    };

    const handleSavePoints = async () => {
        const user = selectedUser;
        if (!user) return;

        const diff = Number(editData.points) - Number(user.points);
        if (diff === 0) {
        closeModal();
        return;
        }

        try {
        const userRef = doc(db, "users", user.id);

        await updateDoc(userRef, {
            points: increment(diff),
            prize: editData.prize || user.prize || "-"
        });

        const historyRef = collection(db, "users", user.id, "pointHistory");
        await addDoc(historyRef, {
            amount: diff,
            type: diff > 0 ? "earn" : "redeem",
            description: editData.description || "Perubahan poin oleh admin",
            timestamp: serverTimestamp()
        });

        console.log("Poin berhasil diperbarui dan history dicatat!");

        closeModal();
        fetchResellers();

        } catch (err) {
        console.error("Gagal update poin:", err);
        }
    };

    return (
        <motion.div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Kelola Akun Reseller</h2>

            <button
                onClick={exportAllResellersToPDF}
                disabled={isExporting}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                    isExporting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl'
                }`}
            >
                {isExporting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mengexport...
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        Print Data Reseller
                    </>
                )}
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200 text-left">
                <th className="p-3">Nama</th>
                <th className="p-3">Email</th>
                <th className="p-3">No Telepon</th>
                <th className="p-3">Alamat</th>
                <th className="p-3">Poin</th>
                <th className="p-3">Hadiah</th>
                <th className="p-3">Aksi</th>
                </tr>
            </thead>

            <tbody>
                {resellers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td 
                    className="p-3 cursor-pointer text-blue-600 underline"
                    onClick={() => openHistoryModal(user)}
                    >
                    {user.name}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">+62{user.phonenumber}</td>
                    <td className="p-3">{user.address}</td>
                    <td className="p-3">{user.points}</td>
                    <td className="p-3">{user.prize || "-"}</td>
                    <td className="p-3">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600"
                        onClick={() => openEditModal(user)}
                    >
                        <Edit size={14} /> Edit Point
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Modal Edit Points */}
        {selectedUser && modalType === 'edit' && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
            >
                <h3 className="text-xl font-semibold mb-4">Edit Poin Reseller</h3>

                <label className="block mb-2 font-medium">Points</label>
                <input
                type="number"
                className="w-full p-2 border rounded mb-3"
                value={editData.points}
                onChange={(e) => setEditData({ ...editData, points: e.target.value })}
                />

                <label className="block mb-2 font-medium">Prize</label>
                <input
                type="number"
                className="w-full p-2 border rounded mb-3"
                value={editData.prize}
                onChange={(e) => setEditData({ ...editData, prize: e.target.value })}
                />

                <label className="block mb-2 font-medium">Deskripsi</label>
                <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                placeholder="Alasan perubahan..."
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />

                <div className="flex justify-end gap-2">
                <button
                    className="px-3 py-1 bg-gray-400 text-white rounded-lg flex items-center gap-1 hover:bg-gray-500"
                    onClick={closeModal}
                >
                    <X size={16} /> Batal
                </button>
                <button
                    className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center gap-1 hover:bg-green-700"
                    onClick={handleSavePoints}
                >
                    <Save size={16} /> Simpan
                </button>
                </div>
            </motion.div>
            </div>
        )}

        {/* Modal History */}
        {selectedUser && modalType === 'history' && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-auto z-50">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-xl w-full max-w-2xl"
            >
                <h3 className="text-xl font-semibold mb-4">
                Riwayat Poin - {selectedUser.name}
                </h3>

                {/* Filter + Sort UI */}
                <div className="flex gap-3 mb-4">
                <select 
                    className="border p-2 rounded"
                    onChange={(e) => setFilterMonth(e.target.value)}
                    value={filterMonth}
                >
                    <option value="">Semua Bulan</option>
                    {[...Array(12).keys()].map(m => (
                    <option key={m+1} value={m+1}>
                        {new Date(2024, m).toLocaleDateString('id-ID', { month: 'long' })}
                    </option>
                    ))}
                </select>

                <select 
                    className="border p-2 rounded"
                    onChange={(e) => setSortOrder(e.target.value)}
                    value={sortOrder}
                >
                    <option value="desc">Poin terbesar</option>
                    <option value="asc">Poin terkecil</option>
                </select>
                </div>

                {/* History List */}
                <div className="overflow-x-auto">
                <table className="w-full border">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2">Jumlah</th>
                        <th className="p-2">Tipe</th>
                        <th className="p-2">Deskripsi</th>
                        <th className="p-2">Tanggal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredHistory.map((item) => (
                        <tr key={item.id} className="border-b text-center">
                        <td className="p-2">{item.amount}</td>
                        <td className="p-2">{item.type}</td>
                        <td className="p-2">{item.description}</td>
                        <td className="p-2">{item.timestamp?.toDate().toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={exportToPDF}
                        disabled={isExporting || filteredHistory.length === 0}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            isExporting || filteredHistory.length === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
                        }`}
                    >
                        {isExporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Mengexport...
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Export ke PDF
                            </>
                        )}
                    </button>
                    <button 
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors" 
                        onClick={closeModal}
                    >
                        Tutup
                    </button>
                </div>
            </motion.div>
            </div>
        )}
        </motion.div>
    );
}