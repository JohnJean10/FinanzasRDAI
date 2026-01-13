"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

interface KPICardProps {
    title: string;
    value: number;
    change?: number;
    changeLabel?: string;
    variant?: "default" | "success" | "warning" | "danger";
    icon?: React.ReactNode;
}

function KPICard({ title, value, change, changeLabel = "This month", variant = "default", icon }: KPICardProps) {
    const variantStyles = {
        default: "bg-slate-50 dark:bg-slate-800/30",
        success: "bg-emerald-50 dark:bg-emerald-900/20",
        warning: "bg-amber-50 dark:bg-amber-900/20",
        danger: "bg-red-50 dark:bg-red-900/20",
    };

    const valueStyles = {
        default: "text-slate-900 dark:text-white",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
        danger: "text-red-600 dark:text-red-400",
    };

    return (
        <div className={`${variantStyles[variant]} rounded-2xl p-4 relative`}>
            {icon && (
                <div className="absolute top-3 right-3 text-slate-400">
                    {icon}
                </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">{title}</p>
            <p className={`text-2xl font-bold ${valueStyles[variant]} mb-1`}>
                {formatCurrency(value)}
            </p>
            {typeof change !== "undefined" && (
                <div className="flex items-center gap-1 text-xs">
                    {change >= 0 ? (
                        <TrendingUp size={12} className="text-emerald-500" />
                    ) : (
                        <TrendingDown size={12} className="text-red-500" />
                    )}
                    <span className={change >= 0 ? "text-emerald-500" : "text-red-500"}>
                        {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="text-slate-400 ml-1">{changeLabel}</span>
                </div>
            )}
        </div>
    );
}

export function KPIGridBento() {
    const { metrics, transactions } = useFinancial();

    // Calculate current month metrics
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthTx = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const totalIncome = currentMonthTx
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = currentMonthTx
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    // Mock change percentages (would be calculated from previous month in real app)
    const incomeChange = 8.5;
    const expenseChange = -4.7;
    const revenueChange = 4.4;

    return (
        <div className="bg-white dark:bg-[#1E2030] rounded-bento p-6 shadow-bento dark:shadow-bento-dark">
            <div className="grid grid-cols-2 gap-4">
                <KPICard
                    title="Total Earning"
                    value={totalIncome}
                    change={incomeChange}
                    variant="success"
                    icon={<ExternalLink size={14} />}
                />
                <KPICard
                    title="Total Spending"
                    value={totalExpense}
                    change={expenseChange}
                    variant="danger"
                    icon={<ExternalLink size={14} />}
                />
                <KPICard
                    title="Total Income"
                    value={metrics.balance}
                    change={incomeChange * 0.5}
                    variant="default"
                    icon={<ExternalLink size={14} />}
                />
                <KPICard
                    title="Total Revenue"
                    value={totalIncome - totalExpense}
                    change={revenueChange}
                    variant="success"
                    icon={<ExternalLink size={14} />}
                />
            </div>
        </div>
    );
}
