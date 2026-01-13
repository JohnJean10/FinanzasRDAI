"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatCurrency } from "@/lib/utils";
import { Filter } from "lucide-react";

export function RecentTransactionsFynix() {
    const { transactions, budgetConfigs, accounts } = useFinancial();

    const recentTx = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);

    const getBudgetInfo = (budgetId?: string | null) => {
        if (!budgetId) return { name: "Others", icon: "💰" };
        const budget = budgetConfigs.find(b => b.id === budgetId);
        return budget ? { name: budget.name, icon: budget.icon } : { name: "Others", icon: "💰" };
    };

    const getAccountInfo = (accountId: string) => {
        const account = accounts.find(a => a.id === accountId);
        return account?.name || "Platinum Plus Visa";
    };

    if (recentTx.length === 0) {
        return (
            <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Transactions</h3>
                <p className="text-sm text-slate-500 text-center py-8">No hay transacciones recientes.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Recent Transactions
                </h3>
                <div className="flex items-center gap-3">
                    <select className="bg-slate-50 dark:bg-slate-800 border-0 text-xs rounded-xl px-3 py-2 text-slate-600 dark:text-slate-300 outline-none cursor-pointer">
                        <option>This Month</option>
                        <option>Last Month</option>
                    </select>
                    <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <Filter size={14} className="text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-2 py-3 text-[10px] text-slate-400 font-medium uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <div className="col-span-4">Transaction Name</div>
                <div className="col-span-2">Account</div>
                <div className="col-span-2">Date & Time</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Transactions */}
            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {recentTx.map((t) => {
                    const budgetInfo = getBudgetInfo(t.budgetId);
                    const txDate = new Date(t.date.includes("T") ? t.date : t.date + "T12:00:00");
                    const isCompleted = t.type !== "transfer";

                    return (
                        <div
                            key={t.id}
                            className="grid grid-cols-12 gap-4 px-2 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors rounded-xl"
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
                            <div className="col-span-2 flex items-center gap-2">
                                <div className="px-2 py-1 bg-blue-600 rounded text-[8px] text-white font-bold">
                                    VISA
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {getAccountInfo(t.accountId).split(" ")[0]}
                                </span>
                            </div>

                            {/* Date */}
                            <div className="col-span-2">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {txDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {txDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="col-span-2 text-right">
                                <p className={`font-semibold text-sm ${t.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold ${isCompleted
                                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        : "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                    }`}>
                                    {isCompleted ? "Completed" : "Pending"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
