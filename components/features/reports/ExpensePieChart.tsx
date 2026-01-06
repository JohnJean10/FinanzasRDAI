"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export function ExpensePieChart() {
    const { transactions } = useFinancial();

    // 1. Filter expenses and group by category
    const currentMonth = new Date().getMonth();
    const expenses = transactions.filter(t =>
        t.type === 'expense' &&
        new Date(t.date).getMonth() === currentMonth
    );

    const dataMap = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as { [key: string]: number });

    const data = Object.entries(dataMap).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
        value
    })).sort((a, b) => b.value - a.value);

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-[400px] flex items-center justify-center">
                <p className="text-slate-400">No hay gastos registrados este mes.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-blue-900/30">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Distribución de Gastos</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
