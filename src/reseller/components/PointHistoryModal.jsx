import { X } from "lucide-react";

export default function PointHistoryModal({ type, data, onClose }) {
    
    const filtered = data.filter(d => d.type === type);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    <X />
                </button>

                <h2 className="text-xl font-bold mb-4">
                    {type === "earn" ? "Riwayat Penjualan" : "Riwayat Penukaran Hadiah"}
                </h2>

                <div className="max-h-80 overflow-y-auto space-y-2">
                    {filtered.length === 0 && (
                        <p className="text-gray-500 text-sm">Tidak ada data</p>
                    )}

                    {filtered.map(item => (
                        <div
                            key={item.id}
                            className="flex justify-between bg-gray-50 p-3 rounded-lg"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">
                                    {item.source || item.description || "-"}
                                </span>
                                {item.timestamp && (
                                    <span className="text-xs text-gray-400">
                                        {new Date(item.timestamp?.seconds * 1000).toLocaleDateString('id-ID')}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`font-semibold ${
                                    item.type === "earn"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {item.type === "earn" ? "+" : ""}
                                {item.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}