"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function SubscriptionsWidget() {
    const { transactions } = useFinancial();
    const { t } = useI18n();

    // Get recurring transactions as subscriptions
    const subscriptions = (transactions || [])
        .filter(tx => tx.isRecurring && tx.type === "expense")
        .slice(0, 4);

    // Mock data if no subscriptions exist
    const displaySubscriptions = subscriptions.length > 0
        ? subscriptions.map(tx => ({
            name: tx.description,
            date: new Date(tx.date),
            amount: tx.amount,
            category: tx.category,
        }))
        : [
            { name: "Netflix", date: new Date(2026, 0, 15), amount: 650, category: "entretenimiento" },
            { name: "Spotify Premium", date: new Date(2026, 0, 18), amount: 299, category: "entretenimiento" },
            { name: "iCloud Storage", date: new Date(2026, 0, 20), amount: 49, category: "tecnología" },
            { name: "Disney+", date: new Date(2026, 0, 22), amount: 350, category: "entretenimiento" },
        ];

    const formatShortDate = (date: Date) => {
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Pagos Próximos
                </h3>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Subscription List */}
            <div className="flex-1 space-y-3">
                {displaySubscriptions.map((sub, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 py-2"
                    >
                        {/* Logo */}
                        <BrandLogo
                            description={sub.name}
                            category={sub.category}
                            size="md"
                        />

                        {/* Name + Date */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {sub.name}
                            </p>
                            <p className="text-xs text-slate-400">
                                {formatShortDate(sub.date)}
                            </p>
                        </div>

                        {/* Amount */}
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {formatCurrency(sub.amount)}
                        </span>
                    </div>
                ))}
            </div>

            {/* See All Link */}
            <Link
                href="/transactions"
                className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-center text-xs text-slate-500 hover:text-emerald-500 transition-colors"
            >
                {t.common.viewAll}
            </Link>
        </div>
    );
}
