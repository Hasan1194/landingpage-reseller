import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp, increment  } from "firebase/firestore";

export default function ResellerManagement() {
    const [resellers, setResellers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [newPoints, setNewPoints] = useState("");

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

    const handleUpdatePoints = async () => {
        if (!editUser) return;

        const userId = editUser.id;
        const userRef = doc(db, "users", userId);

        // Hitung selisih poin
        const diff = Number(newPoints) - Number(editUser.points);
        if (diff === 0) return;

        try {
            // Update poin dengan increment biar lebih aman
            await updateDoc(userRef, {
                points: increment(diff)
            });

            // Tambahkan ke subcollection history
            const historyRef = collection(db, "users", userId, "pointHistory");
            await addDoc(historyRef, {
                amount: diff,
                type: diff > 0 ? "admin-add" : "admin-remove",
                description: "Perubahan poin oleh admin",
                timestamp: serverTimestamp()
            });

            console.log("Point history berhasil ditambahkan!"); 

        } catch (err) {
            console.error("Gagal update poin:", err);
        }

        setEditUser(null);
        setNewPoints("");
        fetchResellers();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-bold mb-6">Kelola Akun Reseller</h2>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-3">Nama</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Poin</th>
                        <th className="p-3">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {resellers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.points}</td>
                            <td className="p-3">
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1"
                                    onClick={() => {
                                        setEditUser(user);
                                        setNewPoints(user.points);
                                    }}
                                >
                                    <Edit size={14} /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Edit */}
            {editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">
                            Edit Poin - {editUser.name}
                        </h3>

                        <input
                            type="number"
                            className="w-full p-2 border rounded mb-4"
                            value={newPoints}
                            onChange={(e) => setNewPoints(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-2 bg-gray-400 text-white rounded"
                                onClick={() => setEditUser(null)}
                            >
                                Batal
                            </button>

                            <button
                                className="px-3 py-2 bg-green-600 text-white rounded"
                                onClick={handleUpdatePoints}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
