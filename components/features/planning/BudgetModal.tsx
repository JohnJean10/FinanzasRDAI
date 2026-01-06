"use client";

import { useState, useEffect } from "react";
import { X, Save, PieChart, Plus, Lock } from "lucide-react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";

interface BudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BudgetModal({ isOpen, onClose }: BudgetModalProps) {
    const { budgetConfigs, updateBudget, user, goals } = useFinancial(); // destructure goals
    const { formatCurrency } = require("@/lib/utils");

    // Calculate Committed Savings from Goals
    const committedSavings = parseFloat(Math.ceil(goals
        .filter(g => g.isLinkedToBudget && g.current < g.target)
        .reduce((sum, g) => sum + (g.monthlyContribution || 0), 0)).toFixed(2));
    const categories = [
        "alimentacion", "transporte", "vivienda", "entretenimiento", "salud", "educacion", "ahorros", "otros"
    ];

    const [limits, setLimits] = useState<{ [key: string]: number }>(() => {
        const initialLocals: { [key: string]: number } = {};
        budgetConfigs.forEach(b => {
            initialLocals[b.category] = b.limit;
        });
        return initialLocals;
    });

    // Ensure 'ahorros' is at least the committed savings
    useEffect(() => {
        if (committedSavings > 0) {
            setLimits(prev => {
                const current = prev['ahorros'] || 0;
                if (current < committedSavings) {
                    return { ...prev, ahorros: committedSavings };
                }
                return prev;
            });
        }
    }, [committedSavings]);

    if (!isOpen) return null;

    const totalAssigned = Object.values(limits).reduce((a, b) => a + b, 0);
    const unassigned = (user.monthlyIncome || 0) - totalAssigned;

    const handleLimitChange = (category: string, value: string) => {
        setLimits(prev => ({
            ...prev,
            [category]: parseFloat(value) || 0
        }));
    };

    const handleSave = () => {
        Object.entries(limits).forEach(([category, limit]) => {
            if (limit > 0) {
                updateBudget(category, limit);
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <PieChart className="text-indigo-500" size={20} /> Asignación de Ingresos
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body with scroll */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Income Summary */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-indigo-800 dark:text-indigo-200 font-medium">Ingreso Disponible</span>
                            <span className="font-bold text-indigo-900 dark:text-white">{formatCurrency(user.monthlyIncome || 0)}</span>
                        </div>

                        {committedSavings > 0 && (
                            <div className="flex justify-between items-center text-xs mb-1 text-purple-600 dark:text-purple-400">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
                                    Metas Comprometidas
                                </span>
                                <span>- {formatCurrency(committedSavings)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-xs pt-2 border-t border-indigo-200 dark:border-indigo-800">
                            <span className="text-indigo-600/70 dark:text-indigo-400">Sin Asignar</span>
                            <span className={`font-bold ${unassigned >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {formatCurrency(unassigned)}
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Distribuye tu ingreso mensual entre las siguientes categorías. Asegúrate de cubrir tus necesidades básicas primero.
                        </p>

                        <div className="space-y-4">
                            {categories.map(cat => {
                                const isLocked = cat === 'ahorros' && committedSavings > 0;
                                const minValue = isLocked ? committedSavings : 0;

                                return (
                                    <div key={cat} className="flex items-center gap-4">
                                        <div className="w-1/3">
                                            <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                                {cat.replace('_', ' ')}
                                                {isLocked && <Lock size={12} className="text-purple-500" />}
                                            </span>
                                        </div>
                                        <div className="flex-1 relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">RD$</span>
                                            <input
                                                type="number"
                                                min={minValue}
                                                value={limits[cat] || ""}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value) || 0;
                                                    // Prevent going below committed savings for ahorros
                                                    if (cat === 'ahorros' && val < committedSavings) {
                                                        return; // Or set to committedSavings
                                                    }
                                                    handleLimitChange(cat, e.target.value);
                                                }}
                                                placeholder="0.00"
                                                className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg outline-none focus:ring-2 text-slate-900 dark:text-white transition-all text-sm ${isLocked
                                                    ? 'border-purple-200 dark:border-purple-900/50 focus:ring-purple-500/20 focus:border-purple-500'
                                                    : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
                                                    }`}
                                            />
                                            {isLocked && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-purple-500 font-medium">
                                                    Mín: {formatCurrency(committedSavings)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors flex justify-center items-center gap-2"
                    >
                        <Save size={18} />
                        Guardar Distribución
                    </button>
                </div>
            </div>
        </div>
    );
}
