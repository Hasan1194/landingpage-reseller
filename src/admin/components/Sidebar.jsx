import { Users, Gift } from "lucide-react";


export default function Sidebar({ activePage, setActivePage }) {
    return (
        <aside className="w-64 bg-white shadow-lg p-6">
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
        </nav>
        </aside>
    );
}
