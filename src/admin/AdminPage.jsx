import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ResellerManagement from "./components/ResellerManagement";
import RewardManagement from "./components/RewardManagement";

export default function AdminPage() {
    const [activePage, setActivePage] = useState("reseller");

    return (
        <div className="flex min-h-screen bg-gray-100">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <div className="flex-1 p-8">
            {activePage === "reseller" && <ResellerManagement />}
            {activePage === "reward" && <RewardManagement />}
        </div>
        </div>
    );
}
