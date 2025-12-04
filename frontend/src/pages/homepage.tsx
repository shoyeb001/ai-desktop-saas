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
        <div className="w-full h-screen bg-darkBg text-darkText px-10 py-6">
            <Header />
            <div className="mt-10">
                <h1 className="text-3xl font-bold">
                    Welcome back, what will you create today?
                </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-5xl">

                {tools.map((tool, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(tool.link)}
                        className="
              bg-darkCard 
              p-6 
              rounded-2xl 
              shadow 
              hover:bg-[#243045] 
              transition 
              cursor-pointer
            "
                    >
                        <div className="w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center mb-4">
                            <tool.icon />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                            {tool.title}
                        </h3>
                        <p className="text-darkTextSecondary text-sm">
                            {tool.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
