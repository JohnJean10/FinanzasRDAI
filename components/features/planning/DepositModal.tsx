"use client";

import { useState } from "react";
import { X, Save, Wallet } from "lucide-react";
import { useFinancial } from "@/lib/context/financial-context";
import { Goal } from "@/lib/types";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: Goal | null;
}

export function DepositModal({ isOpen, onClose, goal }: DepositModalProps) {
    const { updateGoal, addTransaction } = useFinancial();
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"deposit" | "withdraw">("deposit");

    if (!isOpen || !goal) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(amount);
        if (!value || value <= 0) return;

        const newCurrent = type === "deposit"
            ? goal.current + value
            : Math.max(0, goal.current - value);

        // 1. Update Goal Amount
        updateGoal(goal.id, { current: newCurrent });

        // 2. Record as Transaction (Optional, but good for tracking)
        addTransaction({
            amount: value,
            description: `${type === 'deposit' ? 'Aporte a' : 'Retiro de'} ${goal.name}`,
            category: 'otros', // Could be 'savings' if we added that category
            date: new Date().toISOString().split('T')[0],
            type: type === 'deposit' ? 'expense' : 'income', // Deposit into savings is an 'expense' from checking, withdrawal is 'income' back to checking
            account: 'general'
        });

        onClose();
        setAmount("");
        setType("deposit");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">{goal.icon}</span>
                        {type === 'deposit' ? 'Aportar a' : 'Retirar de'} {goal.name}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Toggle Type */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setType('deposit')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'deposit' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Aportar (+)
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('withdraw')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'withdraw' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Retirar (-)
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Monto (RD$)</label>
                        <div className="relative">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="number"
                                required
                                min="1"
                                step="any"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2 ${type === 'deposit'
                                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
                                : 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20'
                            }`}
                    >
                        <Save size={18} />
                        Confirmar
                    </button>
                </form>
            </div>
        </div>
    );
}
