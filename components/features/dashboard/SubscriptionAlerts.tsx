"use client";

import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { Clock, X, CheckCircle } from "lucide-react";

export function SubscriptionAlerts() {
    const { transactions, addTransaction } = useFinancial();
    const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

    // Find overdue recurring transactions
    const now = new Date();
    const overdueSubscriptions = (transactions || [])
        .filter(tx => {
            if (!tx.isRecurring || tx.type !== "expense") return false;

            const txDate = new Date(tx.date);
            const daysSincePayment = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));

            // Consider overdue if more than 30 days since last payment
            return daysSincePayment > 30 && !dismissedAlerts.includes(String(tx.id));
        })
        .slice(0, 3);

    const handleMarkAsPaid = (tx: typeof overdueSubscriptions[0]) => {
        // Create a new transaction for this payment
        addTransaction({
            type: "expense",
            amount: tx.amount,
            description: tx.description,
            date: new Date().toISOString(),
            category: tx.category,
            accountId: tx.accountId,
            isRecurring: true,
        });

        // Dismiss this alert
        setDismissedAlerts(prev => [...prev, String(tx.id)]);
    };

    const handleDismiss = (id: string) => {
        setDismissedAlerts(prev => [...prev, id]);
    };

    const formatDueDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    };

    if (overdueSubscriptions.length === 0) return null;

    return (
        <div className="space-y-2 mb-4">
            {overdueSubscriptions.map((sub) => (
                <div
                    key={sub.id}
                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/50 rounded-xl"
                >
                    {/* Left: Icon + Message */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Clock size={16} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                Pago Pendiente
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Tienes 1 pago vencido: {sub.description} - {formatCurrency(sub.amount)} (Vence {formatDueDate(sub.date)})
                            </p>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleMarkAsPaid(sub)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                            <CheckCircle size={14} />
                            Marcar pagado
                        </button>
                        <button
                            onClick={() => handleDismiss(String(sub.id))}
                            className="p-2 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 rounded-lg transition-colors"
                        >
                            <X size={16} className="text-slate-500 dark:text-slate-400" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
