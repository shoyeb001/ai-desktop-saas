import React, { useState } from "react";
import { Mic, Paperclip, X, Plus } from "lucide-react";
import Header from "@/components/common/header";

export default function AIArticleWriter() {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [inputKeyword, setInputKeyword] = useState("");

    const addKeyword = () => {
        if (!inputKeyword.trim()) return;
        setKeywords([...keywords, inputKeyword.trim()]);
        setInputKeyword("");
    };

    const removeKeyword = (i: number) =>
        setKeywords(keywords.filter((_, idx) => idx !== i));

    return (
        <div className="w-full h-screen bg-[#F5F7FE] overflow-hidden">

            {/* HEADER */}
            <Header />

            {/* WRAPPER BELOW HEADER */}
            <div className="flex w-full h-[calc(100%-70px)]">

                {/* ================= FIXED SIDEBAR UNDER HEADER ================= */}
                <aside
                    className="
            w-64
            bg-white
            border-r border-gray-200
            h-full
            p-5
            overflow-y-auto
            fixed
            left-0
            top-[70px]
          "
                >
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Your Articles</h2>

                    <div className="space-y-3">
                        {[
                            "How to grow YouTube channel",
                            "Best AI tools in 2025",
                            "Top productivity frameworks",
                            "Healthy living guide"
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="
                  p-3
                  bg-[#F5F7FE]
                  rounded-xl
                  text-sm
                  hover:bg-[#E6ECFF]
                  cursor-pointer
                  transition
                "
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ================= MAIN CONTENT ================= */}
                <main className="flex-1 ml-64 p-10 overflow-y-auto">

                    <div className="max-w-3xl mx-auto">

                        {/* Form Title */}
                        <h1 className="text-2xl font-semibold mb-6">AI Article Writer</h1>

                        {/* ========== ChatGPT-style Prompt Box ========== */}
                        <div className="mb-8">
                            <label className="text-sm font-medium">Topic</label>

                            <div
                                className="
                  mt-2
                  bg-white 
                  border border-gray-300 
                  rounded-2xl 
                  p-4 
                  shadow-sm 
                  relative
                "
                            >
                                <textarea
                                    rows={4}
                                    placeholder="Describe what article you want to generate..."
                                    className="
                    w-full 
                    bg-transparent 
                    outline-none 
                    resize-none 
                    text-[15px]
                  "
                                ></textarea>

                                {/* File Icon */}
                                <button
                                    className="
                    absolute 
                    left-4 
                    bottom-4 
                    p-2 
                    rounded-lg 
                    bg-gray-100 
                    hover:bg-gray-200 
                    transition
                  "
                                >
                                    <Paperclip size={18} />
                                </button>

                                {/* Mic Icon */}
                                <button
                                    className="
                    absolute 
                    right-4 
                    bottom-4 
                    p-2 
                    rounded-lg 
                    bg-gray-100 
                    hover:bg-gray-200 
                    transition
                  "
                                >
                                    <Mic size={18} />
                                </button>
                            </div>
                        </div>

                        {/* KEYWORDS */}
                        <div className="mb-8">
                            <label className="text-sm font-medium">Keywords</label>

                            <div className="flex flex-wrap gap-2 mt-2 mb-3">
                                {keywords.map((k, i) => (
                                    <div
                                        key={i}
                                        className="
                      flex items-center gap-2
                      bg-blue-100 
                      text-blue-700 
                      px-3 py-1 
                      rounded-full
                    "
                                    >
                                        {k}
                                        <X
                                            size={14}
                                            className="cursor-pointer hover:scale-110 transition"
                                            onClick={() => removeKeyword(i)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputKeyword}
                                    onChange={(e) => setInputKeyword(e.target.value)}
                                    placeholder="Add keyword"
                                    className="
                    flex-1
                    p-3
                    rounded-xl
                    bg-gray-50
                    border border-gray-300
                    outline-none
                    focus:ring-2 focus:ring-blue-300
                  "
                                />
                                <button
                                    onClick={addKeyword}
                                    className="
                    px-5
                    bg-blue-600
                    text-white
                    rounded-xl
                    hover:bg-blue-700
                    transition
                  "
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Word Count (Compact now) */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="text-sm font-medium">Min Words</label>
                                <input
                                    type="number"
                                    placeholder="500"
                                    className="
                    w-full p-3 mt-1
                    rounded-xl bg-gray-50 border border-gray-300
                    outline-none focus:ring-2 focus:ring-blue-300
                  "
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Max Words</label>
                                <input
                                    type="number"
                                    placeholder="1500"
                                    className="
                    w-full p-3 mt-1
                    rounded-xl bg-gray-50 border border-gray-300
                    outline-none focus:ring-2 focus:ring-blue-300
                  "
                                />
                            </div>
                        </div>

                        {/* Tone */}
                        <div className="mb-8">
                            <label className="text-sm font-medium">Tone</label>
                            <select
                                className="
                  w-full mt-1 p-3
                  rounded-xl bg-gray-50 border border-gray-300
                  outline-none focus:ring-2 focus:ring-blue-300
                "
                            >
                                <option>Professional</option>
                                <option>Casual</option>
                                <option>Blog Style</option>
                                <option>Friendly</option>
                                <option>Technical</option>
                            </select>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
