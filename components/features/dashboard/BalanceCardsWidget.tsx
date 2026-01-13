"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink, CreditCard, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export function BalanceCardsFynix() {
    const { accounts } = useFinancial();
    const { t } = useI18n();

    // Calculate total balance from non-credit accounts
    const totalBalance = (accounts || []).reduce((acc, a) => {
        if (a.type === "credit") return acc; // Credit cards don't add to balance
        return acc + a.balance;
    }, 0);

    // Get card-type accounts (credit cards and bank accounts)
    const cardAccounts = (accounts || [])
        .filter(a => a.type === "credit" || a.type === "bank")
        .slice(0, 2);

    // Determine card brand and styling based on account data
    const getCardStyle = (account: typeof cardAccounts[0], index: number) => {
        const isCredit = account.type === "credit";

        // Brand detection from account name or brand field
        const name = account.name.toLowerCase();
        const brand = account.brand?.toLowerCase() || "";

        let brandLabel = "CARD";
        let gradient = "from-slate-700 to-slate-600";

        if (name.includes("visa") || brand === "visa") {
            brandLabel = "VISA";
            gradient = "from-blue-600 to-blue-500";
        } else if (name.includes("master") || brand === "mastercard") {
            brandLabel = "MC";
            gradient = "from-slate-700 to-slate-600";
        } else if (name.includes("amex") || brand === "amex") {
            brandLabel = "AMEX";
            gradient = "from-teal-600 to-teal-500";
        } else if (isCredit) {
            brandLabel = "CRÉDITO";
            gradient = index === 0 ? "from-blue-600 to-blue-500" : "from-slate-700 to-slate-600";
        } else {
            brandLabel = "BANCO";
            gradient = index === 0 ? "from-emerald-600 to-emerald-500" : "from-indigo-600 to-indigo-500";
        }

        return { brandLabel, gradient };
    };

    // Generate masked card number (use account ID as seed)
    const getMaskedNumber = (id: string) => {
        const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
        return `•••• •••• •••• ${String(hash).slice(-4).padStart(4, "0")}`;
    };

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{t.dashboard.balance}</span>
                <Link
                    href="/accounts"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    title="Ver cuentas"
                >
                    <span className="text-lg">⋮</span>
                </Link>
            </div>

            {/* Total Balance */}
            <div className="mb-5">
                <p className="text-xs text-slate-400 mb-1">{t.dashboard.balance} Total</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalBalance)}
                </h3>
            </div>

            {/* Account Cards */}
            {cardAccounts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {cardAccounts.map((account, index) => {
                        const { brandLabel, gradient } = getCardStyle(account, index);
                        const isCredit = account.type === "credit";

                        return (
                            <Link
                                key={account.id}
                                href="/accounts"
                                className={`bg-gradient-to-r ${gradient} rounded-2xl p-4 text-white relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer`}
                            >
                                {/* Brand Badge */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/20 rounded">
                                        {brandLabel}
                                    </span>
                                    <ExternalLink size={12} className="opacity-70" />
                                </div>

                                {/* Account Name */}
                                <p className="text-[10px] opacity-70 mb-1 truncate">
                                    {account.name}
                                </p>

                                {/* Balance */}
                                <p className={`text-base font-bold mb-2 ${isCredit && account.balance > 0 ? "text-red-200" : ""}`}>
                                    {isCredit && account.balance > 0 ? "-" : ""}
                                    {formatCurrency(Math.abs(account.balance))}
                                </p>

                                {/* Masked Number */}
                                <p className="text-[9px] opacity-50 font-mono">
                                    {getMaskedNumber(account.id)}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                // Empty state - no cards
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href="/accounts"
                        className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-4 text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center min-h-[120px] hover:scale-[1.02] transition-transform cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600"
                    >
                        <CreditCard size={24} className="mb-2 opacity-50" />
                        <span className="text-xs text-center">Agregar Tarjeta</span>
                    </Link>
                    <Link
                        href="/accounts"
                        className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-4 text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center min-h-[120px] hover:scale-[1.02] transition-transform cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600"
                    >
                        <Wallet size={24} className="mb-2 opacity-50" />
                        <span className="text-xs text-center">Agregar Banco</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
