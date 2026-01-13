import { NetWorthCard } from "@/components/features/dashboard/NetWorthCard";
import { KPIGridBento } from "@/components/features/dashboard/KPIGridBento";
import { AIAssistantWidget } from "@/components/features/dashboard/AIAssistantWidget";
import { SubscriptionsWidget } from "@/components/features/dashboard/SubscriptionsWidget";
import { CashflowChartBento } from "@/components/features/dashboard/CashflowChartBento";
import { RecentTransactionsBento } from "@/components/features/dashboard/RecentTransactionsBento";
import { BalanceCardsWidget } from "@/components/features/dashboard/BalanceCardsWidget";
import { BudgetAlerts } from "@/components/features/dashboard/BudgetAlerts";
import { Search, Settings } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="p-6 md:p-8 min-h-screen">
            <BudgetAlerts />

            {/* Header - Fynix Style */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                {/* Search Bar - Pill Style */}
                <div className="flex-1 max-w-md">
                    <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-[#1E2030] rounded-full shadow-bento dark:shadow-bento-dark">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        <span className="text-xs text-slate-400 hidden md:block">⌘ F</span>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white dark:bg-[#1E2030] rounded-full shadow-bento dark:shadow-bento-dark hover:shadow-bento-hover transition-all duration-200">
                        <Settings size={18} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
            </header>

            {/* Main Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Row 1: Hero Balance + KPIs + AI Assistant */}
                {/* A. Net Worth Card (Col-5) */}
                <div className="md:col-span-5">
                    <NetWorthCard />
                </div>

                {/* B. KPI Grid (Col-3) */}
                <div className="md:col-span-3">
                    <KPIGridBento />
                </div>

                {/* C. AI Assistant (Col-4) */}
                <div className="md:col-span-4">
                    <AIAssistantWidget />
                </div>

                {/* Row 2: Subscriptions + Balance Cards + Net Worth Donut (placeholder) */}
                {/* D. Subscriptions Widget (Col-4) */}
                <div className="md:col-span-4">
                    <SubscriptionsWidget />
                </div>

                {/* E. Balance Cards (Col-4) */}
                <div className="md:col-span-4">
                    <BalanceCardsWidget />
                </div>

                {/* F. Additional KPIs or Net Worth Donut - Placeholder (Col-4) */}
                <div className="md:col-span-4">
                    <div className="bg-white dark:bg-[#1E2030] rounded-bento p-6 shadow-bento dark:shadow-bento-dark h-full flex flex-col justify-center items-center">
                        <div className="w-32 h-32 rounded-full border-8 border-emerald-200 dark:border-emerald-900/30 relative mb-4">
                            <div className="absolute inset-2 rounded-full border-8 border-emerald-500 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Net Worth</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 text-center">Increased By 12% ↗</p>
                    </div>
                </div>

                {/* Row 3: Cashflow Chart (Full Width) */}
                <div className="md:col-span-12">
                    <CashflowChartBento />
                </div>

                {/* Row 4: Recent Transactions (Full Width) */}
                <div className="md:col-span-12">
                    <RecentTransactionsBento />
                </div>
            </div>
        </div>
    );
}
