"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function NetWorthChart() {
    const { goals, transactions } = useFinancial();

    // Mock logic to generate "history" based on current state
    // In a real app, we would store snapshots of monthly net worth
    // Generate last 6 months buckets
    const getLast6Months = () => {
        const months = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                name: d.toLocaleDateString('es-DO', { month: 'short' }).charAt(0).toUpperCase() + d.toLocaleDateString('es-DO', { month: 'short' }).slice(1),
                monthIndex: d.getMonth(),
                year: d.getFullYear(),
                netWorth: 0
            });
        }
        return months;
    };

    const monthBuckets = getLast6Months();

    // Calculate cumulative net worth per month
    // Note: detailed historical snapshot is not stored, so we estimate based on transaction dates.
    // Ideally, we'd replay all history, but for MVP we categorize current transactions into months.
    transactions.forEach(t => {
        const tDate = new Date(t.date);
        // Find buckets that correspond to this transaction or AFTER (cumulative effect)
        // Actually, simplest Net Worth = All Income - All Expenses up to that point.

        monthBuckets.forEach(bucket => {
            const bucketDate = new Date(bucket.year, bucket.monthIndex + 1, 0); // End of month
            if (tDate <= bucketDate) {
                if (t.type === 'income') bucket.netWorth += t.amount;
                if (t.type === 'expense') bucket.netWorth -= t.amount;
            }
        });
    });

    // Add current goal savings to the latest month/current state if they are not tracked as transactions?
    // In this app, "Goals" are separate from transactions mostly? 
    // Usually transfers to goals are just "movements", but let's assume Goal 'current' is part of Net Worth.
    // If we want simple visual: Net Worth = Cash Balance (Income - Expense) + Savings (Goals).
    // The loop above calculates Cash Balance evolution.
    // Savings (Goals) might be static or have history. We don't have goal history.
    // Let's add current total savings just to the LAST bucket (Current Month) or distribute?
    // Better: Assume Cash Balance includes money "allocated" to goals unless it was an 'expense'.
    // If 'transfer' type exists, it's neutral.
    // So Cash Balance calculated from Income - Expense is roughly 'Liquid Assets'.
    // If user deleted data, transactions are empty => Net Worth 0. Correct.

    const data = monthBuckets.map(b => ({
        month: b.name,
        value: b.netWorth > 0 ? b.netWorth : 0 // Don't show negative net worth if possible, or allow it.
    }));

    return (
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-blue-900/30 col-span-1 lg:col-span-2">
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Evolución de Patrimonio</h3>
            <p className="text-sm text-slate-500 mb-6">Crecimiento estimado de tus activos (Ahorros + Balance) en los últimos 6 meses.</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            formatter={(value: any) => formatCurrency(Number(value))}
                        // itemStyle={{ color: '#1e293b' }}
                        // contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#1e293b', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        // labelStyle={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="value" name="Patrimonio" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
