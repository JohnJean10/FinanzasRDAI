"use client";



import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { PieChart, AlertCircle } from "lucide-react";
import { BudgetModal } from "./BudgetModal";

export function BudgetContainer() {
    const { budgetConfigs, transactions, user, goals } = useFinancial();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate distinct categories actually used
    const categories = budgetConfigs;

    // Calculate Committed Savings from Goals
    const committedSavings = goals
        .filter(g => g.isLinkedToBudget && g.current < g.target)
        .reduce((sum, g) => sum + (g.monthlyContribution || 0), 0);

    const totalAssigned = categories.reduce((sum, b) => sum + b.limit, 0);
    const totalExpensesAndSavings = totalAssigned + committedSavings;
    const remainingIncome = (user.monthlyIncome || 0) - totalExpensesAndSavings;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <PieChart className="text-indigo-500" size={20} /> Distribución de Ingresos
                </h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                    Asignar Fondos
                </button>
            </div>

            {/* Summary Section */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Ingreso Mensual (Est.)</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(user.monthlyIncome || 0)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Sin Asignar</p>
                        <p className={`text-xl font-bold ${remainingIncome >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {formatCurrency(remainingIncome)}
                        </p>
                    </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-2">
                    {/* Budgeted Expenses */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Gastos Presupuestados</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{formatCurrency(totalAssigned)}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-indigo-500 h-full rounded-full transition-all"
                                style={{ width: `${Math.min((totalAssigned / (user.monthlyIncome || 1)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Committed Savings */}
                    {committedSavings > 0 && (
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                                    Ahorros Comprometidos (Metas)
                                </span>
                                <span className="text-purple-600 dark:text-purple-400 font-medium">{formatCurrency(committedSavings)}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-purple-500 h-full rounded-full transition-all"
                                    style={{ width: `${Math.min((committedSavings / (user.monthlyIncome || 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                    <span>Total Comprometido: {formatCurrency(totalExpensesAndSavings)}</span>
                    <span>{Math.round((totalExpensesAndSavings / (user.monthlyIncome || 1)) * 100)}% del Ingreso</span>
                </div>

                {remainingIncome < 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <p><strong>¡Presupuesto Insostenible!</strong> Tus gastos más tus metas de ahorro superan tus ingresos. Ajusta tus presupuestos o extiende el plazo de tus metas.</p>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {categories.map((budget, idx) => {
                    const spent = transactions
                        .filter(t =>
                            t.category === budget.category &&
                            t.type === 'expense' &&
                            new Date(t.date).getMonth() === new Date().getMonth()
                        )
                        .reduce((acc, t) => acc + t.amount, 0);

                    const percent = Math.min((spent / budget.limit) * 100, 100);
                    const isOver = spent > budget.limit;

                    return (
                        <div key={idx} className="bg-white dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-blue-900/30">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm capitalize text-slate-700 dark:text-slate-200">
                                    {budget.category.replace('_', ' ')}
                                </span>
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
                                    Asignado: {formatCurrency(budget.limit)}
                                </span>
                            </div>

                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Gastado</span>
                                <span className={isOver ? 'text-red-500 font-bold' : ''}>{formatCurrency(spent)}</span>
                            </div>

                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}

                {categories.length === 0 && (
                    <div className="p-4 text-center text-slate-400 dark:text-slate-500 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        Aún no has asignado tus ingresos. <br />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-1 text-indigo-500 hover:text-indigo-600 font-medium"
                        >
                            Distribuir Ingresos
                        </button>
                    </div>
                )}
            </div>

            <BudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
