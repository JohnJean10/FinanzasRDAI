"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink, MoreVertical } from "lucide-react";

export function BalanceCardFynix() {
    const { accounts } = useFinancial();

    // Get bank/credit accounts
    const displayAccounts = accounts
        .filter(a => a.type === "bank" || a.type === "credit")
        .slice(0, 2);

    // Calculate total balance
    const totalBalance = accounts.reduce((acc, a) => {
        if (a.type === "credit") return acc;
        return acc + a.balance;
    }, 0);

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-6 h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Balance</span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={18} />
                </button>
            </div>

            {/* Total Balance */}
            <div className="mb-6">
                <p className="text-xs text-slate-400 mb-1">Total Balance</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalBalance)}
                </h3>
            </div>

            {/* Credit Cards Row */}
            <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((index) => {
                    const account = displayAccounts[index];
                    const gradients = [
                        "from-blue-600 to-blue-500",
                        "from-slate-700 to-slate-600"
                    ];

                    return (
                        <div
                            key={index}
                            className={`bg-gradient-to-r ${gradients[index]} rounded-2xl p-4 text-white relative overflow-hidden`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                                    CARD
                                </span>
                                <ExternalLink size={12} className="opacity-70" />
                            </div>
                            <p className="text-[10px] opacity-60 truncate mb-1">
                                {account?.name || `Card ${index + 1}`}
                            </p>
                            <p className="text-base font-bold">
                                {formatCurrency(Math.abs(account?.balance || 0))}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
