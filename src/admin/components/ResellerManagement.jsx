import { useState } from "react";
import { Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function ResellerManagement() {
    const [resellers, setResellers] = useState([
        { id: 1, name: "Hasan", email: "hasan@example.com", points: 120 },
        { id: 2, name: "Rizki", email: "rizki@example.com", points: 80 },
    ]);

    const addPoints = (id) => {
        setResellers(
        resellers.map((r) =>
            r.id === id ? { ...r, points: r.points + 10 } : r
        )
        );
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
                <td className="p-3 flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1">
                    <Edit size={14} /> Edit
                    </button>

                    <button
                    onClick={() => addPoints(user.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
                    >
                    + Poin
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </motion.div>
    );
}
