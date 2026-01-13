"use client";

import { useMemo } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, MoreVertical } from "lucide-react";

export function SubscriptionsWidget() {
    const { transactions } = useFinancial();

    // Find recurring transactions
    const subscriptions = useMemo(() => {
        const recurring = transactions.filter(t => t.isRecurring && t.type === "expense");

        // Calculate days until next payment
        const withDaysLeft = recurring.map(sub => {
            const nextPayment = sub.nextPaymentDate ? new Date(sub.nextPaymentDate) : new Date();
            const today = new Date();
            const diffTime = nextPayment.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { ...sub, daysLeft };
        });

        // Sort by days left and take top 3
        return withDaysLeft
            .sort((a, b) => a.daysLeft - b.daysLeft)
            .slice(0, 3);
    }, [transactions]);

    // Mock data for demo when no recurring transactions exist
    const mockSubscriptions = [
        { id: 1, subscriptionName: "Netflix", amount: 549, daysLeft: 2, description: "Netflix Premium" },
        { id: 2, subscriptionName: "Spotify", amount: 199, daysLeft: 5, description: "Spotify Family" },
        { id: 3, subscriptionName: "Adobe", amount: 1200, daysLeft: 12, description: "Adobe Creative Cloud" },
    ];

    const displaySubs = subscriptions.length > 0 ? subscriptions : mockSubscriptions;

    const getDaysText = (days: number) => {
        if (days < 0) return "Vencido";
        if (days === 0) return "Hoy";
        if (days === 1) return "Mañana";
        return `En ${days} días`;
    };

    const getDaysColor = (days: number) => {
        if (days < 0) return "text-red-500";
        if (days <= 2) return "text-amber-500";
        return "text-slate-400";
    };

    return (
        <div className="bg-white dark:bg-[#1E2030] rounded-bento p-6 shadow-bento dark:shadow-bento-dark">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Suscripciones
                </h3>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <MoreVertical size={18} className="text-slate-400" />
                </button>
            </div>

            <div className="space-y-4">
                {displaySubs.map((sub, index) => (
                    <div
                        key={sub.id || index}
                        className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                    >
                        <BrandLogo
                            description={sub.subscriptionName || sub.description}
                            category="suscripciones"
                            size="md"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {sub.subscriptionName || sub.description}
                            </p>
                            <p className={`text-xs ${getDaysColor(sub.daysLeft)}`}>
                                {getDaysText(sub.daysLeft)}
                            </p>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {formatCurrency(sub.amount)}
                        </p>
                    </div>
                ))}
            </div>

            {subscriptions.length === 0 && (
                <p className="text-xs text-slate-400 text-center mt-4">
                    Datos de demostración. Añade transacciones recurrentes para ver tus suscripciones.
                </p>
            )}
        </div>
    );
}
