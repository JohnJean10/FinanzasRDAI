import { HeroBalanceCard } from "@/components/features/dashboard/NetWorthCard";
import { KPIGridFynix } from "@/components/features/dashboard/KPIGridBento";
import { AIAssistantFynix } from "@/components/features/dashboard/AIAssistantWidget";
import { SubscriptionsWidgetFynix } from "@/components/features/dashboard/SubscriptionsWidget";
import { BalanceCardFynix } from "@/components/features/dashboard/BalanceCardsWidget";
import { NetWorthDonut } from "@/components/features/dashboard/NetWorthDonut";
import { CashflowChartFynix } from "@/components/features/dashboard/CashflowChartBento";
import { RecentTransactionsFynix } from "@/components/features/dashboard/RecentTransactionsBento";
import { BudgetAlerts } from "@/components/features/dashboard/BudgetAlerts";
import { Search, Settings, MessageSquare } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#f8faf9] dark:bg-[#0F111A] p-4 md:p-6 lg:p-8">
            <BudgetAlerts />

            {/* Top Bar - Search & Settings */}
            <header className="flex items-center justify-between gap-4 mb-6">
                {/* Search Bar - Pill Style */}
                <div className="flex-1 max-w-lg">
                    <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-[#1a1f2e] rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                        />
                        <div className="flex items-center gap-1 text-slate-400">
                            <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">⌘</span>
                            <span className="text-xs">F</span>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white dark:bg-[#1a1f2e] rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all">
                        <Settings size={18} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
            </header>

            {/* Main Bento Grid - Fynix Layout */}
            <div className="grid grid-cols-12 gap-5">

                {/* === ROW 1 === */}
                {/* Hero Balance (Left - spans 4 cols, 2 rows) */}
                <div className="col-span-12 md:col-span-4 md:row-span-2">
                    <HeroBalanceCard />
                </div>

                {/* KPI Grid (Middle - 4 cols) */}
                <div className="col-span-12 md:col-span-4">
                    <KPIGridFynix />
                </div>

                {/* AI Assistant (Right - 4 cols, 2 rows) */}
                <div className="col-span-12 md:col-span-4 md:row-span-2">
                    <AIAssistantFynix />
                </div>

                {/* === ROW 2 (KPI row 2 is Net Worth Legend area in Fynix) === */}
                {/* Continuing KPI area - Empty/Placeholder or additional KPIs */}
                <div className="col-span-12 md:col-span-4 hidden md:block">
                    {/* This row is implicitly filled by KPI 2x2 grid height matching */}
                </div>

                {/* === ROW 3 === */}
                {/* Subscriptions Widget */}
                <div className="col-span-12 md:col-span-4">
                    <SubscriptionsWidgetFynix />
                </div>

                {/* Balance Card */}
                <div className="col-span-12 md:col-span-4">
                    <BalanceCardFynix />
                </div>

                {/* Net Worth Donut */}
                <div className="col-span-12 md:col-span-4">
                    <NetWorthDonut />
                </div>

                {/* === ROW 4 === */}
                {/* Cashflow Chart (spans 6 cols) */}
                <div className="col-span-12 lg:col-span-6">
                    <CashflowChartFynix />
                </div>

                {/* Recent Transactions (spans 6 cols) */}
                <div className="col-span-12 lg:col-span-6">
                    <RecentTransactionsFynix />
                </div>
            </div>

            {/* Floating Action Button - Fynix Style */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3">
                <button className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 flex items-center justify-center transition-all hover:scale-105">
                    <MessageSquare size={22} />
                </button>
                <button className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 flex items-center justify-center transition-all hover:scale-105 text-2xl font-light">
                    +
                </button>
            </div>
        </div>
    );
}
