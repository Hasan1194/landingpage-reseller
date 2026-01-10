import { Award, Gift, Lock, Send, Loader2, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function RewardCatalog({ 
    rewards, 
    loading, 
    totalPoints, 
    userData, 
    currentUser, 
    hasPendingRequest,
    userRewardRequests,
    onRequestSubmitted 
}) {
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    
    const handleRedeemReward = async (reward) => {
        if (!currentUser) {
            alert('Anda harus login terlebih dahulu!');
            return;
        }

        if (hasPendingRequest) {
            alert('Anda masih memiliki request penukaran yang sedang diproses. Mohon tunggu hingga request sebelumnya selesai direview oleh admin.');
            return;
        }

        if (totalPoints < reward.points) {
            alert('Poin Anda tidak cukup untuk menukar hadiah ini!');
            return;
        }

        const confirmMessage = `Apakah Anda yakin ingin menukar hadiah "${reward.name}" dengan ${reward.points.toLocaleString('id-ID')} poin?\n\nRequest akan direview oleh admin terlebih dahulu.`;
        
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setSubmitting(true);

        try {
            await addDoc(collection(db, "rewardRequests"), {
                userId: currentUser.uid,
                userName: userData?.name || userData?.email || "User",
                userEmail: userData?.email || "-",
                rewardId: reward.id,
                rewardName: reward.name,
                rewardPoints: reward.points,
                userCurrentPoints: totalPoints,
                status: "pending",
                createdAt: serverTimestamp(),
            });

            setSuccessMessage(`Request penukaran "${reward.name}" berhasil dikirim!`);
            setShowSuccess(true);
            
            if (onRequestSubmitted) {
                await onRequestSubmitted();
            }
            
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (error) {
            console.error("Submit reward request error:", error);
            alert('Gagal mengirim request penukaran hadiah. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#C9A24A] border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading rewards...</p>
            </div>
        );
    }

    if (rewards.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-2xl">
                <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada hadiah tersedia</p>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending": return Clock;
            case "approved": return CheckCircle;
            case "rejected": return XCircle;
            default: return AlertCircle;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "approved": return "text-green-600 bg-green-50 border-green-200";
            case "rejected": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending": return "Menunggu Review";
            case "approved": return "Disetujui";
            case "rejected": return "Ditolak";
            default: return status;
        }
    };

    return (
        <>
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Berhasil!</h3>
                        <p className="text-gray-600">{successMessage}</p>
                        <p className="text-sm text-gray-500 mt-2">Request Anda menunggu persetujuan admin.</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3 mb-2">
                            <Gift className="text-[#C9A24A] w-7 h-7 sm:w-8 sm:h-8" /> 
                            Katalog Hadiah
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            Tukarkan poin Anda dengan hadiah menarik
                        </p>
                    </div>
                </div>

                {userRewardRequests && userRewardRequests.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-[#C9A24A]/20">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#C9A24A]" />
                            Status Request Penukaran Anda
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {userRewardRequests.map(req => {
                                const StatusIcon = getStatusIcon(req.status);
                                return (
                                    <div 
                                        key={req.id}
                                        className={`p-4 rounded-xl border-2 ${getStatusColor(req.status)} transition-all`}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-1">{req.rewardName}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {req.rewardPoints?.toLocaleString('id-ID')} poin
                                                </p>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {getStatusText(req.status)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            {req.createdAt?.toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        {req.status === "rejected" && req.rejectionReason && (
                                            <div className="mt-2 pt-2 border-t border-red-200">
                                                <p className="text-xs text-red-700">
                                                    <strong>Alasan:</strong> {req.rejectionReason}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {hasPendingRequest && (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-yellow-800 mb-1">
                                Penukaran Ditangguhkan
                            </p>
                            <p className="text-sm text-yellow-700">
                                Anda memiliki request penukaran yang sedang diproses. Mohon tunggu hingga admin mereview request Anda sebelum melakukan penukaran baru.
                            </p>
                        </div>
                    </div>
                )}

                <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm sm:text-base text-blue-800 leading-relaxed">
                        <strong>Informasi:</strong> Pihak <strong>PT Imah Teuweul Indonesia</strong> berhak mengubah 
                        nilai poin atau jenis hadiah sewaktu-waktu dengan pemberitahuan terlebih dahulu.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {rewards.map(r => {
                        const canClaim = totalPoints >= r.points && !hasPendingRequest;
                        const pointsNeeded = r.points - totalPoints;
                        
                        return (
                            <div 
                                key={r.id} 
                                className={`group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                                    canClaim 
                                        ? 'border-2 border-[#C9A24A] hover:-translate-y-2' 
                                        : 'border border-gray-200 hover:-translate-y-1'
                                }`}
                            >
                                {canClaim && (
                                    <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#C9A24A] to-[#B8933D] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        Tersedia
                                    </div>
                                )}

                                {hasPendingRequest && totalPoints >= r.points && (
                                    <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        Pending Request
                                    </div>
                                )}

                                <div className={`h-40 sm:h-48 bg-gradient-to-br ${
                                    canClaim 
                                        ? 'from-[#C9A24A]/20 to-[#B8933D]/20' 
                                        : 'from-gray-100 to-gray-200'
                                } flex items-center justify-center relative overflow-hidden`}>
                                    {!canClaim && totalPoints < r.points && (
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                                            <Lock className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    {hasPendingRequest && totalPoints >= r.points && (
                                        <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[1px] flex items-center justify-center">
                                            <Clock className="w-12 h-12 text-yellow-600" />
                                        </div>
                                    )}
                                    <Gift className={`w-16 h-16 sm:w-20 sm:h-20 ${
                                        canClaim ? 'text-[#C9A24A]' : 'text-gray-300'
                                    } transition-transform duration-300 ${
                                        canClaim ? 'group-hover:scale-110' : ''
                                    }`} />
                                </div>

                                <div className="p-4 sm:p-5 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#C9A24A] transition-colors">
                                            {r.name}
                                        </h3>
                                        
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                                                canClaim 
                                                    ? 'bg-gradient-to-r from-[#C9A24A]/10 to-[#B8933D]/10' 
                                                    : 'bg-gray-100'
                                            }`}>
                                                <Award className={`w-4 h-4 ${
                                                    canClaim ? 'text-[#C9A24A]' : 'text-gray-400'
                                                }`} />
                                                <span className={`font-bold text-sm ${
                                                    canClaim ? 'text-[#C9A24A]' : 'text-gray-600'
                                                }`}>
                                                    {r.points.toLocaleString('id-ID')} poin
                                                </span>
                                            </div>
                                        </div>

                                        {!canClaim && pointsNeeded > 0 && !hasPendingRequest && (
                                            <div className="mb-3">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Progress</span>
                                                    <span>{Math.round((totalPoints / r.points) * 100)}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-[#C9A24A] to-[#B8933D] rounded-full transition-all duration-500" 
                                                        style={{ width: `${Math.min((totalPoints / r.points) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {pointsNeeded.toLocaleString('id-ID')} poin lagi
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => canClaim && handleRedeemReward(r)}
                                        disabled={!canClaim || submitting}
                                        className={`w-full py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2 ${
                                            canClaim 
                                                ? 'bg-gradient-to-r from-[#C9A24A] to-[#B8933D] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        } ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Mengirim...</span>
                                            </>
                                        ) : hasPendingRequest && totalPoints >= r.points ? (
                                            <>
                                                <Clock className="w-4 h-4" />
                                                <span>Request Pending</span>
                                            </>
                                        ) : canClaim ? (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Request Penukaran</span>
                                            </>
                                        ) : (
                                            "Kumpulkan Poin"
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </>
    );
}