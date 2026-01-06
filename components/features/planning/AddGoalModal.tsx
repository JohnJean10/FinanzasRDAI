"use client";

import { useState, useEffect } from "react";
import { X, Save, Target } from "lucide-react";
import { useFinancial } from "@/lib/context/financial-context";

import { Goal } from "@/lib/types";

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingGoal?: Goal | null;
}

export function AddGoalModal({ isOpen, onClose, editingGoal }: AddGoalModalProps) {
    const { addGoal, updateGoal } = useFinancial();

    const [formData, setFormData] = useState({
        name: "",
        target: "",
        deadline: "",
        icon: "💰",
        current: "0",
        isLinkedToBudget: true,
        monthlyContribution: 0
    });

    useEffect(() => {
        if (editingGoal) {
            setFormData({
                name: editingGoal.name,
                target: editingGoal.target.toString(),
                deadline: editingGoal.deadline,
                icon: editingGoal.icon,
                current: editingGoal.current.toString(),
                isLinkedToBudget: editingGoal.isLinkedToBudget !== false, // Default to true if undefined
                monthlyContribution: editingGoal.monthlyContribution || 0
            });
        } else {
            // Reset defaults when opening new
            if (isOpen) {
                setFormData({
                    name: "",
                    target: "",
                    deadline: "",
                    icon: "💰",
                    current: "0",
                    isLinkedToBudget: true,
                    monthlyContribution: 0
                });
            }
        }
    }, [editingGoal, isOpen]);

    // Calculate Monthly Contribution
    const calculateMonthlyEffort = () => {
        if (!formData.target || !formData.deadline) return 0;
        const target = parseFloat(formData.target) || 0;
        const current = parseFloat(formData.current) || 0;
        const remaining = target - current;
        if (remaining <= 0) return 0;

        const start = new Date();
        const end = new Date(formData.deadline);

        // Calculate months difference roughly
        const years = end.getFullYear() - start.getFullYear();
        const months = (years * 12) + (end.getMonth() - start.getMonth());

        // If less than 1 month, default to 1 to avoid division by zero or negative
        const validMonths = Math.max(months, 1);

        return remaining / validMonths;
    };

    const monthlyEffort = calculateMonthlyEffort();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const goalData = {
            name: formData.name,
            target: parseFloat(formData.target),
            current: parseFloat(formData.current),
            deadline: formData.deadline,
            icon: formData.icon,
            monthlyContribution: formData.monthlyContribution > 0 ? formData.monthlyContribution : Math.ceil(monthlyEffort),
            isLinkedToBudget: formData.isLinkedToBudget
        };

        if (editingGoal) {
            updateGoal(editingGoal.id, goalData);
        } else {
            addGoal(goalData);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <Target className="text-purple-500" size={20} /> {editingGoal ? 'Editar Meta' : 'Nueva Meta'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Nombre de la Meta {editingGoal?.isNative && <span className="text-xs text-blue-500">(Automático)</span>}
                        </label>
                        <input
                            type="text"
                            required
                            disabled={editingGoal?.isNative}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 dark:text-white ${editingGoal?.isNative ? 'opacity-70 cursor-not-allowed' : ''}`}
                            placeholder="Ej. Viaje a Punta Cana"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Meta (RD$) {editingGoal?.isNative && <span className="text-xs text-blue-500">(Auto)</span>}
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                disabled={editingGoal?.isNative}
                                value={formData.target}
                                onChange={e => setFormData({ ...formData, target: e.target.value })}
                                className={`w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 dark:text-white ${editingGoal?.isNative ? 'opacity-70 cursor-not-allowed' : ''}`}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Ahorrado (RD$)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.current}
                                onChange={e => setFormData({ ...formData, current: e.target.value })}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 dark:text-white"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Fecha Límite</label>
                        <input
                            type="date"
                            required
                            value={formData.deadline}
                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Icono</label>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {['💰', '🏖️', '🚗', '🏠', '💻', '🎓', '💍', '🚑'].map(emoji => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: emoji })}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${formData.icon === emoji
                                        ? 'bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-500 scale-110'
                                        : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calculated Effort & Link */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-indigo-700 dark:text-indigo-300">Esfuerzo Mensual Sugerido:</span>
                            <span className="font-bold text-indigo-900 dark:text-white">
                                {monthlyEffort > 0 ? `RD$ ${monthlyEffort.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                            </span>
                        </div>

                        {/* Manual Contribution Override for Native Goals or Power Users */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Mi Aporte Mensual Real (RD$)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.monthlyContribution || ''}
                                onChange={e => setFormData({ ...formData, monthlyContribution: parseInt(e.target.value) || 0 })}
                                placeholder={Math.ceil(monthlyEffort).toString()}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                {editingGoal?.isNative
                                    ? "Define cuánto quieres aportar mensualmente a tu fondo de emergencia."
                                    : "Puedes ajustar este valor si deseas aportar más o menos de lo sugerido."}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-800/50">
                            <input
                                type="checkbox"
                                id="linkBudget"
                                checked={formData.isLinkedToBudget}
                                onChange={e => setFormData({ ...formData, isLinkedToBudget: e.target.checked })}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="linkBudget" className="text-xs text-indigo-800 dark:text-indigo-200 cursor-pointer select-none">
                                Reservar esto en mi presupuesto mensual
                            </label>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-3 bg-slate-900 dark:bg-purple-600 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-purple-500 transition-colors flex justify-center items-center gap-2"
                        >
                            <Save size={18} />
                            {editingGoal ? 'Guardar Cambios' : 'Guardar Meta'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
