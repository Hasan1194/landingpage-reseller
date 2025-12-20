import { Award, TrendingUp, Trophy, Target } from "lucide-react";

export default function HeroPoints({ 
    totalPoints, 
    totalEarnedPoints, 
    progress, 
    targetPoints, 
    nextReward 
}) {
    const allRewardsCompleted = !nextReward;
    
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#C9A24A] via-[#B8933D] to-[#A8832D] p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Award className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <span className="text-white/80 text-xs sm:text-sm font-medium">Poin Saat Ini</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                <span className="text-white text-xs">Aktif</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Badge Total Earned */}
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-white text-xs font-medium">
                            Total Earned: {totalEarnedPoints.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <div className="mb-6 sm:mb-8">
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight">
                        {totalPoints.toLocaleString('id-ID')}
                    </h2>
                    <p className="text-white/70 text-sm sm:text-base mt-2">
                        {allRewardsCompleted 
                            ? "Selamat! Semua reward telah tercapai 🎊"
                            : `Menuju ${nextReward?.name || 'Reward Berikutnya'}`
                        }
                    </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            {allRewardsCompleted ? (
                                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            <span className="text-sm sm:text-base font-medium">
                                {allRewardsCompleted ? "Progress Lengkap" : "Progress ke Hadiah"}
                            </span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold">
                            {Math.round(Math.min(progress, 100))}%
                        </span>
                    </div>
                    
                    <div className="relative">
                        <div className="h-3 sm:h-4 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden" 
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white to-white/90 animate-pulse"></div>
                                {progress >= 100 && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                                )}
                            </div>
                        </div>
                        
                        {!allRewardsCompleted && (
                            <div className="flex justify-between items-center mt-1.5 text-white/60 text-xs">
                                <span>0</span>
                                <span className="font-semibold">{targetPoints.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                        {allRewardsCompleted ? (
                            <div className="flex items-center gap-2 text-white">
                                <Trophy className="w-5 h-5" />
                                <p className="text-sm sm:text-base font-medium">
                                    Anda telah mencapai semua milestone! 🎉
                                </p>
                            </div>
                        ) : (
                            <p className="text-white text-sm sm:text-base font-medium">
                                {targetPoints - totalPoints > 0
                                    ? `${(targetPoints - totalPoints).toLocaleString('id-ID')} poin lagi untuk ${nextReward?.name || 'hadiah berikutnya'}`
                                    : "Siap ditukar! 🎉"}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}