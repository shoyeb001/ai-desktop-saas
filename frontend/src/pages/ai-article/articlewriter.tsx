import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { ArticlePost } from "./components/articlepost";
import { useState } from "react";

const ArticleSchema = z.object({
    topic: z.string().min(3, "Topic is required"),
    minLength: z
        .string()
        .refine((val) => !isNaN(Number(val)), "Min length must be a number"),

    maxLength: z
        .string()
        .refine((val) => !isNaN(Number(val)), "Max length must be a number"),
    writingStyle: z.string().min(1, "Select a writing style"),
    keywords: z.string().optional(),
    // generateImage: z.boolean().default(false),

}).refine(
    (data) => Number(data.minLength) < Number(data.maxLength),
    {
        message: "Min length must be smaller than max length",
        path: ["minLength"], // shows error under minLength field
    }
)
    .refine(
        (data) => Number(data.maxLength) > Number(data.minLength),
        {
            message: "Max length must be greater than min length",
            path: ["maxLength"],
        }
    );

type ArticleForm = z.infer<typeof ArticleSchema>;

export default function AIArticleWriter() {
    const [postData, setPostData] = useState({});
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<ArticleForm>({
        resolver: zodResolver(ArticleSchema),

    });
    // const generateImageValue = watch("generateImage");

    const onSubmit = async (data: ArticleForm) => {
        const keywordsArray = data.keywords
            ? data.keywords
                .split(",")
                .map((k) => k.trim())
                .filter((k) => k !== "")
            : [];

        const finalPayload = {
            topic: data.topic,
            minLength: Number(data.minLength),
            maxLength: Number(data.maxLength),
            writingStyle: data.writingStyle,
            keywords: keywordsArray
        };

        console.log("FINAL FORM DATA:", finalPayload);
        console.log("window.electronAPI:", window.electronAPI);

        const response = await window.electronAPI.generateArticle(finalPayload);
        setPostData(response);
        console.log("AI article response:", response);
    };
    const history = [
        "Future of AI",
        "Marketing Copy",
        "New Product Ideas",
        "Quarterly Report",
        "Blog Post Draft",
    ];

    return (
        <div className="w-full h-screen bg-[#0f172a] text-white flex flex-col">

            {/* ================= HEADER ================= */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700 bg-[#0f172a]">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <div className="w-5 h-5 bg-blue-600 rounded-sm" />
                    <span>AI Article Writer</span>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="secondary"
                        className="bg-[#1e293b] hover:bg-[#334155] rounded-lg p-2"
                    >
                        <Settings size={18} />
                    </Button>

                    <div className="w-9 h-9 bg-[#1e293b] rounded-full overflow-hidden border border-gray-600" />
                </div>
            </header>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden">

                {/* ================= LEFT SIDEBAR ================= */}
                <aside className="w-72 bg-[#0f172a] border-r border-gray-800 flex flex-col">

                    <div className="px-6 pt-6 font-semibold text-gray-300 text-sm">
                        Chat History
                        <div className="text-xs text-gray-500 mt-1">Your recent articles</div>
                    </div>

                    {/* HISTORY LIST SCROLL */}
                    <ScrollArea className="flex-1 mt-4 px-3">
                        <div className="space-y-1">
                            {history.map((item, index) => (
                                <button
                                    key={index}
                                    className="
                    w-full flex items-center gap-3
                    px-4 py-3
                    text-left
                    rounded-lg
                    hover:bg-[#1e293b]
                    transition
                  "
                                >
                                    <MessageSquare className="text-gray-400" size={16} />
                                    <span className="text-gray-300 text-sm">{item}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* NEW ARTICLE BUTTON */}
                    <div className="p-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
                            + New Article
                        </Button>
                    </div>
                </aside>

                {/* ================= CENTER FORM SECTION ================= */}
                <main className="flex-1 px-10 py-10 overflow-auto hide-scrollbar">
                    {/* BREADCRUMB */}
                    <div className="text-sm text-gray-400 mb-6">
                        <Link to="/"> Menu</Link> / <span className="text-gray-200">Article Writer</span>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl">

                        {/* TOPIC */}
                        <label className="text-gray-300 text-sm">Article Topic</label>
                        <Textarea
                            {...register("topic")}
                            placeholder="e.g., The Future of Renewable Energy"
                            className="mt-2 bg-[#1e293b] border-gray-700 text-gray-200"
                        />
                        {errors.topic && (
                            <p className="text-red-400 text-xs mt-1">{errors.topic.message}</p>
                        )}

                        {/* MIN-MAX LENGTH */}
                        <div className="flex gap-6 mt-6">
                            <div className="flex-1">
                                <label className="text-gray-300 text-sm">Min. Length</label>
                                <Input
                                    {...register("minLength")}
                                    placeholder="500"
                                    className="mt-2 bg-[#1e293b] border-gray-700 text-gray-200"
                                />
                                {errors.minLength && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {errors.minLength.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex-1">
                                <label className="text-gray-300 text-sm">Max. Length</label>
                                <Input
                                    {...register("maxLength")}
                                    placeholder="1500"
                                    className="mt-2 bg-[#1e293b] border-gray-700 text-gray-200"
                                />
                                {errors.maxLength && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {errors.maxLength.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* KEYWORDS */}
                        <label className="text-gray-300 text-sm mt-6 block">Keywords</label>
                        <Input
                            {...register("keywords")}
                            placeholder="e.g., Solar, Wind, Geothermal"
                            className="mt-2 bg-[#1e293b] border-gray-700 text-gray-200"
                        />

                        {/* WRITING STYLE */}
                        <label className="text-gray-300 text-sm mt-6 block">Writing Style</label>
                        <Select onValueChange={(val) => setValue("writingStyle", val)}>
                            <SelectTrigger className="mt-2 bg-[#1e293b] border-gray-700 text-gray-200 w-full">
                                <SelectValue placeholder="Select writing style" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1e293b] text-gray-200 border-gray-700">
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="friendly">Friendly</SelectItem>
                                <SelectItem value="storytelling">Storytelling</SelectItem>
                                <SelectItem value="blog">Blog Style</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.writingStyle && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.writingStyle.message}
                            </p>
                        )}
                        {/* GENERATE IMAGE SWITCH */}
                        {/* <div className="flex items-center justify-between mt-6 mb-8">
                            <label className="text-gray-300 text-sm">Generate Image?</label>

                            <Switch
                                checked={generateImageValue}
                                onCheckedChange={(v: boolean) => setValue("generateImage", v)}
                            />
                        </div> */}

                        {/* SUBMIT BUTTON */}
                        <Button
                            type="submit"
                            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-6 rounded-xl text-base font-semibold"
                        >
                            {isSubmitting ? "✨ Generating..." : "✨ Generate Article"}
                        </Button>
                    </form>
                </main>

                {/* ================= RIGHT ARTICLE PREVIEW ================= */}
                <ArticlePost postData={postData}/>
            </div>
        </div>
    );
}
