"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, Plus } from "lucide-react";

export function HeroBalanceCard() {
    const { metrics, user, openTransactionModal } = useFinancial();

    const firstName = user.name.split(" ")[0];

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-8 h-full flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Header with Avatar */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                    <span className="text-white text-lg font-bold">
                        {firstName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-base">
                    Hi, {firstName}
                </p>
            </div>

            {/* Main Balance - Large Display */}
            <div className="flex-1 flex flex-col justify-center py-4">
                <h2 className="text-[56px] leading-none font-bold text-slate-900 dark:text-white tracking-tight">
                    {formatCurrency(metrics.balance)}
                </h2>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-3">
                    + {formatCurrency(metrics.totalSavings)} total balance
                </p>
            </div>

            {/* Action Buttons - Fynix Style */}
            <div className="flex gap-3 mt-4">
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-full font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200 shadow-lg">
                    <span>Transfer</span>
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                </button>
                <button
                    onClick={openTransactionModal}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
                >
                    <span>Add</span>
                    <Plus size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
