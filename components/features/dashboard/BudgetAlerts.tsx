"use client";

import { useState, useEffect } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";

interface Alert {
    category: string;
    amount: number;
    limit: number;
}

export function BudgetAlerts() {
    const { budgetConfigs, transactions } = useFinancial();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Calculate overruns
        const currentMonth = new Date().getMonth();
        const overruns: Alert[] = [];

        budgetConfigs.forEach(budget => {
            const spent = transactions
                .filter(t =>
                    t.category === budget.category &&
                    t.type === 'expense' &&
                    new Date(t.date).getMonth() === currentMonth
                )
                .reduce((acc, t) => acc + t.amount, 0);

            if (spent > budget.limit) {
                overruns.push({
                    category: budget.category,
                    amount: spent,
                    limit: budget.limit
                });
            }
        });

        if (overruns.length > 0) {
            setAlerts(overruns);
            setIsVisible(true);

            // Auto-dismiss after 8 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [budgetConfigs, transactions]);

    if (!isVisible || alerts.length === 0) return null;

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
            {alerts.map((alert) => (
                <div
                    key={alert.category}
                    className="bg-white dark:bg-[#0f172a] border-l-4 border-red-500 shadow-xl rounded-r-xl p-4 flex items-start justify-between animate-in slide-in-from-right duration-500"
                >
                    <div className="flex gap-3">
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full h-fit text-red-600 dark:text-red-400">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                                ¡Presupuesto Excedido!
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Has gastado <span className="font-bold text-red-600 dark:text-red-400">{formatCurrency(alert.amount)}</span> en <span className="capitalize font-medium">{alert.category}</span>.
                                <br />
                                Límite: {formatCurrency(alert.limit)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
