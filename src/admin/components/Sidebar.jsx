import { Users, Gift, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ activePage, setActivePage }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login", { replace: true });
    };

    return (
        <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold text-yellow-500 mb-8">Admin Panel</h1>

                <nav className="space-y-3">
                    <button
                        onClick={() => setActivePage("reseller")}
                        className={`flex items-center gap-3 p-3 w-full rounded-lg font-medium ${
                            activePage === "reseller"
                                ? "bg-yellow-400 text-white"
                                : "hover:bg-yellow-100"
                        }`}
                    >
                        <Users size={20} /> Kelola Reseller
                    </button>

                    <button
                        onClick={() => setActivePage("reward")}
                        className={`flex items-center gap-3 p-3 w-full rounded-lg font-medium ${
                            activePage === "reward"
                                ? "bg-yellow-400 text-white"
                                : "hover:bg-yellow-100"
                        }`}
                    >
                        <Gift size={20} /> Kelola Reward
                    </button>

                    {/* <button
                        onClick={() => setActivePage("redeem")}
                        className={`flex items-center gap-3 p-3 w-full rounded-lg font-medium ${
                            activePage === "redeem"
                                ? "bg-yellow-400 text-white"
                                : "hover:bg-yellow-100"
                        }`}
                    >
                        <Gift size={20} /> Permintaan Redeem
                    </button> */}
                </nav>
            </div>

            {/* 🔹 Tombol Logout */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 w-full rounded-lg font-medium text-red-600 hover:bg-red-100 mt-6"
            >
                <LogOut size={20} /> Logout
            </button>
        </aside>
    );
}
