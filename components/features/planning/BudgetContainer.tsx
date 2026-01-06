"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { PieChart, AlertCircle } from "lucide-react";

export function BudgetContainer() {
    const { budgetConfigs, transactions } = useFinancial();

    // Calculate distinct categories actually used
    const categories = budgetConfigs;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <PieChart className="text-indigo-500" size={20} /> Presupuestos Mensuales
                </h3>
                <button className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Editar Límites</button>
            </div>

            <div className="space-y-3">
                {categories.map((budget, idx) => {
                    // Calculate Spending for this category in current month
                    const spent = transactions
                        .filter(t =>
                            t.category === budget.category &&
                            t.type === 'expense' &&
                            new Date(t.date).getMonth() === new Date().getMonth()
                        )
                        .reduce((acc, t) => acc + t.amount, 0);

                    const percent = Math.min((spent / budget.limit) * 100, 100);

                    let color = "bg-emerald-500";
                    if (percent > 80) color = "bg-yellow-500";
                    if (percent >= 100) color = "bg-red-500";

                    return (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-sm capitalize text-slate-700 dark:text-slate-200">
                                    {budget.category.replace('_', ' ')}
                                </span>
                                <span className={`text-sm font-bold ${percent >= 100 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-white'}`}>
                                    {formatCurrency(spent)} <span className="text-slate-400 dark:text-slate-500 font-normal">/ {formatCurrency(budget.limit)}</span>
                                </span>
                            </div>

                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${color}`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>

                            {percent >= 100 && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                    <AlertCircle size={12} /> Excedido por {formatCurrency(spent - budget.limit)}
                                </div>
                            )}
                        </div>
                    );
                })}

                {categories.length === 0 && (
                    <div className="p-4 text-center text-slate-400 dark:text-slate-500 text-sm">
                        No has configurado presupuestos.
                    </div>
                )}
            </div>
        </div>
    );
}
