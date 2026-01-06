"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function KPIGrid() {
    const { transactions } = useFinancial();

    // Calculate current month stats
    const now = new Date();
    const currentMonthIdx = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear;
    });

    const income = currentMonthTx
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = currentMonthTx
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;
    // Mock savings rate for now
    const savings = income > 0 ? ((income - expenses) / income) * 100 : 0;

    const kpis = [
        {
            title: "Balance Total",
            value: formatCurrency(balance),
            icon: DollarSign,
            color: "blue",
            change: "+12.5%",
            trend: "up"
        },
        {
            title: "Ingresos",
            value: formatCurrency(income),
            icon: TrendingUp,
            color: "emerald",
            change: "+8.2%",
            trend: "up"
        },
        {
            title: "Gastos",
            value: formatCurrency(expenses),
            icon: TrendingDown,
            color: "red",
            change: "-2.1%",
            trend: "down"
        },
        {
            title: "Ahorro",
            value: `${savings.toFixed(1)}%`,
            icon: PiggyBank,
            color: "purple",
            change: "+1.5%",
            trend: "up"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => (
                <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-${kpi.color}-50 dark:bg-${kpi.color}-900/20 text-${kpi.color}-600 dark:text-${kpi.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                            <kpi.icon size={24} />
                        </div>

                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.trend === 'up'
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
