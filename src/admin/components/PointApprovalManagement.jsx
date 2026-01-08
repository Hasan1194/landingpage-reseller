import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    increment,
    addDoc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { CheckCircle, XCircle, Clock, ExternalLink, Loader2 } from "lucide-react";

export default function PointApprovalManagement() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "pointRequests"));
            const data = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .sort((a, b) => {
                    // Sort: pending first, then by createdAt desc
                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
                });

            setRequests(data);

            // Fetch user details for each request
            const userIds = [...new Set(data.map(r => r.userId))];
            const details = {};
            
            for (const userId of userIds) {
                try {
                    const userDoc = await getDoc(doc(db, "users", userId));
                    if (userDoc.exists()) {
                        details[userId] = userDoc.data();
                    }
                } catch (err) {
                    console.error(`Error fetching user ${userId}:`, err);
                }
            }
            
            setUserDetails(details);
        } catch (err) {
            console.error('Error fetching requests:', err);
            alert('Gagal mengambil data requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (req) => {
        if (!confirm(`Approve request ${req.pointAmount} poin untuk user ini?`)) return;

        setProcessingId(req.id);

        try {
            // 1. Update status request
            await updateDoc(doc(db, "pointRequests", req.id), {
                status: "approved",
                approvedAt: serverTimestamp(),
            });

            // 2. Update user points
            await updateDoc(doc(db, "users", req.userId), {
                points: increment(req.pointAmount),
            });

            // 3. Add to point history
            await addDoc(
                collection(db, "users", req.userId, "pointHistory"),
                {
                    type: "earn",
                    amount: req.pointAmount,
                    description: `Request approved: ${req.description}`,
                    createdAt: serverTimestamp(),
                }
            );

            alert('Request berhasil di-approve!');
            fetchRequests();
        } catch (err) {
            console.error('Approve error:', err);
            alert('Gagal approve request: ' + err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (req) => {
        const reason = prompt('Alasan reject (opsional):');
        if (reason === null) return; // User cancelled

        setProcessingId(req.id);

        try {
            await updateDoc(doc(db, "pointRequests", req.id), {
                status: "rejected",
                rejectedAt: serverTimestamp(),
                rejectionReason: reason || "No reason provided",
            });

            alert('Request berhasil di-reject!');
            fetchRequests();
        } catch (err) {
            console.error('Reject error:', err);
            alert('Gagal reject request: ' + err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
        };
        
        const icons = {
            pending: <Clock className="w-4 h-4" />,
            approved: <CheckCircle className="w-4 h-4" />,
            rejected: <XCircle className="w-4 h-4" />,
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${styles[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#C9A24A]" />
                <span className="ml-3 text-gray-600">Loading requests...</span>
            </div>
        );
    }

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const processedRequests = requests.filter(r => r.status !== 'pending');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Approval Request Poin</h1>
                    <p className="text-gray-600 mt-1">
                        {pendingRequests.length} request pending
                    </p>
                </div>
                <button
                    onClick={fetchRequests}
                    disabled={loading}
                    className="px-4 py-2 bg-[#C9A24A] text-white rounded-lg hover:bg-[#B8933D] transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
                    <div className="grid gap-6">
                        {pendingRequests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-white rounded-xl shadow-lg p-6 space-y-4 border-2 border-yellow-200"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusBadge(req.status)}
                                            <span className="text-sm text-gray-500">
                                                {formatDate(req.createdAt)}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-semibold text-gray-900">
                                                {userDetails[req.userId]?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                User ID: <span className="font-mono text-xs">{req.userId}</span>
                                            </p>
                                            {userDetails[req.userId]?.email && (
                                                <p className="text-sm text-gray-600">
                                                    Email: {userDetails[req.userId].email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-[#C9A24A]">
                                            +{req.pointAmount}
                                        </p>
                                        <p className="text-sm text-gray-500">poin</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Keterangan:</p>
                                    <p className="text-gray-900">{req.description}</p>
                                </div>

                                {/* Image Preview */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-700">Bukti Transfer:</p>
                                        <a
                                            href={req.imageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Buka di tab baru
                                        </a>
                                    </div>
                                    <div className="relative group">
                                        <img
                                            src={req.imageUrl}
                                            alt="Bukti transfer"
                                            className="w-full max-w-2xl rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#C9A24A] transition-all"
                                            onClick={() => window.open(req.imageUrl, '_blank')}
                                            onError={(e) => {
                                                console.error('Image load error:', req.imageUrl);
                                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">Gambar tidak dapat dimuat</text></svg>';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-gray-500">Path: {req.imagePath}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-2">
                                    <button
                                        onClick={() => handleApprove(req)}
                                        disabled={processingId === req.id}
                                        className="flex-1 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        {processingId === req.id ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Approve
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleReject(req)}
                                        disabled={processingId === req.id}
                                        className="flex-1 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        {processingId === req.id ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-5 h-5" />
                                                Reject
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {pendingRequests.length === 0 && (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Tidak ada request pending</p>
                </div>
            )}

            {/* Processed Requests */}
            {processedRequests.length > 0 && (
                <div className="space-y-4 mt-8">
                    <h2 className="text-xl font-semibold text-gray-900">Riwayat Processed</h2>
                    <div className="grid gap-4">
                        {processedRequests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-white rounded-lg shadow p-4 opacity-75 hover:opacity-100 transition-opacity"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(req.status)}
                                            <p className="font-semibold text-gray-900">
                                                {userDetails[req.userId]?.name || 'Unknown User'}
                                            </p>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-lg font-bold text-gray-700">
                                                {req.pointAmount} poin
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {formatDate(req.status === 'approved' ? req.approvedAt : req.rejectedAt)}
                                        </p>
                                    </div>
                                    <a
                                        href={req.imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Lihat Bukti
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}