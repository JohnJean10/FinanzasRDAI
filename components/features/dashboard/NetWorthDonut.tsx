"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export function NetWorthDonut() {
    const { metrics } = useFinancial();

    // Calculate percentages for the donut (simplified)
    const total = metrics.balance + metrics.totalSavings;
    const netWorth = total > 0 ? total : 100000; // Default for display

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-6 h-full flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Donut Chart Container */}
            <div className="relative w-40 h-40 mb-4">
                {/* Outer ring - Slate */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-slate-200 dark:text-slate-700"
                    />
                    {/* Primary arc - Green */}
                    <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray="220 314"
                        strokeLinecap="round"
                        className="text-emerald-500"
                    />
                    {/* Secondary arc - Dark */}
                    <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray="60 314"
                        strokeDashoffset="-220"
                        strokeLinecap="round"
                        className="text-slate-800 dark:text-slate-300"
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                        Total Cash Spent
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(netWorth)}
                    </span>
                </div>
            </div>

            {/* Increase indicator */}
            <div className="flex items-center gap-2 text-emerald-500">
                <span className="text-sm font-medium">Increased By 12%</span>
                <TrendingUp size={16} />
            </div>
        </div>
    );
}
