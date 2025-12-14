import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

import Navbar from "./components/Navbar";
import HeroPoints from "./components/HeroPoints";
import StatsGrid from "./components/StatsGrid";
import RewardCatalog from "./components/RewardCatalog";
import Footer from "./components/Footer";

import { getUserRank } from "./utils/pointUtils"

export default function ResellerPage() {
    const { userData, currentUser } = useAuth();
    const [resellers, setResellers] = useState([]);
    
    const totalPoints = userData?.points || 0;
    const targetPoints = 500;
    const progress = (totalPoints / targetPoints) * 100;

    const rank = getUserRank(resellers, currentUser?.uid)

    const [rewards, setRewards] = useState([]);
    const [loadingRewards, setLoadingRewards] = useState(true);

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
            if (!currentUser) return;

            const ref = collection(
                db,
                "users",
                currentUser.uid,
                "pointHistory"
            );

            const snap = await getDocs(ref);

            const total = snap.docs.reduce(
                (sum, d) => sum + (d.data().amount || 0),
                0
            );

            setTotalHistory(total);
        };

        fetchMyPointHistory();

    }, [ currentUser ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-[#C9A24A]/10 to-white">
            <Navbar user={userData} totalPoints={totalPoints} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 space-y-8">
                <div className="hidden md:block fixed top-20 right-10 w-72 h-72 bg-[#C9A24A]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div
                    className="hidden md:block fixed bottom-20 left-10 w-96 h-96 bg-[#C9A24A]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
                <HeroPoints
                    totalPoints={totalPoints}
                    progress={progress}
                    targetPoints={targetPoints}
                />

                <StatsGrid
                    userData={userData}
                    totalPoints={totalPoints}
                    rank={rank}
                />

                <RewardCatalog
                    rewards={rewards}
                    loading={loadingRewards}
                    totalPoints={totalPoints}
                />
            </main>

            <Footer />
        </div>
    );
}
