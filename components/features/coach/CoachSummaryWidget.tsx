"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";

export function CoachSummaryWidget() {
    const { transactions, user } = useFinancial();

    // Calculate current month's totals
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = currentTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Find top spending category
    const categoryTotals = currentTransactions
        .filter(t => t.type === 'expense' && t.category !== 'ahorro')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)[0];

    const balance = income - expenses;
    const isPositive = balance >= 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-in slide-in-from-top-4 duration-500">
            {/* Balance Card */}
            <div className={`p-4 rounded-xl border ${isPositive ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900' : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className={`text-xs font-semibold uppercase ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            Balance Mensual
                        </p>
                        <h3 className={`text-2xl font-bold mt-1 ${isPositive ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                            {formatCurrency(balance)}
                        </h3>
                    </div>
                    {isPositive ? (
                        <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" size={24} />
                    ) : (
                        <AlertCircle className="text-red-500 dark:text-red-400" size={24} />
                    )}
                </div>
            </div>

            {/* Income vs Expenses */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                            <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Ingresos</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(income)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50">
                            <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Gastos</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(expenses)}</span>
                </div>
            </div>

            {/* Top Insight */}
            <div className="p-4 rounded-xl bg-slate-900 dark:bg-indigo-950 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                    <p className="text-xs text-slate-400 dark:text-indigo-200 font-medium uppercase mb-1">Mayor Gasto</p>
                    {topCategory ? (
                        <>
                            <h3 className="text-xl font-bold capitalize">{topCategory[0].replace('_', ' ')}</h3>
                            <p className="text-sm text-slate-300 dark:text-indigo-300 mt-1">
                                {formatCurrency(topCategory[1])} este mes
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Sin gastos registrados aún</p>
                    )}
                </div>
                {/* Decorative background element */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </div>
    );
}
