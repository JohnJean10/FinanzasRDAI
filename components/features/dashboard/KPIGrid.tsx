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

    const income = currentMonthTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = currentMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;
    const savings = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // Calculate previous month stats
    const prevMonthDate = new Date(currentYear, currentMonthIdx - 1, 1);
    const prevMonthIdx = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    const prevMonthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === prevMonthIdx && d.getFullYear() === prevYear;
    });

    const prevIncome = prevMonthTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const prevExpenses = prevMonthTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const prevBalance = prevIncome - prevExpenses;
    const prevSavings = prevIncome > 0 ? ((prevIncome - prevExpenses) / prevIncome) * 100 : 0;

    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const change = ((current - previous) / previous) * 100;
        return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const incomeChange = calculateChange(income, prevIncome);
    const expenseChange = calculateChange(expenses, prevExpenses);
    const balanceChange = calculateChange(balance, prevBalance);
    const savingsChange = calculateChange(savings, prevSavings);

    const kpis = [
        {
            title: "Balance Total",
            value: formatCurrency(balance),
            icon: DollarSign,
            color: "blue",
            change: balanceChange,
            trend: balance >= prevBalance ? "up" : "down",
            sentiment: balance >= prevBalance ? "positive" : "negative"
        },
        {
            title: "Ingresos",
            value: formatCurrency(income),
            icon: TrendingUp,
            color: "emerald",
            change: incomeChange,
            trend: income >= prevIncome ? "up" : "down",
            sentiment: income >= prevIncome ? "positive" : "negative"
        },
        {
            title: "Gastos",
            value: formatCurrency(expenses),
            icon: TrendingDown,
            color: "red",
            change: expenseChange,
            trend: expenses >= prevExpenses ? "up" : "down",
            sentiment: expenses < prevExpenses ? "positive" : "negative" // Less expenses is positive
        },
        {
            title: "Ahorro",
            value: `${savings.toFixed(1)}%`,
            icon: PiggyBank,
            color: "purple",
            change: savingsChange,
            trend: savings >= prevSavings ? "up" : "down",
            sentiment: savings >= prevSavings ? "positive" : "negative"
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
