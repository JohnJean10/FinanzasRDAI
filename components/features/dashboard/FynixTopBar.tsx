"use client";

import Link from "next/link";
import { Search, Settings, HelpCircle, Bell } from "lucide-react";

const NAV_TABS = [
    { name: "Overview", href: "/dashboard", active: true },
    { name: "Activity", href: "/transactions", active: false },
    { name: "Manage", href: "/planning", active: false },
    { name: "Program", href: "/savings", active: false },
    { name: "Account", href: "/accounts", active: false },
    { name: "Reports", href: "/reports", active: false },
];

export function FynixTopBar() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-[#1a1f2e]/50 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50">
            {/* Left: Logo + Tabs */}
            <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">F</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        Fynix
                    </span>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex items-center gap-1">
                    {NAV_TABS.map((tab) => (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${tab.active
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200/50"
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                }`}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search anything"
                        className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 w-40"
                    />
                    <div className="flex items-center gap-1 text-slate-400">
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">⌘</span>
                        <span className="text-[10px]">F</span>
                    </div>
                </div>

                {/* Action Icons */}
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Settings size={18} className="text-slate-500 dark:text-slate-400" />
                </button>
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <HelpCircle size={18} className="text-slate-500 dark:text-slate-400" />
                </button>
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                    <Bell size={18} className="text-slate-500 dark:text-slate-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center cursor-pointer">
                    <span className="text-white text-sm font-bold">J</span>
                </div>
            </div>
        </header>
    );
}
