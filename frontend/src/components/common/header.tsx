import React from "react";
import { Settings, User, Sparkles } from "lucide-react";

export default function Header() {
    return (
        <header className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <Sparkles className="text-blue-600" size={28} />
                <span>AI Social Desktop</span>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-4">
                <Settings
                    size={22}
                    className="cursor-pointer text-gray-700 hover:text-black transition"
                />

                <div className="w-9 h-9 rounded-full bg-gray-300 border border-gray-400 cursor-pointer" />
            </div>
        </header>
    );
}
