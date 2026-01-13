"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function NetWorthDonutFynix() {
    const { metrics, budgetConfigs } = useFinancial();
    const { t } = useI18n();

    const totalValue = Math.abs(metrics.balance + metrics.totalSavings);

    // Get top budget categories for the donut
    const topBudgets = (budgetConfigs || []).slice(0, 4);
    const COLORS = ["#1e293b", "#64748b", "#86efac", "#94a3b8"];

    const SEGMENTS = topBudgets.length > 0
        ? topBudgets.map((b, i) => ({
            name: b.name,
            color: COLORS[i % COLORS.length],
            percentage: 100 / topBudgets.length
        }))
        : [
            { name: "Gastos Marketing", color: "#1e293b", percentage: 35 },
            { name: "Alquiler", color: "#64748b", percentage: 20 },
            { name: "Ingresos", color: "#86efac", percentage: 30 },
            { name: "Nómina", color: "#94a3b8", percentage: 15 },
        ];

    const circumference = 2 * Math.PI * 45;
    let accumulatedOffset = 0;

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                {t.dashboard.netWorth}
            </h3>

            <div className="flex items-center gap-6">
                {/* Legend */}
                <div className="flex flex-col gap-2">
                    {SEGMENTS.map((segment, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: segment.color }}
                            />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {segment.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Donut Chart */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {SEGMENTS.map((segment, index) => {
                            const dashLength = (segment.percentage / 100) * circumference;
                            const dashOffset = accumulatedOffset;
                            accumulatedOffset += dashLength;

                            return (
                                <circle
                                    key={index}
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth="8"
                                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                                    strokeDashoffset={-dashOffset}
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                            {t.dashboard.totalCashSpent}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {formatCurrency(totalValue)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-xs text-slate-500">{t.dashboard.increasedBy} 12%</span>
                <TrendingUp size={14} className="text-emerald-500" />
            </div>
        </div>
    );
}
