"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { useFinancial } from "@/lib/context/financial-context";
import { Transaction } from "@/lib/types";

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingTransaction?: Transaction | null;
}

export function AddTransactionModal({ isOpen, onClose, editingTransaction }: AddTransactionModalProps) {
    const { addTransaction, updateTransaction } = useFinancial();

    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        category: "alimentacion",
        date: new Date().toISOString().split('T')[0],
        type: "expense" as "income" | "expense",
        account: "general"
    });

    useEffect(() => {
        if (editingTransaction) {
            setFormData({
                amount: editingTransaction.amount.toString(),
                description: editingTransaction.description,
                category: editingTransaction.category,
                date: editingTransaction.date,
                type: editingTransaction.type,
                account: editingTransaction.account
            });
        } else {
            // Reset defaults
            setFormData({
                amount: "",
                description: "",
                category: "alimentacion",
                date: new Date().toISOString().split('T')[0],
                type: "expense",
                account: "general"
            });
        }
    }, [editingTransaction, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountVal = parseFloat(formData.amount);

        if (editingTransaction) {
            updateTransaction(editingTransaction.id, {
                ...formData,
                amount: amountVal
            });
        } else {
            addTransaction({
                ...formData,
                amount: amountVal
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                        {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Type Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${formData.type === 'expense' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Gasto
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'income' })}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${formData.type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Ingreso
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Monto (RD$)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="any"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full text-2xl font-bold p-2 bg-transparent border-b-2 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Descripción</label>
                        <input
                            type="text"
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                            placeholder="Ej. Supermercado"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm text-slate-900 dark:text-white"
                            >
                                <option value="alimentacion">🛒 Alimentación</option>
                                <option value="transporte">🚗 Transporte</option>
                                <option value="vivienda">🏠 Vivienda</option>
                                <option value="entretenimiento">🎬 Entretenimiento</option>
                                <option value="ingreso_sueldo">💰 Nómina</option>
                                <option value="otros">📦 Otros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Fecha</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors flex justify-center items-center gap-2"
                        >
                            <Save size={18} />
                            {editingTransaction ? 'Guardar Cambios' : 'Registrar Transacción'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
