import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { MessageSquare, Trash2, Settings, Bell } from "lucide-react";
import Header from "@/components/common/header";

const HumanizeSchema = z.object({
    text: z.string().min(10, "Enter at least 10 characters"),
    tone: z.string().min(1),
    style: z.string().min(1),
});

type HumanizeForm = z.infer<typeof HumanizeSchema>;

type HistoryItem = {
    id: string;
    input: string;
    output: string;
    tone: string;
    style: string;
    createdAt: number;
};

export default function HumanizerPage() {
    const navigate = useNavigate();

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const form = useForm<HumanizeForm>({
        resolver: zodResolver(HumanizeSchema),
        defaultValues: {
            text: "",
            tone: "Casual",
            style: "Persuasive",
        },
    });

    // Load history on mount + set listeners
    useEffect(() => {
        (async () => {
            const res = await window.electronAPI.getHumanizerHistory();
            setHistory(res);
            if (res.length) {
                setSelectedId(res[0].id);
                setOutput(res[0].output);
                form.setValue("text", res[0].input);
                form.setValue("tone", res[0].tone);
                form.setValue("style", res[0].style);
            }
        })();

        window.electronAPI.onHumanizerUpdate((item: HistoryItem) => {
            setHistory((prev) => [item, ...prev]);
            setSelectedId(item.id);
            setOutput(item.output);
            form.setValue("text", item.input);
            form.setValue("tone", item.tone);
            form.setValue("style", item.style);
        });

        window.electronAPI.onHumanizerDelete((id: string) => {
            setHistory((prev) => prev.filter((x) => x.id !== id));
            if (selectedId === id) {
                setSelectedId(null);
                setOutput("");
            }
        });
    }, []);

    const onSubmit = async (values: HumanizeForm) => {
        setLoading(true);
        try {
            const res = await window.electronAPI.humanizeText(values);
            if ("result" in res) {
                setOutput(res.result);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleHistoryClick = async (id: string) => {
        const one = await window.electronAPI.getHumanizerOne(id);
        if (!one) return;
        setSelectedId(id);
        setOutput(one.output);
        form.setValue("text", one.input);
        form.setValue("tone", one.tone);
        form.setValue("style", one.style);
    };

    const handleDelete = async (id: string) => {
        await window.electronAPI.deleteHumanizer(id);
        if (selectedId === id) {
            setSelectedId(null);
            setOutput("");
        }
    };

    const handleNewArticle = () => {
        form.setValue("text", "");
        form.setValue("tone", "Casual");
        form.setValue("style", "Persuasive");
        setOutput("");
    }

    return (
        <div className="flex flex-col h-screen bg-darkBg text-white">
            {/* TOP HEADER (same style as other screens) */}
            {/* <header className="flex items-center justify-between px-8 py-4 border-b border-[#1e293b]">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <div className="w-5 h-5 bg-blue-600 rounded-sm" />
                    <span>Text Humanizer</span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="bg-darkBg p-2 rounded-lg hover:bg-[#111827] transition">
                        <Settings size={18} />
                    </button>
                    <button className="bg-[#0b1220] p-2 rounded-lg hover:bg-[#111827] transition">
                        <Bell size={18} />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-[#facc15]" />
                </div>
            </header> */}
            <div className="p-8">
                <Header />

            </div>

            {/* MAIN AREA */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SIDEBAR (matching screenshot) */}
                <aside className="w-72 bg-[#0f172a] border-r border-gray-800 flex flex-col">

                    <div className="px-6 pt-6 font-semibold text-gray-300 text-sm">
                        Chat History
                        <div className="text-xs text-gray-500 mt-1">Your recent articles</div>
                    </div>

                    {/* HISTORY LIST SCROLL */}
                    <ScrollArea className="flex-1 mt-4 px-3">
                        <div className="space-y-1">
                            {history.map((item: any) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleHistoryClick(item.id)}
                                    className="w-full flex items-center text-sm gap-3 px-4 py-3 rounded-lg hover:bg-[#1e293b] transition text-left"
                                >
                                    <MessageSquare size={16} className="text-gray-400" />
                                    {item.input.slice(0, 24)}
                                    {item.input.length > 24 ? "..." : ""}

                                    <Trash2 size={16} onClick={() => handleDelete(item.id)} />
                                </button>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* NEW ARTICLE BUTTON */}
                    <div className="p-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg" onClick={handleNewArticle}>
                            + New Article
                        </Button>
                    </div>
                </aside>

                {/* CENTER + RIGHT CONTENT */}
                <main className="flex-1 px-10 py-8 overflow-y-auto hide-scrollbar">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-400 mb-4">
                        <button
                            className="hover:text-gray-200"
                            onClick={() => navigate("/")}
                        >
                            Home
                        </button>{" "}
                        / <span className="text-gray-200">Text Humanizer</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-8">Text Humanizer</h1>

                    <div className="grid grid-cols-2 gap-8 h-[calc(100%-5rem)]">
                        {/* LEFT: Original Text */}
                        <Card className="bg-[#020617] border-none shadow-none">
                            <CardContent className="p-0 h-full flex flex-col">
                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-sm text-gray-300 mb-3">Original Text</p>

                                    <Textarea
                                        className="flex-1 bg-[#1e293b] border-gray-700  rounded-xl text-gray-200 placeholder:text-gray-500 resize-none"
                                        placeholder="Paste your AI-generated text here..."
                                        {...form.register("text")}
                                    />
                                    {form.formState.errors.text && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {form.formState.errors.text.message as string}
                                        </p>
                                    )}

                                    {/* Tone + Style */}
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-300 mb-1">Tone</p>
                                            <Select
                                                defaultValue="Casual"
                                                onValueChange={(v) => form.setValue("tone", v)}
                                            >
                                                <SelectTrigger className="bg-[#1e293b] border-gray-700 text-gray-200 rounded-lg text-sm">
                                                    <SelectValue placeholder="Casual" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1e293b] text-gray-200 border-gray-700">
                                                    <SelectItem value="Casual">Casual</SelectItem>
                                                    <SelectItem value="Formal">Formal</SelectItem>
                                                    <SelectItem value="Friendly">Friendly</SelectItem>
                                                    <SelectItem value="Professional">
                                                        Professional
                                                    </SelectItem>
                                                    <SelectItem value="Playful">Playful</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-300 mb-1">Style</p>
                                            <Select
                                                defaultValue="Persuasive"
                                                onValueChange={(v) => form.setValue("style", v)}
                                            >
                                                <SelectTrigger className="bg-[#1e293b] border-gray-700 text-gray-200 rounded-lg text-sm">
                                                    <SelectValue placeholder="Persuasive" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1e293b] text-gray-200 border-gray-700">
                                                    <SelectItem value="Persuasive">
                                                        Persuasive
                                                    </SelectItem>
                                                    <SelectItem value="Narrative">
                                                        Narrative
                                                    </SelectItem>
                                                    <SelectItem value="Explanatory">
                                                        Explanatory
                                                    </SelectItem>
                                                    <SelectItem value="Storytelling">
                                                        Storytelling
                                                    </SelectItem>
                                                    <SelectItem value="Simple">Simple</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Button
                                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-base font-semibold"
                                        onClick={form.handleSubmit(onSubmit)}
                                        disabled={loading}
                                    >
                                        {loading ? "Humanizing..." : "✨ Humanize Text"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* RIGHT: Humanized Result */}
                        <Card className="bg-[#020617] border-none shadow-none">
                            <CardContent className="p-0 h-full flex flex-col">
                                <div className=" p-6 flex-1 flex flex-col">
                                    <p className="text-sm text-gray-300 mb-3">
                                        Humanized Result
                                    </p>

                                    <div className="flex-1 bg-[#020617] rounded-xl border border-[#111827] p-4 overflow-auto">
                                        {output ? (
                                            <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                                                {output}
                                            </p>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                                                <div className="mb-2">
                                                    <MessageSquare size={18} />
                                                </div>
                                                <p>Your humanized text will appear here.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
