"use client";

import { useMemo } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatCurrency } from "@/lib/utils";
import { MoreVertical } from "lucide-react";

export function SubscriptionsWidgetFynix() {
    const { transactions } = useFinancial();

    // Find recurring transactions
    const subscriptions = useMemo(() => {
        const recurring = transactions.filter(t => t.isRecurring && t.type === "expense");

        const withDaysLeft = recurring.map(sub => {
            const nextPayment = sub.nextPaymentDate ? new Date(sub.nextPaymentDate) : new Date();
            const today = new Date();
            const diffTime = nextPayment.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { ...sub, daysLeft };
        });

        return withDaysLeft.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3);
    }, [transactions]);

    // Mock data for demo
    const mockSubscriptions = [
        { id: 1, subscriptionName: "Amazon", amount: 600, daysLeft: 32, description: "Amazon Prime" },
        { id: 2, subscriptionName: "Netflix", amount: 549, daysLeft: 5, description: "Netflix Premium" },
        { id: 3, subscriptionName: "Spotify", amount: 199, daysLeft: 12, description: "Spotify Family" },
    ];

    const displaySubs = subscriptions.length > 0 ? subscriptions : mockSubscriptions;

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-6 h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Suscripciones
                </h3>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={18} />
                </button>
            </div>

            {/* Subscriptions List */}
            <div className="space-y-4">
                {displaySubs.map((sub, index) => (
                    <div
                        key={sub.id || index}
                        className="flex items-center gap-4"
                    >
                        <BrandLogo
                            description={sub.subscriptionName || sub.description}
                            category="suscripciones"
                            size="md"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                {sub.subscriptionName || sub.description}
                            </p>
                            <p className="text-xs text-slate-400">
                                En {sub.daysLeft} días
                            </p>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">
                            {formatCurrency(sub.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
