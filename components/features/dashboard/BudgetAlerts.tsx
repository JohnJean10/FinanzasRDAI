"use client";

import { useState, useEffect } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";

interface Alert {
    category: string;
    amount: number;
    limit: number;
    type: 'danger' | 'success' | 'warning';
    title?: string;
    message?: string;
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
                    limit: budget.limit,
                    type: 'danger',
                    title: '¡Presupuesto Excedido!',
                    message: `Has gastado ${formatCurrency(spent)} en ${budget.category}.`
                });
            }
        });

        // GLOBAL HEALTH LOGIC (Wealth Builder vs Hemorrhage)
        const currentTx = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
        const income = currentTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);

        // Filter out savings from expenses (assuming type='expense' & category='ahorro'/'inversion'/'meta')
        const allExpenses = currentTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const savingsNodes = currentTx
            .filter(t => t.type === 'expense' && ['ahorro', 'inversion', 'meta', 'ahorros'].includes(t.category))
            .reduce((acc, t) => acc + t.amount, 0);

        const realExpenses = allExpenses - savingsNodes;

        // Condition 1: Hemorrhage (Spending > Income on non-savings)
        if (realExpenses > income && income > 0) {
            overruns.unshift({
                category: 'Global',
                amount: realExpenses,
                limit: income,
                type: 'danger',
                title: 'Hemorragia Financiera 🩸',
                message: `Tus gastos reales (${formatCurrency(realExpenses)}) superan tus ingresos.`
            });
        }
        // Condition 2: Wealth Builder (Positive Real Cashflow + Active Saving)
        // If "Cash is low" (High Total Expense) but "Real Expense" is low.
        else if ((income - realExpenses) > 0 && savingsNodes > (income * 0.1)) {
            // Example: Earn 100, Spend 50, Save 40. Total Out 90. Cash 10.
            // Real Expense 50 < Income 100. Positive.
            // Savings 40 > 10.
            overruns.unshift({
                category: 'Global',
                amount: savingsNodes,
                limit: income,
                type: 'success',
                title: 'Modo Constructor de Riqueza 🚀',
                message: `Estás construyendo patrimonio aunque el efectivo sea bajo. Ahorro mes: ${formatCurrency(savingsNodes)}`
            });
        }

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
            {alerts.map((alert, idx) => (
                <div
                    key={`${alert.category}-${idx}`}
                    className={`bg-white dark:bg-[#0f172a] border-l-4 shadow-xl rounded-r-xl p-4 flex items-start justify-between animate-in slide-in-from-right duration-500 ${alert.type === 'success' ? 'border-emerald-500' : 'border-red-500'
                        }`}
                >
                    <div className="flex gap-3">
                        <div className={`p-2 rounded-full h-fit ${alert.type === 'success'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            }`}>
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                                {alert.title || 'Alerta del Sistema'}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                {alert.message || (
                                    <>
                                        Has gastado <span className={`font-bold ${alert.type === 'success' ? 'text-emerald-600' : 'text-red-600'
                                            }`}>{formatCurrency(alert.amount)}</span> en <span className="capitalize font-medium">{alert.category}</span>.
                                        <br />
                                        Límite: {formatCurrency(alert.limit)}
                                    </>
                                )}
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
