"use client";

import { useState } from "react";
import { Send, Mic, Sparkles, TrendingUp, Receipt, Wallet, PieChart, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const QUICK_PROMPTS = [
    { icon: TrendingUp, label: "Show me my cash flow" },
    { icon: PieChart, label: "Plan my monthly budget" },
    { icon: Receipt, label: "Detect unusual transactions" },
    { icon: Wallet, label: "Reveal my balance" },
];

export function AIAssistantPanel() {
    const [message, setMessage] = useState("");

    return (
        <aside className="fixed right-0 top-0 h-screen w-[340px] bg-white dark:bg-[#1a1f2e] border-l border-slate-100 dark:border-slate-800/50 flex flex-col p-6 z-40">
            {/* Header with menu */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    AI Assistant
                </span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Green Orb Animation */}
            <div className="flex justify-center mb-8">
                <div className="relative w-28 h-28">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
                    {/* Main orb */}
                    <div className="absolute inset-2 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-full shadow-2xl shadow-emerald-300/50">
                        {/* Inner highlight */}
                        <div className="absolute top-3 left-3 w-8 h-8 bg-white/30 rounded-full blur-sm" />
                        {/* Sparkle icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="text-white/80" size={32} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-6">
                What Can I help with?
            </h3>

            {/* Quick Prompts */}
            <div className="grid grid-cols-2 gap-2 mb-8">
                {QUICK_PROMPTS.map((prompt, index) => (
                    <button
                        key={index}
                        className="flex items-center gap-2 px-3 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all text-left group"
                    >
                        <prompt.icon size={14} className="text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">{prompt.label}</span>
                    </button>
                ))}
                <button className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={14} />
                    <span>Others</span>
                </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Chat Input */}
            <div className="space-y-3">
                {/* Input Field */}
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Finance</span>
                        <select className="bg-transparent text-xs text-slate-500 dark:text-slate-400 outline-none cursor-pointer">
                            <option>Choose Model</option>
                            <option>GPT-4</option>
                            <option>Gemini</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all">
                            <Mic size={16} />
                        </button>
                        <Link
                            href="/coach"
                            className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-lg shadow-emerald-200/50"
                        >
                            <Send size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}
