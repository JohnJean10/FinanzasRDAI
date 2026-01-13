"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function HeroBalanceCard() {
    const { metrics, user, openTransactionModal } = useFinancial();
    const { t } = useI18n();

    const firstName = user.name.split(" ")[0];

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-7 h-full flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Header with Avatar */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200/40">
                    <span className="text-white text-base font-bold">
                        {firstName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {t.dashboard.greeting}, {firstName}
                </p>
            </div>

            {/* Main Balance - HUGE Display */}
            <div className="flex-1 flex flex-col justify-center py-2">
                <h2 className="text-[52px] leading-[1.1] font-bold text-slate-900 dark:text-white tracking-tight">
                    {formatCurrency(metrics.balance)}
                </h2>
                <p className="text-emerald-500 text-sm font-medium mt-2 flex items-center gap-1">
                    <span>+</span>
                    <span>{formatCurrency(metrics.totalSavings)}</span>
                    <span className="text-slate-400 ml-1">{t.dashboard.totalBalance}</span>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button className="flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-700/20">
                    <span>{t.dashboard.transfer}</span>
                    <ArrowUpRight size={15} strokeWidth={2.5} />
                </button>
                <button
                    onClick={openTransactionModal}
                    className="flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full font-semibold text-sm transition-all duration-200"
                >
                    <span>{t.dashboard.add}</span>
                    <Plus size={15} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
