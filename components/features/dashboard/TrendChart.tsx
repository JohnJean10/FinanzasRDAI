"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useFinancial } from "@/lib/context/financial-context";

export function TrendChart() {
    const { transactions } = useFinancial();

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
                income: 0,
                expense: 0
            });
        }
        return months;
    };

    const monthBuckets = getLast6Months();

    // Fill buckets with transaction data
    transactions.forEach(t => {
        const tDate = new Date(t.date);
        const bucket = monthBuckets.find(b => b.monthIndex === tDate.getMonth() && b.year === tDate.getFullYear());
        if (bucket) {
            if (t.type === 'income') bucket.income += t.amount;
            if (t.type === 'expense') bucket.expense += t.amount;
        }
    });

    const data = monthBuckets.map(b => ({
        month: b.name,
        income: b.income,
        expense: b.expense
    }));

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 h-[350px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Tendencia de Flujo</h3>
                <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1 outline-none text-slate-600 dark:text-slate-300">
                    <option>Últimos 6 meses</option>
                    <option>Este año</option>
                </select>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', fontSize: 12 }}
                            className="text-slate-400 dark:text-slate-500"
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', fontSize: 12 }}
                            className="text-slate-400 dark:text-slate-500"
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--border)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                            cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            name="Ingresos"
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            name="Gastos"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
