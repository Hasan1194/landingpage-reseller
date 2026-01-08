import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, addDoc, increment, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Gift, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

export default function RewardApprovalManagement() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [filter, setFilter] = useState("pending"); 

    useEffect(() => {
        fetchRewardRequests();
    }, []);

    const fetchRewardRequests = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "rewardRequests"),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            
            setRequests(data);
        } catch (error) {
            console.error("Error fetching reward requests:", error);
            alert("Gagal memuat data reward requests");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (request) => {
        if (!window.confirm(`Approve penukaran hadiah "${request.rewardName}" untuk user ${request.userName}?`)) {
            return;
        }

        setProcessing(request.id);
        
        try {
            const userRef = doc(db, "users", request.userId);
            
            // Update status request
            await updateDoc(doc(db, "rewardRequests", request.id), {
                status: "approved",
                approvedAt: serverTimestamp()
            });

            // Kurangi poin user dan tambah prize count
            await updateDoc(userRef, {
                points: increment(-request.rewardPoints),
                prize: increment(1)
            });

            // Tambahkan ke point history (redeem)
            await addDoc(collection(db, "users", request.userId, "pointHistory"), {
                type: "redeem",
                amount: request.rewardPoints,
                description: `Penukaran hadiah: ${request.rewardName}`,
                timestamp: serverTimestamp()
            });

            alert("Request berhasil diapprove!");
            await fetchRewardRequests();
        } catch (error) {
            console.error("Error approving request:", error);
            alert("Gagal approve request. Silakan coba lagi.");
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (request) => {
        const reason = window.prompt(`Masukkan alasan penolakan untuk user ${request.userName}:`);
        
        if (!reason) {
            return;
        }

        setProcessing(request.id);
        
        try {
            await updateDoc(doc(db, "rewardRequests", request.id), {
                status: "rejected",
                rejectedAt: serverTimestamp(),
                rejectionReason: reason
            });

            alert("Request berhasil ditolak!");
            await fetchRewardRequests();
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("Gagal reject request. Silakan coba lagi.");
        } finally {
            setProcessing(null);
        }
    };

    const filteredRequests = requests.filter(req => {
        if (filter === "all") return true;
        return req.status === filter;
    });

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            approved: "bg-green-100 text-green-800 border-green-200",
            rejected: "bg-red-100 text-red-800 border-red-200"
        };

        const icons = {
            pending: Clock,
            approved: CheckCircle,
            rejected: XCircle
        };

        const Icon = icons[status];
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
                <Icon className="w-3.5 h-3.5" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#C9A24A] mx-auto mb-4" />
                    <p className="text-gray-600">Loading reward requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#C9A24A] to-[#B8933D] rounded-xl flex items-center justify-center">
                            <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Reward Requests</h1>
                            <p className="text-gray-600 text-sm">Kelola permintaan penukaran hadiah</p>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {["all", "pending", "approved", "rejected"].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                    filter === status
                                        ? "bg-[#C9A24A] text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                <span className="ml-2 text-xs opacity-75">
                                    ({requests.filter(r => status === "all" || r.status === status).length})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Requests List */}
                {filteredRequests.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Tidak ada reward request dengan status "{filter}"</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map(request => (
                            <div
                                key={request.id}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    {request.rewardName}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                                    <span className="font-medium">{request.userName}</span>
                                                    <span className="text-gray-400">•</span>
                                                    <span>{request.userEmail}</span>
                                                </div>
                                            </div>
                                            {getStatusBadge(request.status)}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Poin Hadiah</p>
                                                <p className="font-bold text-[#C9A24A]">
                                                    {request.rewardPoints?.toLocaleString('id-ID')} poin
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Poin User Saat Ini</p>
                                                <p className="font-bold text-gray-900">
                                                    {request.userCurrentPoints?.toLocaleString('id-ID')} poin
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Tanggal Request</p>
                                                <p className="font-medium text-gray-900">
                                                    {request.createdAt?.toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {request.status === "rejected" && request.rejectionReason && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm text-red-800">
                                                    <strong>Alasan penolakan:</strong> {request.rejectionReason}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {request.status === "pending" && (
                                        <div className="flex gap-2 lg:flex-col">
                                            <button
                                                onClick={() => handleApprove(request)}
                                                disabled={processing === request.id}
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing === request.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request)}
                                                disabled={processing === request.id}
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing === request.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-4 h-4" />
                                                )}
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}