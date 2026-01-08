import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ResellerManagement from "./components/ResellerManagement";
import RewardManagement from "./components/RewardManagement";
import PointApprovalManagement from "./components/PointApprovalManagement";

export default function AdminPage() {
    const [activePage, setActivePage] = useState("approval");

    return (
        <div className="flex min-h-screen bg-gray-100">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

            <div className="flex-1 p-8">
                {activePage === "approval" && <PointApprovalManagement />}
                {activePage === "reseller" && <ResellerManagement />}
                {activePage === "reward" && <RewardManagement />}
            </div>
        </div>
    );
}
