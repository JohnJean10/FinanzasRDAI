"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

export function KPIGridFynix() {
    const { transactions } = useFinancial();

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

    const kpis = [
        {
            label: "Total Earning",
            value: totalEarning,
            change: 8.5,
            isPositive: true,
            accentColor: "emerald"
        },
        {
            label: "Total Spending",
            value: totalSpending,
            change: -4.7,
            isPositive: false,
            accentColor: "red"
        },
        {
            label: "Total Income",
            value: totalEarning,
            change: 2.3,
            isPositive: true,
            accentColor: "emerald"
        },
        {
            label: "Total Revenue",
            value: totalEarning - totalSpending,
            change: 4.4,
            isPositive: true,
            accentColor: "emerald"
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {kpis.map((kpi, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-[#1a1f2e] rounded-[24px] p-5 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {kpi.label}
                        </span>
                        <button className="text-slate-300 hover:text-slate-500 transition-colors">
                            <ExternalLink size={12} />
                        </button>
                    </div>

                    {/* Value */}
                    <div className={`text-2xl font-bold mb-2 ${kpi.accentColor === "red"
                            ? "text-red-500"
                            : "text-slate-900 dark:text-white"
                        }`}>
                        {formatCurrency(kpi.value)}
                    </div>

                    {/* Change indicator */}
                    <div className="flex items-center gap-1.5">
                        {kpi.isPositive ? (
                            <TrendingUp size={12} className="text-emerald-500" />
                        ) : (
                            <TrendingDown size={12} className="text-red-500" />
                        )}
                        <span className={`text-xs font-semibold ${kpi.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                            {kpi.isPositive ? '↑' : '↓'} {Math.abs(kpi.change)}%
                        </span>
                        <span className="text-[11px] text-slate-400">
                            This month
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
