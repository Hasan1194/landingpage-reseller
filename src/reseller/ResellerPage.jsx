import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { Plus } from "lucide-react";

import Navbar from "./components/Navbar";
import HeroPoints from "./components/HeroPoints";
import StatsGrid from "./components/StatsGrid";
import PointHistoryModal from "./components/PointHistoryModal";
import PointRequestModal from "./components/PointRequestModal";
import RewardCatalog from "./components/RewardCatalog";
import Footer from "./components/Footer";

import { getUserRank } from "./utils/pointUtils"

export default function ResellerPage() {
    const { userData, currentUser } = useAuth();
    const [resellers, setResellers] = useState([]);
    
    const totalPoints = userData?.points || 0;

    const rank = getUserRank(resellers, currentUser?.uid)

    const [rewards, setRewards] = useState([]);
    const [loadingRewards, setLoadingRewards] = useState(true);

    const [pointHistory, setPointHistory] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [historyType, setHistoryType] = useState(null);

    // State untuk reward requests user
    const [userRewardRequests, setUserRewardRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);

    const totalEarnedPoints = pointHistory
        .filter(h => h.type === "earn")
        .reduce((sum, h) => sum + (h.amount || 0), 0);

    const nextReward = rewards.find(reward => reward.points > totalPoints);
    const targetPoints = nextReward ? nextReward.points : (rewards.length > 0 ? rewards[rewards.length - 1].points : 500);
    
    const progress = targetPoints > 0 ? (totalPoints / targetPoints) * 100 : 0;

    // Check apakah user punya pending request
    const hasPendingRequest = userRewardRequests.some(req => req.status === "pending");

    const openHistoryModal = (type) => {
        setHistoryType(type);
        setShowHistoryModal(true);
    };

    const closeHistoryModal = () => {
        setShowHistoryModal(false);
        setHistoryType(null);
    };

    const openRequestModal = () => {
        setShowRequestModal(true);
    };

    const closeRequestModal = () => {
        setShowRequestModal(false);
    };

    const fetchUserRewardRequests = async () => {
        if (!currentUser) {
            setLoadingRequests(false);
            return;
        }

        try {
            const q = query(
                collection(db, "rewardRequests"),
                where("userId", "==", currentUser.uid),
                orderBy("createdAt", "desc"),
                limit(10)
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));

            setUserRewardRequests(data);
        } catch (error) {
            console.error("Error fetching user reward requests:", error);
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const snap = await getDocs(collection(db, "rewards"));
                const data = snap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => a.points - b.points);

                setRewards(data);
            } catch (e) {
                console.error("Fetch rewards error:", e);
            } finally {
                setLoadingRewards(false);
            }
        };

        fetchRewards();

        const fetchResellers = async () => {
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "resellers")
                );

                const snapshot = await getDocs(q);

                const resellerData = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const userId = docSnap.id;
                        const user = docSnap.data();

                        const historyRef = collection(
                            db,
                            "users",
                            userId,
                            "pointHistory"
                        );
                        const historySnap = await getDocs(historyRef);

                        const totalHistoryPoint = historySnap.docs.reduce(
                            (sum, d) => {
                                const data = d.data();
                                return data.type === "earn" ? sum + data.amount : sum;
                            },
                            0
                        );

                        return {
                            id: userId,
                            ...user,
                            totalPoints: totalHistoryPoint 
                        };
                    })
                );

                setResellers(resellerData);

            } catch (error) {
                console.error("Error fetch resellers:", error);
            }
        };

        fetchResellers();

        const fetchMyPointHistory = async () => {
            if (!currentUser) {
                return;
            }

            try {
                const ref = collection(
                    db,
                    "users",
                    currentUser.uid,
                    "pointHistory"
                );

                const snap = await getDocs(ref);
                
                const history = snap.docs.map(d => {
                    const data = d.data();
                    return {
                        id: d.id,
                        ...data
                    };
                });

                setPointHistory(history);
            } catch (error) {
                console.error("Error fetching point history:", error);
            }
        };

        fetchMyPointHistory();
        fetchUserRewardRequests();

    }, [ currentUser ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-[#C9A24A]/10 to-white">
            <Navbar user={userData} totalPoints={totalPoints} />
            
            {/* Floating Request Button */}
            <button
                onClick={openRequestModal}
                className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-[#C9A24A] to-[#B8933D] text-white p-4 rounded-full shadow-2xl hover:shadow-[0_10px_40px_rgba(201,162,74,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
                title="Request Tambah Poin"
            >
                <Plus className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold">
                    Request Poin
                </span>
            </button>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 space-y-8">
                <div className="hidden md:block fixed top-20 right-10 w-72 h-72 bg-[#C9A24A]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div
                    className="hidden md:block fixed bottom-20 left-10 w-96 h-96 bg-[#C9A24A]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
                
                <HeroPoints
                    totalPoints={totalPoints}
                    totalEarnedPoints={totalEarnedPoints}
                    progress={progress}
                    targetPoints={targetPoints}
                    nextReward={nextReward}
                />

                <StatsGrid
                    userData={userData}
                    totalPoints={totalPoints}
                    rank={rank}
                    onOpenHistory={openHistoryModal}
                />

                <RewardCatalog
                    rewards={rewards}
                    loading={loadingRewards}
                    totalPoints={totalPoints}
                    userData={userData}
                    currentUser={currentUser}
                    hasPendingRequest={hasPendingRequest}
                    userRewardRequests={userRewardRequests}
                    onRequestSubmitted={fetchUserRewardRequests}
                />

                {showHistoryModal && (
                    <PointHistoryModal
                        type={historyType}
                        data={pointHistory}
                        onClose={closeHistoryModal}
                    />
                )}

                {showRequestModal && (
                    <PointRequestModal
                        currentUser={currentUser}
                        onClose={closeRequestModal}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}