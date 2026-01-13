"use client";

import { useState } from "react";
import { Send, Sparkles, TrendingUp, PiggyBank, Receipt, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const QUICK_PROMPTS = [
    { icon: TrendingUp, label: "Show monthly budget", color: "text-blue-500" },
    { icon: Receipt, label: "Enter unusual transaction", color: "text-orange-500" },
    { icon: PiggyBank, label: "Reveal my balance", color: "text-emerald-500" },
];

export function AIAssistantWidget() {
    const [message, setMessage] = useState("");

    return (
        <div className="bg-white dark:bg-[#1E2030] rounded-bento p-6 shadow-bento dark:shadow-bento-dark h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                    <Sparkles className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    What Can I help with?
                </h3>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 mb-6">
                {QUICK_PROMPTS.map((prompt, index) => (
                    <button
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        <prompt.icon size={14} className={prompt.color} />
                        <span>{prompt.label}</span>
                    </button>
                ))}
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <MoreHorizontal size={14} />
                    <span>Others</span>
                </button>
            </div>

            {/* Chat Input */}
            <div className="mt-auto">
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                    <Link
                        href="/coach"
                        className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center justify-center"
                    >
                        <Send size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
