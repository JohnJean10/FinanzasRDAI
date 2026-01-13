"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Wallet,
    ArrowLeftRight,
    PieChart,
    Target,
    TrendingUp,
    CreditCard,
    MessageSquare,
    FileText,
    Settings,
    Moon,
    RefreshCw
} from "lucide-react";

const ICON_MENU = [
    { icon: LayoutGrid, href: "/dashboard", label: "Dashboard" },
    { icon: Wallet, href: "/accounts", label: "Accounts" },
    { icon: ArrowLeftRight, href: "/transactions", label: "Transactions" },
    { icon: PieChart, href: "/planning", label: "Budgets" },
    { icon: Target, href: "/savings", label: "Goals" },
    { icon: TrendingUp, href: "/investments", label: "Investments" },
    { icon: CreditCard, href: "/debts", label: "Debts" },
    { icon: MessageSquare, href: "/coach", label: "Coach AI" },
    { icon: FileText, href: "/reports", label: "Reports" },
];

export function FynixSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 bg-white dark:bg-[#1a1f2e] border-r border-slate-100 dark:border-slate-800/50 flex flex-col items-center py-6 z-50">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                    <span className="text-white text-sm font-bold">F</span>
                </div>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <Moon size={16} className="text-slate-400" />
                </button>
            </div>

            {/* Icon Menu */}
            <nav className="flex flex-col items-center gap-2 flex-1">
                {ICON_MENU.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            className={`p-3 rounded-2xl transition-all duration-200 group relative ${isActive
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200/50"
                                    : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                }`}
                        >
                            <item.icon size={20} />
                            {/* Tooltip */}
                            <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="flex flex-col items-center gap-3">
                <button className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all">
                    <Settings size={20} />
                </button>
                <button className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all">
                    <RefreshCw size={20} />
                </button>
            </div>
        </aside>
    );
}
