import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Lock, Loader2 } from "lucide-react";

const LoadingScreen = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-[#C9A24A]/10 to-white flex items-center justify-center relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="fixed top-20 right-10 w-72 h-72 bg-[#C9A24A]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div
                className="fixed bottom-20 left-10 w-96 h-96 bg-[#C9A24A]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                style={{ animationDelay: "2s" }}
            ></div>

            {/* Loading Content */}
            <div className="relative z-10 text-center">
                {/* Animated Icon Container */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        {/* Spinning Ring */}
                        <div className="w-24 h-24 rounded-full border-4 border-[#C9A24A]/20 border-t-[#C9A24A] animate-spin"></div>
                        
                        {/* Center Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#C9A24A] to-[#B8933D] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold text-[#080808] mb-2">
                    Tunggu Sebentar...
                </h2>

                {/* Loading Dots Animation */}
                <div className="flex gap-2 justify-center mt-6">
                    <div className="w-2 h-2 bg-[#C9A24A] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-[#C9A24A] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-[#C9A24A] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
            </div>
        </div>
    );
};

const ProtectedRoute = ({ role, children }) => {
    const { currentUser, userData, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (role && userData?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
