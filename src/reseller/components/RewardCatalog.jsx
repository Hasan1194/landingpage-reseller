import { Award, Gift, Lock } from "lucide-react";

export default function RewardCatalog({ rewards, loading, totalPoints, userData }) {
    const ADMIN_WHATSAPP = "628157101469"; 
    
    const handleRedeemReward = (reward) => {
        const userName = userData?.name || userData?.email || "User";
        const userEmail = userData?.email || "-";
        const currentPoints = totalPoints;
        
        const message = `Halo Admin,

Saya ingin menukar hadiah:

*Hadiah*: ${reward.name}
*Poin Diperlukan*: ${reward.points.toLocaleString('id-ID')} poin
*Poin Saya Saat Ini*: ${currentPoints.toLocaleString('id-ID')} poin

*Data Pengirim*:
Nama: ${userName}
Email: ${userEmail}

Mohon diproses. Terima kasih!`;

        const encodedMessage = encodeURIComponent(message);
        
        const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;
        
        window.open(waUrl, '_blank');
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

    return (
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

            {/* Informasi kebijakan poin & hadiah */}
            <div className="mt-10 p-4 sm:p-5 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm sm:text-base text-yellow-800 leading-relaxed">
                    <strong>Informasi:</strong> Pihak <strong>PT Imah Teuweul Indonesia</strong> berhak mengubah 
                    nilai poin atau jenis hadiah sewaktu-waktu dengan pemberitahuan terlebih dahulu.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {rewards.map(r => {
                    const canClaim = totalPoints >= r.points;
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
                            {/* Badge "Tersedia" untuk reward yang bisa diklaim */}
                            {canClaim && (
                                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#C9A24A] to-[#B8933D] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    Tersedia
                                </div>
                            )}

                            <div className={`h-40 sm:h-48 bg-gradient-to-br ${
                                canClaim 
                                    ? 'from-[#C9A24A]/20 to-[#B8933D]/20' 
                                    : 'from-gray-100 to-gray-200'
                            } flex items-center justify-center relative overflow-hidden`}>
                                {!canClaim && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                                        <Lock className="w-12 h-12 text-gray-400" />
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

                                    {!canClaim && pointsNeeded > 0 && (
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
                                    className={`w-full py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                                        canClaim 
                                            ? 'bg-gradient-to-r from-[#C9A24A] to-[#B8933D] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    disabled={!canClaim}
                                >
                                    {canClaim ? "🎁 Tukar via WhatsApp" : "Kumpulkan Poin"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}