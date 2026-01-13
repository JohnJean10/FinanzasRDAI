"use client";

import { useState, useMemo } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Period = "yearly" | "monthly" | "biweekly" | "weekly" | "daily";

export function CashflowChartFynix() {
    const { transactions, metrics } = useFinancial();
    const { t } = useI18n();
    const [period, setPeriod] = useState<Period>("monthly");

    const PERIODS = [
        { value: "yearly", label: "Anual" },
        { value: "monthly", label: "Mensual" },
        { value: "biweekly", label: "Quincenal" },
        { value: "weekly", label: "Semanal" },
        { value: "daily", label: "Diario" },
    ];

    const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const chartData = useMemo(() => {
        const now = new Date();
        const txList = transactions || [];

        if (period === "yearly") {
            // Last 5 years
            return Array.from({ length: 5 }, (_, i) => {
                const year = now.getFullYear() - 4 + i;
                const yearTx = txList.filter(tx => new Date(tx.date).getFullYear() === year);
                return {
                    name: year.toString(),
                    income: yearTx.filter(tx => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0),
                    expense: yearTx.filter(tx => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0),
                };
            });
        }

        if (period === "monthly") {
            // 12 months
            return MONTHS_ES.map((month, i) => {
                const monthTx = txList.filter(tx => {
                    const txDate = new Date(tx.date);
                    return txDate.getMonth() === i && txDate.getFullYear() === now.getFullYear();
                });
                return {
                    name: month,
                    income: monthTx.filter(tx => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0),
                    expense: monthTx.filter(tx => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0),
                };
            });
        }

        if (period === "biweekly") {
            // Last 8 biweekly periods
            return Array.from({ length: 8 }, (_, i) => {
                const endDate = new Date(now);
                endDate.setDate(endDate.getDate() - (i * 14));
                const startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 14);

                const periodTx = txList.filter(tx => {
                    const txDate = new Date(tx.date);
                    return txDate >= startDate && txDate <= endDate;
                });

                return {
                    name: `Q${8 - i}`,
                    income: periodTx.filter(tx => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0),
                    expense: periodTx.filter(tx => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0),
                };
            }).reverse();
        }

        if (period === "weekly") {
            // Last 8 weeks
            return Array.from({ length: 8 }, (_, i) => {
                const endDate = new Date(now);
                endDate.setDate(endDate.getDate() - (i * 7));
                const startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 7);

                const weekTx = txList.filter(tx => {
                    const txDate = new Date(tx.date);
                    return txDate >= startDate && txDate <= endDate;
                });

                return {
                    name: `S${8 - i}`,
                    income: weekTx.filter(tx => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0),
                    expense: weekTx.filter(tx => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0),
                };
            }).reverse();
        }

        // Daily - last 7 days
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now);
            date.setDate(date.getDate() - (6 - i));
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));

            const dayTx = txList.filter(tx => {
                const txDate = new Date(tx.date);
                return txDate >= dayStart && txDate <= dayEnd;
            });

            return {
                name: DAYS_ES[date.getDay()],
                income: dayTx.filter(tx => tx.type === "income").reduce((acc, tx) => acc + tx.amount, 0),
                expense: dayTx.filter(tx => tx.type === "expense").reduce((acc, tx) => acc + tx.amount, 0),
            };
        });
    }, [transactions, period]);

    const totalBalance = metrics.balance;

    const formatYAxis = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value.toString();
    };

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {t.dashboard.cashflow}
                </h3>

                {/* Period Selector */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <Calendar size={14} className="text-slate-400" />
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as Period)}
                        className="bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none cursor-pointer border-none"
                    >
                        {PERIODS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Balance + Legend */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs text-slate-400 mb-1">{t.dashboard.balance} Total</p>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(totalBalance)}
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-slate-500">{t.dashboard.income}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-xs text-slate-500">{t.dashboard.expense}</span>
                    </div>
                </div>
            </div>

            {/* Line Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            tickFormatter={formatYAxis}
                            width={50}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px',
                            }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                            formatter={(value, name) => [
                                formatCurrency(typeof value === 'number' ? value : 0),
                                name === 'income' ? 'Ingresos' : 'Gastos'
                            ]}
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, fill: '#3b82f6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#f87171"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, fill: '#f87171' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
