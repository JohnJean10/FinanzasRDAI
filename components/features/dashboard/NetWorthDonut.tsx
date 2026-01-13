"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const SEGMENTS = [
    { name: "Marketing Expenses", color: "#1e293b", percentage: 35 },
    { name: "Rent Fees", color: "#64748b", percentage: 20 },
    { name: "Income", color: "#86efac", percentage: 30 },
    { name: "Payroll", color: "#94a3b8", percentage: 15 },
];

export function NetWorthDonutFynix() {
    const { metrics } = useFinancial();
    const totalValue = metrics.balance + metrics.totalSavings;

    // Calculate stroke dasharray for each segment
    const circumference = 2 * Math.PI * 45;
    let accumulatedOffset = 0;

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Net Worth
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
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            Total Cash Spent
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {formatCurrency(totalValue)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-xs text-slate-500">Increased By 12%</span>
                <TrendingUp size={14} className="text-emerald-500" />
            </div>
        </div>
    );
}
