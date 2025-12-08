import { Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    return (
        <header className="flex items-center justify-between pb-4 border-b border-gray-700">
            <div className="flex items-center gap-2 text-lg font-medium">
                <div className="w-5 h-5 bg-brandBlue rounded-full" />
                <span>AI Tool</span>
            </div>

            <div className="flex items-center gap-4">
                <button className="bg-darkCard p-2 rounded-lg hover:bg-gray-700 transition" onClick={() => navigate("/settings")}>
                    <Settings size={18} />
                </button>

                <button className="bg-darkCard p-2 rounded-lg hover:bg-gray-700 transition">
                    <Bell size={18} />
                </button>

                <div className="w-9 h-9 rounded-full bg-gray-500" />
            </div>
        </header>
    );
}
