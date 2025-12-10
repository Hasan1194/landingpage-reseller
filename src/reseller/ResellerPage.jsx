import React, { useState, useEffect, useRef } from "react";
import { Gift, TrendingUp, Award, LogOut, User, Settings, ChevronDown  } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc, arrayUnion, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

export default function ResellerPage() {
    const { userData } = useAuth();
    const totalPoints = userData?.points || 0;
    const targetPoints = 500;
    const progress = (totalPoints / targetPoints) * 100;
    const [selectedReward, setSelectedReward] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [totalHistory, setTotalHistory] = useState(0);

    const redeemReward = (reward) => {
        if (totalPoints < reward.points) return;

        const message = `*PENUKARAN HADIAH RESELLER*

Halo Admin MaKun! 

Saya ingin menukar poin dengan hadiah berikut:

*Detail Reseller:*
- Nama: ${userData?.name || "User"}
- Total Poin: ${totalPoints} pts

*Hadiah yang Dipilih:*
- ${reward.name}
- Poin Dibutuhkan: ${reward.points} pts

*Sisa Poin Setelah Penukaran:*
- ${totalPoints - reward.points} pts

Mohon konfirmasi penukaran hadiah ini ya, Admin!

Terima kasih`;

        const encodedMessage = encodeURIComponent(message);
        const adminPhone = "628157101469";

        window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, "_blank");
    };

    useEffect(() => {
        const fetchTotalPointsHistory = async () => {
            try {
                const userDocId = userData.id;

                const historyRef = collection(db, "users", userDocId, "pointHistory");
                const querySnapshot = await getDocs(historyRef);

                let total = 0;
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.amount) total += data.amount;
                });

                setTotalHistory(total);
            } catch (error) {
                console.error("Error fetching point history:", error);
            }
        };

        fetchTotalPointsHistory();

        const fetchRewards = async () => {
            try {
                setLoading(true);
                const rewardsRef = collection(db, "rewards");
                const snapshot = await getDocs(rewardsRef);
                
                const rewardsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                rewardsData.sort((a, b) => a.points - b.points);

                setRewards(rewardsData);
            } catch (error) {
                console.error("Error fetching rewards:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRewards();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const income = totalPoints * 50000;

    const formatMoney = (value) =>
        value.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

    const stats = [
        { label: "Total Penjualan", value: formatMoney(income), icon: TrendingUp, color: "bg-blue-500" },
        { label: "Hadiah Ditukar", value: userData?.prize || 0, icon: Gift, color: "bg-purple-500" },
        { label: "Peringkat", value: "#12", icon: Award, color: "bg-[#C9A24A]" },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-[#C9A24A]/10 to-white">
            {/* Navbar with glassmorphism */}
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-[#C9A24A]/30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div>
                            <img
                                src="/icon.png"
                                alt="PT Imah Teuweul Indonesia"
                                className="h-12 w-auto hover:opacity-90 transition"
                            />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C9A24A] to-[#B8933D] bg-clip-text text-transparent">
                            MaKun Reseller
                        </h3>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 bg-gradient-to-r from-[#C9A24A]/20 to-[#B8933D]/20 px-4 py-2 rounded-full hover:from-[#C9A24A]/30 hover:to-[#B8933D]/30 transition-all"
                        >
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=AsepMadu"
                                alt="profile"
                                className="w-9 h-9 rounded-full border-2 border-white shadow"
                            />
                            <span className="font-semibold text-[#080808] hidden sm:block">
                                {userData?.name || "User"}
                            </span>
                            <ChevronDown 
                                className={`w-4 h-4 text-[#080808] transition-transform duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[#C9A24A]/20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-semibold text-[#080808]">{userData?.name}</p>
                                    <p className="text-sm text-gray-600">{userData?.email}</p>
                                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-[#C9A24A]/10 rounded-full">
                                        <Award className="w-4 h-4 text-[#C9A24A]" />
                                        <span className="text-xs font-semibold text-[#C9A24A]">
                                            {totalPoints} Poin
                                        </span>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            // Navigate to profile
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#080808]">Profil Saya</p>
                                            <p className="text-xs text-gray-500">Kelola informasi akun</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Logout Button */}
                                <div className="border-t border-gray-100 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left group"
                                    >
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                            <LogOut className="w-4 h-4 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-red-600">Keluar</p>
                                            <p className="text-xs text-gray-500">Logout dari akun</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Decorative background elements */}
            <div className="fixed top-20 right-10 w-72 h-72 bg-[#C9A24A]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div
                className="fixed bottom-20 left-10 w-96 h-96 bg-[#C9A24A]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8 relative">
                {/* Hero Points Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#C9A24A] via-[#B8933D] to-[#A8832D] p-8 rounded-3xl shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-6 h-6 text-white/90" />
                            <span className="text-white/90 font-medium">Total Poin Kamu Saat ini</span>
                        </div>
                        <h2 className="text-6xl font-black text-white mb-1">{totalPoints}</h2>
                        <p className="text-white/80 text-lg">poin terkumpul</p>
                        <p className="text-white/80 text-lg">
                            Total keseluruhan poin yang pernah kamu dapat:  
                            <span className="font-bold text-white">{totalHistory}</span>
                        </p>
                        {/* Animated Progress Bar */}
                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between text-sm text-white/90">
                                <span>Progress ke hadiah pertama</span>
                                <span className="font-bold">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                                <div
                                    className="h-4 bg-gradient-to-r from-white to-white/80 rounded-full shadow-lg transition-all duration-700 ease-out flex items-center justify-end pr-2"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <p className="text-white/80 text-sm">
                                🎯 {targetPoints - totalPoints > 0 ? `${targetPoints - totalPoints} poin lagi untuk` : 'Kamu sudah bisa menukar'} <span className="font-bold text-white">Hadiah Pertama</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#C9A24A]/20 group cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-[#080808]">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Rewards Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-[#080808] flex items-center gap-2">
                                <Gift className="w-7 h-7 text-[#C9A24A]" />
                                Katalog Hadiah
                            </h2>
                            <p className="text-gray-600 mt-1">Tukar poin dengan hadiah menarik</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A24A]"></div>
                        </div>
                    ) : rewards.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-md">
                            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Belum ada hadiah tersedia</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {rewards.map((reward) => {
                                const canClaim = totalPoints >= reward.points;
                                return (
                                    <div
                                        key={reward.id}
                                        className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#C9A24A]/20 cursor-pointer"
                                        onClick={() => setSelectedReward(reward)}
                                    >
                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4 z-10 bg-[#C9A24A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            {reward.status || "Tersedia"}
                                        </div>

                                        {/* Image Container */}
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                                            <img
                                                src={reward.image || "/icon.png"}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt={reward.name}
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                                }}
                                            />
                                            {!canClaim && (
                                                <div className="absolute inset-0 bg-[#080808]/40 backdrop-blur-[2px] flex items-center justify-center">
                                                    <div className="text-white text-center">
                                                        <p className="font-bold text-lg">🔒 Terkunci</p>
                                                        <p className="text-sm">{reward.points - totalPoints} poin lagi</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-[#080808] mb-2">{reward.name}</h3>
                                            {reward.description && (
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{reward.description}</p>
                                            )}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Award className="w-5 h-5 text-[#C9A24A]" />
                                                    <span className="text-[#C9A24A] font-bold text-lg">{reward.points}</span>
                                                    <span className="text-gray-500 text-sm">poin</span>
                                                </div>
                                                {canClaim && (
                                                    <span className="text-green-600 text-sm font-semibold">✓ Bisa ditukar</span>
                                                )}
                                            </div>
                                            <button
                                                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                                                    canClaim 
                                                        ? 'bg-gradient-to-r from-[#C9A24A] to-[#B8933D] text-white shadow-lg hover:shadow-xl hover:scale-105 hover:brightness-110' 
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (canClaim) redeemReward(reward);
                                                }}
                                                disabled={!canClaim}
                                            >
                                                {canClaim ? 'Konfirmasi via WhatsApp' : 'Kumpulkan Poin'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Tips Card */}
                {/* <div className="bg-gradient-to-r from-[#C9A24A] to-[#A8832D] p-6 rounded-2xl shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">💡 Tips Kumpulkan Poin Lebih Cepat!</h3>
                            <p className="text-white/90 text-sm leading-relaxed">
                                Ajak 3 teman jadi reseller dan dapatkan bonus 100 poin! Setiap penjualan produk premium juga dapat poin 2x lipat.
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Footer */}
            <footer className="bg-[#080808ff] text-gray-300 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 md:px-16 text-center">
                    <h3 className="text-2xl font-bold mb-2">PT Imah Teuweul Indonesia</h3>
                    <p className="opacity-80 mb-4 text-sm">
                        Madu Asli Berkualitas dari Kuningan
                    </p>
                    <p className="text-xs opacity-50 mb-2">
                        © 2025 PT Imah Teuweul Indonesia — All Rights Reserved
                    </p>

                    {/* Designed By */}
                    <p className="text-xs opacity-60 mt-1">
                        Designed by <span className="font-semibold">LinioDev</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}