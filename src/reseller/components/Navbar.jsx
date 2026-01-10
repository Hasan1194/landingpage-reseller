import { Award, ChevronDown, LogOut, User, Menu, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, totalPoints }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const logout = async () => {
        await signOut(auth);
        navigate("/login", { replace: true });
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-[#C9A24A]/30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div>
                            <img
                                rel="icon" 
                                type="image/svg+xml"
                                src="/icon.svg"
                                alt="PT Imah Teuweul Indonesia"
                                className="h-8 sm:h-10 md:h-12 w-auto hover:opacity-90 transition"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#C9A24A] to-[#B8933D] bg-clip-text text-transparent">
                            MaKun Reseller
                        </h3>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                            <button 
                                onClick={() => setOpen(!open)} 
                                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#C9A24A]/20 to-[#B8933D]/20 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full hover:from-[#C9A24A]/30 hover:to-[#B8933D]/30 transition-all"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-[#C9A24A] to-[#B8933D] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <span className="font-semibold text-sm max-w-[120px] truncate">{user?.name || "User"}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-2xl shadow-2xl border border-[#C9A24A]/20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-semibold text-sm">{user?.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3 bg-gray-50 p-2 rounded-lg">
                                        <Award className="w-4 h-4 text-[#C9A24A]" />
                                        <span className="text-sm font-medium">{totalPoints} poin</span>
                                    </div>
                                    <button onClick={logout} className="w-full mt-2 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors text-sm font-medium">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden border-t bg-white py-4 space-y-4">
                        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#C9A24A]/10 to-[#B8933D]/10 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#C9A24A] to-[#B8933D] rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg mx-4">
                            <span className="text-sm font-medium">Total Poin</span>
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#C9A24A]" />
                                <span className="font-bold text-lg">{totalPoints}</span>
                            </div>
                        </div>

                        <button onClick={logout} className="mx-4 w-[calc(100%-2rem)] flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-3 rounded-lg transition-colors font-medium">
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
