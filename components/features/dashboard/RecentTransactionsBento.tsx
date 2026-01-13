"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Filter } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function RecentTransactionsFynix() {
    const { transactions, timeRange, setTimeRange } = useFinancial();
    const { t } = useI18n();

    const recentTx = (transactions || [])
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const timeRangeOptions = [
        { value: "thisMonth", label: t.timeRange.thisMonth },
        { value: "lastMonth", label: t.timeRange.lastMonth },
        { value: "last3Months", label: t.timeRange.last3Months },
    ];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.dashboard.recentTransactions}
                </h3>
                <div className="flex items-center gap-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                        className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
                    >
                        {timeRangeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Filter size={14} />
                    </button>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 mb-3 px-2">
                <span className="col-span-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t.transactions.description}
                </span>
                <span className="col-span-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t.transactions.account}
                </span>
                <span className="col-span-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t.transactions.date}
                </span>
                <span className="col-span-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">
                    {t.transactions.amount}
                </span>
                <span className="col-span-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Estado
                </span>
            </div>

            {/* Transaction Rows */}
            <div className="space-y-2">
                {recentTx.length === 0 ? (
                    <p className="text-center text-slate-400 py-8 text-sm">{t.common.noData}</p>
                ) : (
                    recentTx.map((tx) => (
                        <div
                            key={tx.id}
                            className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            {/* Name + Logo */}
                            <div className="col-span-4 flex items-center gap-3">
                                <BrandLogo
                                    description={tx.description}
                                    category={tx.category}
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {tx.description}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                        {tx.category || "Sin Categoría"}
                                    </p>
                                </div>
                            </div>

                            {/* Account */}
                            <div className="col-span-2 flex items-center gap-1">
                                <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                                    VISA
                                </span>
                                <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    {tx.accountId?.substring(0, 3) || "---"}
                                </span>
                            </div>

                            {/* Date & Time */}
                            <div className="col-span-3">
                                <p className="text-xs text-slate-700 dark:text-slate-300">
                                    {formatDate(tx.date)}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                    {formatTime(tx.date)}
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="col-span-2 text-right">
                                <span className={`text-sm font-semibold ${tx.type === "income"
                                    ? "text-emerald-500"
                                    : "text-red-500"
                                    }`}>
                                    {tx.type === "income" ? "+" : "-"}
                                    {formatCurrency(tx.amount)}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="col-span-1 text-right">
                                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-1 rounded-full whitespace-nowrap">
                                    ✓
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
