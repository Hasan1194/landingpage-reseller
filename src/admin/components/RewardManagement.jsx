import { useState } from "react";
import { Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function RewardManagement() {
    const [rewards, setRewards] = useState([
        { id: 1, name: "Mug Exclusive", points: 100 },
        { id: 2, name: "T-shirt MaKun", points: 250 },
    ]);

    const deleteReward = (id) => {
        setRewards(rewards.filter((rw) => rw.id !== id));
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg"
        >
        <h2 className="text-2xl font-bold mb-6">Kelola Reward</h2>

        <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg">
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
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1">
                    <Edit size={14} /> Edit
                    </button>

                    <button
                    onClick={() => deleteReward(rw.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                    >
                    Hapus
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </motion.div>
    );
}
