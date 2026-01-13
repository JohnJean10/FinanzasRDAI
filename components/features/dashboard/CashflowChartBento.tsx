"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";

export function CashflowChartBento() {
    const { transactions } = useFinancial();

    // Generate last 7 days data
    const getLast7Days = () => {
        const days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const dayName = date.toLocaleDateString("es-DO", { weekday: "short" })
                .charAt(0).toUpperCase() + date.toLocaleDateString("es-DO", { weekday: "short" }).slice(1, 3);

            days.push({
                name: dayName,
                date: date.toISOString().split("T")[0],
                income: 0,
                expense: 0,
            });
        }
        return days;
    };

    const dayBuckets = getLast7Days();

    // Fill buckets with transaction data
    transactions.forEach(t => {
        const tDate = t.date.split("T")[0];
        const bucket = dayBuckets.find(b => b.date === tDate);
        if (bucket) {
            if (t.type === "income") bucket.income += t.amount;
            if (t.type === "expense") bucket.expense += t.amount;
        }
    });

    const data = dayBuckets.map(b => ({
        name: b.name,
        income: b.income,
        expense: b.expense,
    }));

    // Calculate totals for header
    const totalBalance = transactions.reduce((acc, t) => {
        if (t.type === "income") return acc + t.amount;
        if (t.type === "expense") return acc - t.amount;
        return acc;
    }, 0);

    return (
        <div className="bg-white dark:bg-[#1E2030] rounded-bento p-6 shadow-bento dark:shadow-bento-dark">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Cashflow</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(Math.abs(totalBalance))}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Total Balance</p>
                </div>
                <select className="bg-slate-50 dark:bg-slate-800 border-0 text-sm rounded-xl px-3 py-2 text-slate-600 dark:text-slate-300 outline-none cursor-pointer">
                    <option>This Year</option>
                    <option>This Month</option>
                    <option>Last 7 Days</option>
                </select>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Expense</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={8}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "currentColor", fontSize: 12 }}
                            className="text-slate-400"
                            dy={10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--background)",
                                borderColor: "var(--border)",
                                borderRadius: "16px",
                                boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
                            }}
                            formatter={(value) => value !== undefined ? formatCurrency(value as number) : ""}
                            cursor={{ fill: "transparent" }}
                        />
                        <Bar
                            dataKey="income"
                            fill="#10b981"
                            radius={[8, 8, 8, 8]}
                            maxBarSize={32}
                            name="Ingresos"
                        />
                        <Bar
                            dataKey="expense"
                            fill="#f87171"
                            radius={[8, 8, 8, 8]}
                            maxBarSize={32}
                            name="Gastos"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
