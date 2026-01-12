"use client";

import { useState, useEffect } from "react";
import { X, Save, Calendar, Repeat, CreditCard, PiggyBank } from "lucide-react";
import { useFinancial } from "@/lib/context/financial-context";
import { Transaction } from "@/lib/types";

interface AddTransactionModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    editingTransaction?: Transaction | null;
}

export function AddTransactionModal({ isOpen: propIsOpen, onClose: propOnClose, editingTransaction }: AddTransactionModalProps) {
    const {
        isTransactionModalOpen,
        closeTransactionModal,
        addTransaction,
        updateTransaction,
        goals,
        budgetConfigs,
        addBudget,
        getAvailableToAssign
    } = useFinancial();

    const isVisible = propIsOpen !== undefined ? propIsOpen : isTransactionModalOpen;
    const handleClose = propOnClose || closeTransactionModal;

    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        budgetId: "otros-default", // Changed from category
        category: "", // Legacy
        date: new Date().toISOString().split('T')[0],
        type: "expense" as "income" | "expense" | "saving",
        account: "general",
        isRecurring: false,
        frequency: "monthly" as "daily" | "weekly" | "biweekly" | "monthly" | "yearly",
        subscriptionName: "",
        goalId: undefined as number | undefined
    });

    // State for creating new budget on-the-fly
    const [showNewBudgetPopover, setShowNewBudgetPopover] = useState(false);
    const [newBudgetName, setNewBudgetName] = useState('');
    const [newBudgetIcon, setNewBudgetIcon] = useState('📦');
    const [newBudgetLimit, setNewBudgetLimit] = useState(0);
    const [customCategoryInput, setCustomCategoryInput] = useState('');

    useEffect(() => {
        if (editingTransaction) {
            setFormData({
                amount: editingTransaction.amount.toString(),
                description: editingTransaction.description,
                budgetId: editingTransaction.budgetId || 'otros-default',
                category: editingTransaction.category || '',
                date: editingTransaction.date,
                type: editingTransaction.type,
                account: editingTransaction.account,
                isRecurring: editingTransaction.isRecurring || false,
                frequency: editingTransaction.frequency || "monthly",
                subscriptionName: editingTransaction.subscriptionName || "",
                goalId: editingTransaction.goalId
            });
        } else {
            if (isVisible) {
                setFormData({
                    amount: "",
                    description: "",
                    budgetId: "otros-default",
                    category: "",
                    date: new Date().toISOString().split('T')[0],
                    type: "expense",
                    account: "general",
                    isRecurring: false,
                    frequency: "monthly",
                    subscriptionName: "",
                    goalId: undefined
                });
            }
        }
    }, [editingTransaction, isVisible]);

    if (!isVisible) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION: For savings, Goal is mandatory
        if (formData.type === 'saving' && !formData.goalId) {
            // Simple alert for MVP, could be UI error state
            alert("Por favor selecciona una Meta de Ahorro para destinar el dinero.");
            return;
        }

        let nextPaymentDate = undefined;
        if (formData.isRecurring && formData.date) {
            const dateObj = new Date(formData.date + "T12:00:00");
            const nextDate = new Date(dateObj);

            switch (formData.frequency) {
                case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
                case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
                case 'biweekly': nextDate.setDate(nextDate.getDate() + 14); break;
                case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
                case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
                default: nextDate.setMonth(nextDate.getMonth() + 1);
            }
            nextPaymentDate = nextDate.toISOString();
        }

        // Auto-generate description for Savings if hidden
        let finalDescription = formData.description;
        if (formData.type === 'saving') {
            const selectedGoal = goals.find(g => g.id === formData.goalId);
            finalDescription = selectedGoal ? `Ahorro: ${selectedGoal.name}` : "Ahorro General";
        }

        const cleanData = {
            type: formData.type,
            amount: parseFloat(formData.amount),
            category: formData.type === 'saving' ? 'ahorros' : formData.category,
            date: new Date(formData.date + "T12:00:00").toISOString(),
            description: finalDescription,
            account: formData.account,
            isRecurring: formData.isRecurring,
            frequency: formData.isRecurring ? formData.frequency : undefined,
            nextPaymentDate: nextPaymentDate,
            // For saving, subscriptionName is not needed/hidden, so we can ignore it or set to simplified desc
            subscriptionName: formData.isRecurring ? (formData.type === 'saving' ? finalDescription : (formData.subscriptionName || formData.description)) : undefined,
            goalId: formData.type === 'saving' ? Number(formData.goalId) : undefined
        };

        if (editingTransaction) {
            updateTransaction(editingTransaction.id, cleanData);
        } else {
            addTransaction(cleanData);
        }
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">
                            {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Registra tus movimientos financieros</p>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Type Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.type === 'expense' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Gasto
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'income' })}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Ingreso
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'saving' })}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${formData.type === 'saving' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            <PiggyBank size={14} />
                            Ahorro
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="relative">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Monto (RD$)</label>
                        <input
                            type="number"
                            required
                            min="0.01"
                            step="any"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className={`w-full text-3xl font-bold p-2 bg-transparent border-b-2 outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-700 text-slate-900 dark:text-white ${formData.type === 'income' ? 'border-emerald-500/50 focus:border-emerald-500' :
                                formData.type === 'saving' ? 'border-blue-500/50 focus:border-blue-500' :
                                    'border-red-500/50 focus:border-red-500'
                                }`}
                            placeholder="0.00"
                        />
                    </div>

                    {/* Link to Goal (Only for Savings) */}
                    {formData.type === 'saving' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 mb-1">Destinar a Meta (Obligatorio)</label>
                            <select
                                required
                                value={formData.goalId || ""}
                                onChange={e => setFormData({ ...formData, goalId: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl outline-none text-sm font-medium text-slate-900 dark:text-white appearance-none"
                            >
                                <option value="">Selecciona una meta...</option>
                                {goals.map(goal => (
                                    <option key={goal.id} value={goal.id}>
                                        {goal.icon} {goal.name} (Faltan RD${(goal.target - goal.current).toLocaleString()})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Description - HIDDEN for Savings */}
                    {formData.type !== 'saving' && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Descripción</label>
                            <input
                                type="text"
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                            />
                        </div>
                    )}

                    {/* Category & Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {formData.type !== 'saving' && (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Categoría</label>
                                <div className="relative">
                                    <select
                                        value={formData.budgetId}
                                        onChange={e => {
                                            if (e.target.value === '__create_new__') {
                                                setShowNewBudgetPopover(true);
                                            } else {
                                                setFormData({ ...formData, budgetId: e.target.value });
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium text-slate-900 dark:text-white appearance-none"
                                    >
                                        {budgetConfigs.map(budget => (
                                            <option key={budget.id} value={budget.id}>
                                                {budget.icon} {budget.name}
                                            </option>
                                        ))}
                                        {getAvailableToAssign() > 0 && (
                                            <option value="__create_new__" className="text-blue-600">+ Crear Nueva Categoría</option>
                                        )}
                                    </select>
                                </div>

                                {/* New Budget Popover */}
                                {showNewBudgetPopover && (
                                    <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-64">
                                        <h4 className="font-bold text-sm mb-3 text-slate-800 dark:text-white">Nueva Categoría</h4>
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const emojis = ['🍔', '🚗', '🏠', '💡', '🎮', '💊', '📚', '✈️', '👕'];
                                                        setNewBudgetIcon(emojis[Math.floor(Math.random() * emojis.length)]);
                                                    }}
                                                    className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xl"
                                                >
                                                    {newBudgetIcon}
                                                </button>
                                                <input
                                                    type="text"
                                                    value={newBudgetName}
                                                    onChange={(e) => setNewBudgetName(e.target.value)}
                                                    placeholder="Nombre"
                                                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500">Límite Mensual (Máx: RD${getAvailableToAssign().toLocaleString()})</label>
                                                <input
                                                    type="number"
                                                    value={newBudgetLimit || ''}
                                                    onChange={(e) => setNewBudgetLimit(Math.min(parseFloat(e.target.value) || 0, getAvailableToAssign()))}
                                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm outline-none mt-1"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowNewBudgetPopover(false);
                                                        setNewBudgetName('');
                                                        setNewBudgetLimit(0);
                                                    }}
                                                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-medium"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (newBudgetName && newBudgetLimit > 0) {
                                                            const newId = Date.now().toString();
                                                            addBudget({
                                                                name: newBudgetName,
                                                                category: newBudgetName.toLowerCase().replace(/\s+/g, '_'),
                                                                icon: newBudgetIcon,
                                                                limit: newBudgetLimit,
                                                                alerts: [80, 100]
                                                            });
                                                            setFormData({ ...formData, budgetId: newId });
                                                            setShowNewBudgetPopover(false);
                                                            setNewBudgetName('');
                                                            setNewBudgetLimit(0);
                                                        }
                                                    }}
                                                    disabled={!newBudgetName || newBudgetLimit <= 0}
                                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
                                                >
                                                    Crear
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={formData.type === 'saving' ? "col-span-2" : ""}>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Fecha</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-medium text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recurrence Switch */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Repeat className={`h-5 w-5 ${formData.isRecurring ? 'text-indigo-500' : 'text-slate-400'}`} />
                                <label htmlFor="recurring-switch" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {formData.type === 'saving' ? '¿Ahorro programado?' : '¿Es recurrente?'}
                                </label>
                            </div>

                            <button
                                type="button"
                                id="recurring-switch"
                                onClick={() => setFormData({ ...formData, isRecurring: !formData.isRecurring })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 ${formData.isRecurring ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${formData.isRecurring ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        {formData.isRecurring && (
                            <div className="animate-in slide-in-from-top-2 duration-200 pt-2 border-t border-slate-200 dark:border-slate-700 mt-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Frecuencia</label>
                                    <select
                                        value={formData.frequency}
                                        onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                                    >
                                        <option value="weekly">Semanal</option>
                                        <option value="biweekly">Quincenal</option>
                                        <option value="monthly">Mensual</option>
                                        <option value="yearly">Anual</option>
                                    </select>
                                </div>
                                {/* Hide Subscription Name for Savings */}
                                {formData.type !== 'saving' && (
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre Servicio</label>
                                        <input
                                            type="text"
                                            placeholder="Ej. Netflix"
                                            value={formData.subscriptionName}
                                            onChange={e => setFormData({ ...formData, subscriptionName: e.target.value })}
                                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all flex justify-center items-center gap-2 shadow-lg shadow-slate-900/20 dark:shadow-indigo-900/40"
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
