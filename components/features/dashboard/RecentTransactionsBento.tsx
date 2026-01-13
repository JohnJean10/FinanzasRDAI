"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatCurrency } from "@/lib/utils";
import { MoreVertical, Filter } from "lucide-react";

export function RecentTransactionsBento() {
    const { transactions, budgetConfigs } = useFinancial();

    // Sort by date desc and take top 5
    const recentTx = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);

    const getBudgetInfo = (budgetId?: string | null) => {
        if (!budgetId) return { name: "Sin categoría", icon: "💰" };
        const budget = budgetConfigs.find(b => b.id === budgetId);
        return budget ? { name: budget.name, icon: budget.icon } : { name: "Sin categoría", icon: "💰" };
    };

    const getStatusColor = (type: string) => {
        switch (type) {
            case "income": return "text-emerald-500";
            case "expense": return "text-red-500";
            case "transfer": return "text-blue-500";
            default: return "text-slate-500";
        }
    };

    const getStatusBadge = (type: string) => {
        switch (type) {
            case "income": return { text: "Completed", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" };
            case "expense": return { text: "Completed", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" };
            case "transfer": return { text: "Pending", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" };
            default: return { text: "Pending", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" };
        }
    };

    if (recentTx.length === 0) {
        return (
            <div className="bg-white dark:bg-[#1E2030] rounded-bento p-6 shadow-bento dark:shadow-bento-dark">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Transactions</h3>
                <p className="text-sm text-slate-500 text-center py-8">No hay transacciones recientes.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1E2030] rounded-bento p-6 shadow-bento dark:shadow-bento-dark">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recent Transactions
                </h3>
                <div className="flex items-center gap-2">
                    <select className="bg-slate-50 dark:bg-slate-800 border-0 text-xs rounded-xl px-3 py-2 text-slate-600 dark:text-slate-300 outline-none cursor-pointer">
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>All Time</option>
                    </select>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <Filter size={16} className="text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs text-slate-400 font-medium uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <div className="col-span-4">Transaction Name</div>
                <div className="col-span-2">Account</div>
                <div className="col-span-2">Date & Time</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTx.map((t) => {
                    const budgetInfo = getBudgetInfo(t.budgetId);
                    const status = getStatusBadge(t.type);
                    const txDate = new Date(t.date.includes("T") ? t.date : t.date + "T12:00:00");

                    return (
                        <div
                            key={t.id}
                            className="grid grid-cols-12 gap-4 px-3 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer rounded-xl"
                        >
                            {/* Transaction Info */}
                            <div className="col-span-4 flex items-center gap-3">
                                <BrandLogo
                                    description={t.description}
                                    category={t.category}
                                    categoryIcon={budgetInfo.icon}
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-900 dark:text-white truncate text-sm">
                                        {t.description || budgetInfo.name}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {budgetInfo.name}
                                    </p>
                                </div>
                            </div>

                            {/* Account */}
                            <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded text-[8px] text-white font-bold flex items-center justify-center">
                                        VISA
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Platinum
                                    </span>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="col-span-2">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {txDate.toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" })}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {txDate.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="col-span-2 text-right">
                                <p className={`font-bold text-sm ${getStatusColor(t.type)}`}>
                                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                    {status.text}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
