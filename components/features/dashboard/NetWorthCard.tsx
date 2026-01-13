"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, Plus } from "lucide-react";

export function NetWorthCard() {
    const { metrics, user, openTransactionModal } = useFinancial();

    const firstName = user.name.split(" ")[0];

    return (
        <div className="bg-white dark:bg-[#1E2030] rounded-bento p-8 shadow-bento dark:shadow-bento-dark relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-green-300/20 dark:from-emerald-900/20 dark:to-green-800/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                {/* Greeting */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                            {firstName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Hi, {firstName}
                    </p>
                </div>

                {/* Main Balance */}
                <div className="mb-2">
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {formatCurrency(metrics.balance)}
                    </h2>
                </div>

                {/* Subtitle */}
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
                    + {formatCurrency(metrics.totalSavings)} total balance
                </p>

                {/* Action Buttons - Fynix Style */}
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        <span>Transfer</span>
                        <ArrowUpRight size={18} />
                    </button>
                    <button
                        onClick={openTransactionModal}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <span>Add</span>
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
