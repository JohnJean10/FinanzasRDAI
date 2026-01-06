"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export function BudgetBarChart() {
    const { budgetConfigs, transactions } = useFinancial();
    const currentMonth = new Date().getMonth();

    const data = budgetConfigs.map(budget => {
        const spent = transactions
            .filter(t =>
                t.category === budget.category &&
                t.type === 'expense' &&
                new Date(t.date).getMonth() === currentMonth
            )
            .reduce((acc, t) => acc + t.amount, 0);

        return {
            name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1).replace('_', ' '),
            Presupuesto: budget.limit,
            Real: spent,
            percent: (spent / budget.limit) * 100
        };
    });

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-[400px] flex items-center justify-center">
                <p className="text-slate-400">No hay presupuestos configurados.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-blue-900/30">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Presupuesto vs. Realidad</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip
                            formatter={(value: any) => formatCurrency(Number(value))}
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: 'white', color: '#1e293b' }}
                        />
                        <Legend />
                        <Bar dataKey="Presupuesto" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="Real" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                // Red if over budget, Green/Blue if under
                                <Cell key={`cell-${index}`} fill={entry.Real > entry.Presupuesto ? '#ef4444' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
