import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { Check, X } from "lucide-react";

export default function RedeemManagement() {
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        const querySnapshot = await getDocs(collection(db, "redeemRequests"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRequests(data);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (req) => {
        const userRef = doc(db, "users", req.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        
        const userData = userSnap.data();
        const newPoints = (userData.points || 0) - req.pointsUsed;

        await updateDoc(userRef, { points: newPoints });
        await updateDoc(doc(db, "redeemRequests", req.id), { status: "approved" });

        fetchRequests();
    };

    const handleReject = async (reqId) => {
        await updateDoc(doc(db, "redeemRequests", reqId), { status: "rejected" });
        fetchRequests();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Permintaan Redeem</h2>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-3">Email</th>
                        <th className="p-3">Reward</th>
                        <th className="p-3">Poin Digunakan</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{req.userEmail}</td>
                            <td className="p-3">{req.rewardName}</td>
                            <td className="p-3">{req.pointsUsed}</td>
                            <td className="p-3 font-medium">
                                {req.status === "pending" ? (
                                    <span className="text-yellow-500">Pending</span>
                                ) : req.status === "approved" ? (
                                    <span className="text-green-600">Approved</span>
                                ) : (
                                    <span className="text-red-600">Rejected</span>
                                )}
                            </td>
                            <td className="p-3 flex gap-2">
                                {req.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(req)}
                                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1"
                                        >
                                            <Check size={14} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm flex items-center gap-1"
                                        >
                                            <X size={14} /> Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
