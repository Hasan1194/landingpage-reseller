import { useEffect, useState } from "react";
import { Edit, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp, increment } from "firebase/firestore";

export default function ResellerManagement() {
    const [resellers, setResellers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState({});
    const [historyList, setHistoryList] = useState([]);
    const [filterMonth, setFilterMonth] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [modalType, setModalType] = useState(null);

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
        .filter((d) => d.data().role === "reseller")
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
            type: diff > 0 ? "admin-add" : "admin-remove",
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
        <h2 className="text-2xl font-bold mb-6">Kelola Akun Reseller</h2>

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
                        Bulan {m + 1}
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

                <div className="text-right mt-4">
                <button 
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" 
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