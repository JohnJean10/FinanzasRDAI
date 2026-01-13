"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export function BalanceCardsFynix() {
    const { accounts } = useFinancial();

    const totalBalance = accounts.reduce((acc, a) => {
        if (a.type === "credit") return acc;
        return acc + a.balance;
    }, 0);

    const displayAccounts = accounts
        .filter(a => a.type === "bank" || a.type === "credit")
        .slice(0, 2);

    const cards = [
        {
            name: "Platinum Plus Visa",
            number: "4532 8723 0045 9967",
            balance: displayAccounts[0]?.balance || 415000,
            brand: "VISA",
            gradient: "from-blue-600 to-blue-500"
        },
        {
            name: "Freedom Unlimited Mastercard",
            number: "5582 5574 8376 5487",
            balance: displayAccounts[1]?.balance || 532000,
            brand: "MC",
            gradient: "from-slate-700 to-slate-600"
        },
    ];

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Balance</span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="text-lg">⋮</span>
                </button>
            </div>

            {/* Total Balance */}
            <div className="mb-5">
                <p className="text-xs text-slate-400 mb-1">Total Balance</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalBalance)}
                </h3>
            </div>

            {/* Credit Cards */}
            <div className="grid grid-cols-2 gap-3">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`bg-gradient-to-r ${card.gradient} rounded-2xl p-4 text-white relative overflow-hidden`}
                    >
                        {/* Brand Badge */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/20 rounded">
                                {card.brand}
                            </span>
                            <ExternalLink size={12} className="opacity-70" />
                        </div>

                        {/* Card Name */}
                        <p className="text-[10px] opacity-70 mb-1 truncate">
                            {card.name}
                        </p>

                        {/* Balance */}
                        <p className="text-base font-bold mb-2">
                            {formatCurrency(card.balance)}
                        </p>

                        {/* Card Number */}
                        <p className="text-[9px] opacity-50 font-mono">
                            {card.number}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
