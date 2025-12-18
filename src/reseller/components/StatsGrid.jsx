import { TrendingUp, Gift, Award } from "lucide-react"; 

export default function StatsGrid({ userData, totalPoints, rank, openHistory }) {
    const income = totalPoints * 50000;

    const formatMoney = (value) =>
        value.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

    const stats = [
        {
            label: "Total Penjualan",
            value: formatMoney(income),
            icon: TrendingUp,
            color: "bg-blue-500",
            onClick: () => onOpenHistory("earn")
        },
        {
            label: "Hadiah Ditukar",
            value: userData?.prize || 0,
            icon: Gift,
            color: "bg-purple-500",
            onClick: () => onOpenHistory("redeem")
        },
        {
            label: "Peringkat",
            value: rank ? `#${rank}` : "-",
            icon: Award,
            color: "bg-[#C9A24A]"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {stats.map((stat, i) => (
                <div 
                key={i}
                onClick={stat.onClick}
                className="group bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-500 text-xs sm:text-sm font-medium mb-2">{stat.label}</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                                {typeof stat.value === 'number' && stat.label !== "Peringkat" ? stat.value.toLocaleString('id-ID') : stat.value}
                            </p>
                            {stat.change && (
                                <div className="flex items-center gap-1 mt-2">
                                    <ArrowUp className="w-3 h-3 text-green-500" />
                                    <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                                    <span className="text-xs text-gray-400">bulan ini</span>
                                </div>
                            )}
                        </div>
                        <div className={`${stat.bgColor} w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                            <div className={`bg-gradient-to-br ${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}>
                                <stat.icon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
