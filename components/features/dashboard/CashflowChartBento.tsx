"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function CashflowChartFynix() {
    const { transactions, timeRange, setTimeRange } = useFinancial();
    const { t } = useI18n();

    // Days of week in Spanish
    const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Get last 7 days data
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return date;
    });

    const dailyData = last7Days.map(date => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayTx = (transactions || []).filter(tx => {
            const txDate = new Date(tx.date);
            return txDate >= dayStart && txDate <= dayEnd;
        });

        const income = dayTx.filter(tx => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0);
        const expense = dayTx.filter(tx => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0);

        return {
            day: DAYS_ES[date.getDay()],
            income,
            expense,
        };
    });

    const totalBalance = dailyData.reduce((acc, d) => acc + d.income - d.expense, 0);
    const maxValue = Math.max(...dailyData.flatMap(d => [d.income, d.expense]), 1);

    const timeRangeOptions = [
        { value: "thisMonth", label: t.timeRange.thisMonth },
        { value: "lastMonth", label: t.timeRange.lastMonth },
        { value: "last3Months", label: t.timeRange.last3Months },
        { value: "ytd", label: t.timeRange.thisYear },
    ];

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t.dashboard.cashflow}
                    </h3>
                    <p className="text-xs text-slate-400">{t.dashboard.balance}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {formatCurrency(totalBalance)}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Legend */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-slate-500">{t.dashboard.income}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-rose-400" />
                            <span className="text-xs text-slate-500">{t.dashboard.expense}</span>
                        </div>
                    </div>

                    {/* Time Range */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                        className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
                    >
                        {timeRangeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Chart */}
            <div className="flex items-end gap-4 h-48">
                {dailyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col items-center gap-1 h-40">
                            {/* Income bar */}
                            <div
                                className="w-full max-w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-t-lg transition-all"
                                style={{ height: `${(day.income / maxValue) * 100}%` }}
                            >
                                <div
                                    className="w-full h-full bg-emerald-500 rounded-t-lg"
                                    style={{ height: `${day.income > 0 ? 100 : 0}%` }}
                                />
                            </div>
                            {/* Expense bar */}
                            <div
                                className="w-full max-w-8 bg-rose-100 dark:bg-rose-900/30 rounded-b-lg transition-all"
                                style={{ height: `${(day.expense / maxValue) * 100}%` }}
                            >
                                <div
                                    className="w-full h-full bg-rose-400 rounded-b-lg"
                                    style={{ height: `${day.expense > 0 ? 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <span className="text-xs text-slate-400">{day.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
