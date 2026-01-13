"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, ExternalLink } from "lucide-react";

export function BalanceCardsWidget() {
    const { accounts } = useFinancial();

    // Get first 2 bank/credit accounts
    const displayAccounts = accounts
        .filter(a => a.type === "bank" || a.type === "credit")
        .slice(0, 2);

    // Calculate total balance
    const totalBalance = accounts.reduce((acc, a) => {
        if (a.type === "credit") return acc; // Don't add credit to total
        return acc + a.balance;
    }, 0);

    const getCardGradient = (index: number) => {
        const gradients = [
            "from-blue-600 via-blue-500 to-blue-400",
            "from-slate-800 via-slate-700 to-slate-600",
        ];
        return gradients[index % gradients.length];
    };

    const getCardLogo = (brand?: string) => {
        if (brand === "visa" || brand === "mastercard") {
            return brand.toUpperCase();
        }
        return "CARD";
    };

    return (
        <div className="bg-white dark:bg-[#1E2030] rounded-bento p-6 shadow-bento dark:shadow-bento-dark">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Balance</p>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <span className="text-slate-400 text-lg">⋮</span>
                </button>
            </div>

            {/* Total Balance */}
            <div className="mb-6">
                <p className="text-xs text-slate-400 mb-1">Total Balance</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalBalance)}
                </h3>
            </div>

            {/* Credit Cards */}
            <div className="grid grid-cols-2 gap-4">
                {displayAccounts.map((account, index) => (
                    <div
                        key={account.id}
                        className={`bg-gradient-to-br ${getCardGradient(index)} rounded-2xl p-4 text-white relative overflow-hidden`}
                    >
                        {/* Card Pattern */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

                        {/* Card Brand */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold opacity-80">
                                {getCardLogo(account.brand)}
                            </span>
                            <ExternalLink size={14} className="opacity-60" />
                        </div>

                        {/* Card Name */}
                        <p className="text-xs opacity-70 mb-1 truncate">
                            {account.name}
                        </p>

                        {/* Balance */}
                        <p className="text-lg font-bold">
                            {formatCurrency(Math.abs(account.balance))}
                        </p>

                        {/* Card Number (masked) */}
                        <p className="text-[10px] opacity-50 mt-2">
                            •••• •••• •••• {Math.random().toString().slice(2, 6)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
