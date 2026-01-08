import { useState, useEffect } from "react";
import { Edit, X } from "lucide-react";
import { motion } from "framer-motion";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function RewardManagement() {
    const [rewards, setRewards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReward, setEditingReward] = useState(null);
    const [form, setForm] = useState({ name: "", points: "" });

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "rewards"), (snapshot) => {
        setRewards(
            snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }))
        );
        });

        return () => unsub();
    }, []);

    const openAddModal = () => {
        setEditingReward(null);
        setForm({ name: "", points: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (reward) => {
        setEditingReward(reward);
        setForm({ name: reward.name, points: reward.points });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.points) return;

        if (editingReward) {
        await updateDoc(doc(db, "rewards", editingReward.id), {
            name: form.name,
            points: Number(form.points),
        });
        } else {
        await addDoc(collection(db, "rewards"), {
            name: form.name,
            points: Number(form.points),
            createdAt: serverTimestamp(),
        });
        }

        setIsModalOpen(false);
    };

    const deleteReward = async (id) => {
        await deleteDoc(doc(db, "rewards", id));
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg"
        >
        <h2 className="text-2xl font-bold mb-6">Kelola Reward</h2>

        <button onClick={openAddModal}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
            + Tambah Reward
        </button>

        <table className="w-full border-collapse">
            <thead>
            <tr className="bg-gray-200 text-left">
                <th className="p-3">Reward</th>
                <th className="p-3">Poin</th>
                <th className="p-3">Aksi</th>
            </tr>
            </thead>
            <tbody>
            {rewards.map((rw) => (
                <tr key={rw.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{rw.name}</td>
                <td className="p-3">{rw.points}</td>
                <td className="p-3 flex gap-2">
                    <button onClick={() => openEditModal(rw)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1"
                    >
                    <Edit size={14} /> Edit
                    </button>

                    <button onClick={() => deleteReward(rw.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                    >
                    Hapus
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {isModalOpen && (
            <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                    {editingReward ? "Edit Reward" : "Tambah Reward"}
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                    <X />
                </button>
                </div>

                <div className="flex flex-col gap-3">
                <input
                    className="border p-2 rounded"
                    placeholder="Nama reward"
                    value={form.name}
                    onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Jumlah poin"
                    value={form.points}
                    onChange={(e) =>
                    setForm({ ...form, points: e.target.value })
                    }
                />

                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    {editingReward ? "Update" : "Tambah"}
                </button>
                </div>
            </div>
            </motion.div>
        )}
        </motion.div>
    );
}
