"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

export function KPIGridFynix() {
    const { transactions } = useFinancial();

    // Calculate current month metrics
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthTx = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const totalEarning = currentMonthTx
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalSpending = currentMonthTx
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalIncome = totalEarning;
    const totalRevenue = totalEarning - totalSpending;

    const kpis = [
        {
            label: "Total Earning",
            value: totalEarning,
            change: 8.5,
            isPositive: true,
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            textColor: "text-emerald-600 dark:text-emerald-400"
        },
        {
            label: "Total Spending",
            value: totalSpending,
            change: -4.7,
            isPositive: false,
            bgColor: "bg-red-50 dark:bg-red-900/20",
            textColor: "text-red-600 dark:text-red-400"
        },
        {
            label: "Total Income",
            value: totalIncome,
            change: 2.3,
            isPositive: true,
            bgColor: "bg-slate-50 dark:bg-slate-800/50",
            textColor: "text-slate-900 dark:text-white"
        },
        {
            label: "Total Revenue",
            value: totalRevenue,
            change: 4.4,
            isPositive: true,
            bgColor: "bg-slate-50 dark:bg-slate-800/50",
            textColor: "text-slate-900 dark:text-white"
        },
    ];

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-6 h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            <div className="grid grid-cols-2 gap-4 h-full">
                {kpis.map((kpi, index) => (
                    <div
                        key={index}
                        className={`${kpi.bgColor} rounded-[24px] p-5 flex flex-col justify-between relative`}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {kpi.label}
                            </span>
                            <ExternalLink size={14} className="text-slate-400" />
                        </div>

                        {/* Value */}
                        <div className={`text-2xl font-bold ${kpi.textColor} mb-2`}>
                            {formatCurrency(kpi.value)}
                        </div>

                        {/* Change indicator */}
                        <div className="flex items-center gap-1">
                            {kpi.isPositive ? (
                                <TrendingUp size={12} className="text-emerald-500" />
                            ) : (
                                <TrendingDown size={12} className="text-red-500" />
                            )}
                            <span className={`text-xs font-medium ${kpi.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                {kpi.isPositive ? '↑' : '↓'} {Math.abs(kpi.change)}%
                            </span>
                            <span className="text-xs text-slate-400 ml-1">
                                This month
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
