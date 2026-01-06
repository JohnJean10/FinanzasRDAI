"use client";

import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { Plus, Target, ArrowUpCircle, Edit2, Shield } from "lucide-react";
import { AddGoalModal } from "./AddGoalModal";
import { DepositModal } from "./DepositModal";
import { Goal } from "@/lib/types";

export function GoalsContainer() {
    const { goals } = useFinancial();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [isDepositOpen, setIsDepositOpen] = useState(false);



    const handleDeposit = (goal: Goal) => {
        setSelectedGoal(goal);
        setIsDepositOpen(true);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Target className="text-purple-500" size={20} /> Metas de Ahorro
                </h3>
                <button
                    onClick={() => {
                        setSelectedGoal(null);
                        setIsModalOpen(true);
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                    <Plus size={16} /> Nueva Meta
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Sort: Native first, then by deadline */}
                {[...goals].sort((a, b) => (a.isNative === b.isNative ? 0 : a.isNative ? -1 : 1)).map(goal => {
                    const percent = Math.min((goal.current / goal.target) * 100, 100);
                    const isNative = goal.isNative;

                    return (
                        <div key={goal.id} className={`p-6 rounded-xl shadow-sm border transition-all relative group ${isNative
                            ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                            : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-blue-900/30 hover:shadow-md'
                            }`}>
                            {/* Edit Button - Always visible now */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGoal(goal);
                                    setIsModalOpen(true);
                                }}
                                className={`absolute top-4 right-4 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity ${isNative ? 'z-10' : ''}`}
                            >
                                <Edit2 size={16} />
                            </button>
                            {isNative && (
                                <div className="absolute top-4 right-4 text-blue-400 opacity-50" title="Gestionado automáticamente">
                                    <Shield size={16} />
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{goal.icon}</span>
                                    <div>
                                        <h4 className="font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                            {goal.name}
                                            {isNative && <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 rounded-full">Automático</span>}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Fecha Límite: {new Date(goal.deadline).toLocaleDateString()}</p>

                                        {/* Display Monthly Contribution if available */}
                                        {goal.monthlyContribution && goal.monthlyContribution > 0 && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/50">
                                                    Aporte Mensual: {formatCurrency(goal.monthlyContribution)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="font-bold text-slate-800 dark:text-white block">{formatCurrency(goal.current)}</span>
                                    <button
                                        onClick={() => handleDeposit(goal)}
                                        className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center justify-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ArrowUpCircle size={12} /> Aportar
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">{percent.toFixed(0)}% completado</span>
                                    <span className="text-slate-400 dark:text-slate-500">Meta: {formatCurrency(goal.target)}</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${isNative ? 'bg-blue-500' : 'bg-purple-500'}`}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {goals.length === 0 && (
                    <div className="text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No tienes metas activas.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium"
                        >
                            Crear tu primera meta
                        </button>
                    </div>
                )}
            </div>

            <AddGoalModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedGoal(null); // Reset selection on close
                }}
                editingGoal={selectedGoal}
            />
            <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} goal={selectedGoal} />
        </div>
    );
}
