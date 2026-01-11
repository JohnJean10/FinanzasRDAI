"use client";

import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Transaction } from "@/lib/types";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

interface ExpensePieChartProps {
    filteredTransactions: Transaction[];
}

export function ExpensePieChart({ filteredTransactions }: ExpensePieChartProps) {
    // 1. Filter expenses
    const expenses = filteredTransactions.filter(t => t.type === 'expense');

    const dataMap = expenses.reduce((acc, t) => {
        const key = t.budgetId || t.category || 'otros';
        acc[key] = (acc[key] || 0) + t.amount;
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
                            formatter={(value: any) => formatCurrency(Number(value))}
                            contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
