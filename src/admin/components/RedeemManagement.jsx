import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

export default function RedeemManagement() {
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        const ref = collection(db, "redeemRequests");
        const snapshot = await getDocs(ref);

        setRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (req) => {
        const userRef = doc(db, "users", req.userId);
        const newPoints = req.currentPoints - req.rewardPoints;

        await updateDoc(userRef, {
            points: newPoints,
            pointHistory: [
                ...(req.pointHistory || []),
                {
                    reward: req.rewardName,
                    used: req.rewardPoints,
                    date: new Date().toISOString()
                }
            ]
        });

        alert("Berhasil dikonfirmasi!");
        fetchRequests();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-bold mb-6">Permintaan Redeem</h2>

            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-200">
                    <th className="p-3">Nama</th>
                    <th className="p-3">Hadiah</th>
                    <th className="p-3">Poin</th>
                    <th className="p-3">Aksi</th>
                </tr>
                </thead>

                <tbody>
                {requests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{req.userName}</td>
                        <td className="p-3">{req.rewardName}</td>
                        <td className="p-3">{req.rewardPoints}</td>
                        <td className="p-3">
                            <button 
                                onClick={() => handleApprove(req)}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
                            >
                                ✔ Konfirmasi
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </motion.div>
    );
}
