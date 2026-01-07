
"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Transaction } from "@/lib/types";

interface CashFlowChartProps {
    transactions: Transaction[];
}

export function CashFlowChart({ transactions }: CashFlowChartProps) {
    // Group by month (or day if range is short, but let's stick to monthly for now or auto-detect)
    // For simplicity in MVP, let's just group by "Income vs Expense" total for the period
    // OR create a daily/weekly breakdown if the range allows.

    // Let's do a Daily/Weekly breakdown based on data volume?
    // Actually, a simple "Income vs Expense" Bar for the whole filtered period is good for "Cash Flow" summary.
    // BUT "Cash Flow" usually implies a Trend. 
    // Let's do: Group by Day (if <= 31 days) or Month (if > 31 days).

    // For now, let's keep it simple: Single Bar comparison or Monthly Trend.
    // The user asked for "Flujo de Caja" which often means "Trend".

    // Let's try to show a Trend.
    const dataMap: { [key: string]: { date: string; income: number; expense: number } } = {};

    transactions.forEach(t => {
        const date = new Date(t.date).toLocaleDateString(); // Simple aggregation by day
        if (!dataMap[date]) {
            dataMap[date] = { date, income: 0, expense: 0 };
        }
        if (t.type === 'income') dataMap[date].income += t.amount;
        else dataMap[date].expense += t.amount;
    });

    // If too many days, we might want to group better.
    // But Recharts handles it okay-ish.

    // Convert to array and sort
    const data = Object.values(dataMap).sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-[400px] flex items-center justify-center">
                <p className="text-slate-400">No hay datos en este periodo.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-blue-900/30">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Flujo de Caja (Tendencia)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" fontSize={12} tickMargin={10} minTickGap={30} />
                        <YAxis fontSize={12} tickFormatter={(val) => `RD$${val / 1000}k`} />
                        <Tooltip
                            formatter={(value: any) => formatCurrency(Number(value))}
                            contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                        />
                        <Legend />
                        <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
