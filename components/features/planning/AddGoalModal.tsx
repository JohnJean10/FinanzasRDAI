"use client";

import { useState } from "react";
import { X, Save, Target } from "lucide-react";
import { useFinancial } from "@/lib/context/financial-context";

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddGoalModal({ isOpen, onClose }: AddGoalModalProps) {
    const { addGoal } = useFinancial();

    const [formData, setFormData] = useState({
        name: "",
        target: "",
        deadline: "",
        icon: "💰",
        current: "0"
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addGoal({
            name: formData.name,
            target: parseFloat(formData.target),
            current: parseFloat(formData.current),
            deadline: formData.deadline,
            icon: formData.icon
        });
        setFormData({ name: "", target: "", deadline: "", icon: "💰", current: "0" });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <Target className="text-purple-500" size={20} /> Nueva Meta
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre de la Meta</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 dark:text-white"
                            placeholder="Ej. Viaje a Punta Cana"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Meta (RD$)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.target}
                                onChange={e => setFormData({ ...formData, target: e.target.value })}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 dark:text-white"
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

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-3 bg-slate-900 dark:bg-purple-600 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-purple-500 transition-colors flex justify-center items-center gap-2"
                        >
                            <Save size={18} />
                            Guardar Meta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
