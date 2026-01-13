"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend, Cell } from "recharts";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";

export function CashflowChartFynix() {
    const { transactions } = useFinancial();

    // Generate last 7 days data
    const getLast7Days = () => {
        const days = [];
        const today = new Date();
        const dayNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayIndex = date.getDay();

            days.push({
                name: dayNames[dayIndex === 0 ? 6 : dayIndex - 1],
                date: date.toISOString().split("T")[0],
                income: 0,
                expense: 0,
            });
        }
        return days;
    };

    const dayBuckets = getLast7Days();

    transactions.forEach(t => {
        const tDate = t.date.split("T")[0];
        const bucket = dayBuckets.find(b => b.date === tDate);
        if (bucket) {
            if (t.type === "income") bucket.income += t.amount;
            if (t.type === "expense") bucket.expense += t.amount;
        }
    });

    // Calculate total
    const totalBalance = transactions.reduce((acc, t) => {
        if (t.type === "income") return acc + t.amount;
        if (t.type === "expense") return acc - t.amount;
        return acc;
    }, 0);

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Cashflow</p>
                    <p className="text-xs text-slate-400">Total Balance</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(Math.abs(totalBalance))}
                    </h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Expense</span>
                        </div>
                    </div>
                    <select className="bg-slate-50 dark:bg-slate-800 border-0 text-sm rounded-xl px-4 py-2 text-slate-600 dark:text-slate-300 outline-none cursor-pointer font-medium">
                        <option>This Year</option>
                        <option>This Month</option>
                    </select>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dayBuckets} barGap={4} barCategoryGap="20%">
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "none",
                                borderRadius: "16px",
                                boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
                                padding: "12px 16px"
                            }}
                            formatter={(value) => value !== undefined ? formatCurrency(value as number) : ""}
                            cursor={{ fill: "transparent" }}
                        />
                        <Bar
                            dataKey="income"
                            fill="#22c55e"
                            radius={[6, 6, 6, 6]}
                            maxBarSize={24}
                            name="Ingresos"
                        />
                        <Bar
                            dataKey="expense"
                            fill="#f87171"
                            radius={[6, 6, 6, 6]}
                            maxBarSize={24}
                            name="Gastos"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
