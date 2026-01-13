"use client";

import { useState } from "react";
import { Send, Sparkles, TrendingUp, Receipt, Wallet, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const QUICK_PROMPTS = [
    { icon: TrendingUp, label: "Show monthly budget" },
    { icon: Receipt, label: "Enter unusual transaction" },
    { icon: Wallet, label: "Reveal my balance" },
];

export function AIAssistantFynix() {
    const [message, setMessage] = useState("");

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-6 h-full flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30">
                        <Sparkles className="text-white" size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        AI Assistant
                    </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                What Can I help with?
            </h3>

            {/* Quick Prompts Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                {QUICK_PROMPTS.map((prompt, index) => (
                    <button
                        key={index}
                        className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left"
                    >
                        <prompt.icon size={14} className="text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{prompt.label}</span>
                    </button>
                ))}
                <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <MoreHorizontal size={14} />
                    <span>Others</span>
                </button>
            </div>

            {/* Chat Input - Spacer to push to bottom */}
            <div className="mt-auto">
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400 px-2 hidden md:block">Choose Model</span>
                        <Link
                            href="/coach"
                            className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30"
                        >
                            <Send size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
