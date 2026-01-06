"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { Plus, Target } from "lucide-react";

export function GoalsContainer() {
    const { goals } = useFinancial();

    // Filter out Emergency Goal as it's shown separately
    const otherGoals = goals.filter(g => !g.name.toLowerCase().includes('emergencia'));

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Target className="text-purple-500" size={20} /> Metas de Ahorro
                </h3>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-1">
                    <Plus size={16} /> Nueva Meta
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {otherGoals.map(goal => {
                    const percent = Math.min((goal.current / goal.target) * 100, 100);
                    return (
                        <div key={goal.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{goal.icon}</span>
                                    <div>
                                        <h4 className="font-medium text-slate-800 dark:text-white">{goal.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Fecha Límite: {new Date(goal.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(goal.current)}</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">{percent.toFixed(0)}% completado</span>
                                    <span className="text-slate-400 dark:text-slate-500">Meta: {formatCurrency(goal.target)}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full transition-all"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {otherGoals.length === 0 && (
                    <div className="text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No tienes metas activas.</p>
                        <button className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium">Crear tu primera meta</button>
                    </div>
                )}
            </div>
        </div>
    );
}
