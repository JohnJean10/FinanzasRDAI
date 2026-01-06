"use client";

import { useState } from "react";
import { X, Save, PieChart, Plus } from "lucide-react";
import { useFinancial } from "@/lib/context/financial-context";

interface BudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BudgetModal({ isOpen, onClose }: BudgetModalProps) {
    const { budgetConfigs, updateBudget } = useFinancial();

    // We'll map over common categories
    const categories = [
        "alimentacion", "transporte", "vivienda", "entretenimiento", "salud", "educacion", "otros"
    ];

    const [limits, setLimits] = useState<{ [key: string]: number }>(() => {
        const initialLocals: { [key: string]: number } = {};
        budgetConfigs.forEach(b => {
            initialLocals[b.category] = b.limit;
        });
        return initialLocals;
    });

    if (!isOpen) return null;

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
                        <PieChart className="text-indigo-500" size={20} /> Presupuestos Mensuales
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body with scroll */}
                <div className="p-6 overflow-y-auto space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Define el límite máximo que deseas gastar mensualmente por categoría.
                    </p>

                    <div className="space-y-4">
                        {categories.map(cat => (
                            <div key={cat} className="flex items-center gap-4">
                                <div className="w-1/3">
                                    <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
                                        {cat.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">RD$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={limits[cat] || ""}
                                        onChange={(e) => handleLimitChange(cat, e.target.value)}
                                        placeholder="Sin límite"
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white transition-all text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors flex justify-center items-center gap-2"
                    >
                        <Save size={18} />
                        Guardar Presupuestos
                    </button>
                </div>
            </div>
        </div>
    );
}
