import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Link reset password telah dikirim ke email Anda.");
        } catch (err) {
            setError("Email tidak terdaftar atau terjadi kesalahan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-[#C9A24A]/10 to-white flex items-center justify-center p-4 relative overflow-hidden">
            <div className="fixed top-20 right-10 w-72 h-72 bg-[#C9A24A]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div
                className="fixed bottom-20 left-10 w-96 h-96 bg-[#C9A24A]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                style={{ animationDelay: "2s" }}
            ></div>

            <div className="w-full max-w-md relative z-10">

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#C9A24A]/20">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#C9A24A] to-[#B8933D] rounded-2xl flex items-center justify-center shadow-lg">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[#080808] mb-2">
                            Reset Password
                        </h2>
                        <p className="text-gray-600">
                            Masukkan email Anda dan kami akan mengirimkan link untuk reset password
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-800 leading-relaxed">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800 leading-relaxed">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[#080808] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#C9A24A] focus:ring-4 focus:ring-[#C9A24A]/10 outline-none transition-all text-[#080808] placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleResetPassword}
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-[#C9A24A] to-[#B8933D] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5" />
                                    Kirim Link Reset
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-600">
                            Ingat password Anda?{" "}
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="font-semibold text-[#C9A24A] hover:text-[#B8933D] transition-colors"
                            >
                                <span>Login di sini</span>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;