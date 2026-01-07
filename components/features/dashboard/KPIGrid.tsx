"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function KPIGrid() {
    const { metrics } = useFinancial();

    // Mapping context metrics to UI
    const { balance, totalIncome, totalExpenses, savingsRate } = metrics;

    // For now, we disable the trend comparison as the advanced context only calculates the selected period.
    // Future improvement: Calculate previous period metrics in context.
    const incomeChange = "-";
    const expenseChange = "-";
    const balanceChange = "-";
    const savingsChange = "-";

    const kpis = [
        {
            title: "Balance Histórico", // Renamed for clarity as per context logic
            value: formatCurrency(balance),
            icon: DollarSign,
            color: "blue",
            change: balanceChange,
            trend: "neutral", // No trend for now
            sentiment: "neutral"
        },
        {
            title: "Ingresos",
            value: formatCurrency(totalIncome),
            icon: TrendingUp,
            color: "emerald",
            change: incomeChange,
            trend: "neutral",
            sentiment: "neutral"
        },
        {
            title: "Gastos",
            value: formatCurrency(totalExpenses),
            icon: TrendingDown,
            color: "red",
            change: expenseChange,
            trend: "neutral",
            sentiment: "neutral"
        },
        {
            title: "Tasa de Ahorro",
            value: `${savingsRate.toFixed(1)}%`,
            icon: PiggyBank,
            color: "purple",
            change: savingsChange,
            trend: "neutral",
            sentiment: "neutral"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => (
                <div
                    key={idx}
                    className="bg-white dark:bg-[#1e1b4b] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-${kpi.color}-50 dark:bg-${kpi.color}-900/20 text-${kpi.color}-600 dark:text-${kpi.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                            <kpi.icon size={24} />
                        </div>

                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.sentiment === 'positive'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            }`}>
                            {kpi.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            <span>{kpi.change}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{kpi.title}</h3>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {kpi.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
