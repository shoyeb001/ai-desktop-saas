import Header from "@/components/common/header";
import {
    FileText,
    Captions,
    Youtube,
    Sparkles,
    Type,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const tools = [
    {
        title: "AI Article Writer",
        desc: "Generate full-length articles instantly",
        color: "bg-blue-100",
        text: "text-blue-700",
        icon: FileText,
        link: "/article-writer"
    },
    {
        title: "Captions Generator",
        desc: "Auto-write captions for videos & reels",
        color: "bg-purple-100",
        text: "text-purple-700",
        icon: Captions,
        link: "/captions-generator"
    },
    {
        title: "AI YouTube Script",
        desc: "Create engaging long/short scripts",
        color: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Youtube,
        link: "/yt-script"
    },
    {
        title: "AI Topic Generator",
        desc: "Find trending niche YouTube topics",
        color: "bg-green-100",
        text: "text-green-700",
        icon: Sparkles,
        link: "/yt-topic-generator"
    },
    {
        title: "AI Humanizer",
        desc: "Humanize AI-generated content",
        color: "bg-pink-100",
        text: "text-pink-700",
        icon: Type,
        link: "/humanizer"
    }
];

export default function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="w-full h-full p-6 bg-[#F5F7FE] text-gray-900">
            <Header />

            {/* Tools Section */}
            <div className="mt-8">

                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tools.map((tool, index) => {
                        const Icon = tool.icon;
                        return (
                            <div
                                key={index}
                                className={`rounded-2xl p-6 shadow-sm ${tool.color} hover:shadow-md transition-all cursor-pointer hover:-translate-y-1`}
                                onClick={() => navigate(tool.link)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Icon size={20} className={tool.text} />
                                    </div>
                                    <h3 className={`text-lg font-semibold ${tool.text}`}>
                                        {tool.title}
                                    </h3>
                                </div>

                                <p className="text-sm text-gray-600">{tool.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
