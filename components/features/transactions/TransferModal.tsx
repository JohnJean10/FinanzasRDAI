"use client";

import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { X, ArrowRight, ArrowLeftRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
    const { accounts, addTransaction } = useFinancial();
    const { t } = useI18n();

    const [fromAccountId, setFromAccountId] = useState("");
    const [toAccountId, setToAccountId] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter accounts for selection
    const availableAccounts = (accounts || []).filter(a => a.type !== "credit" || a.balance > 0);

    const fromAccount = availableAccounts.find(a => a.id === fromAccountId);
    const toAccount = availableAccounts.find(a => a.id === toAccountId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fromAccountId || !toAccountId || !amount || fromAccountId === toAccountId) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create transfer transaction
            addTransaction({
                type: "transfer",
                amount: parseFloat(amount),
                description: description || `Transferencia ${fromAccount?.name} → ${toAccount?.name}`,
                date: new Date().toISOString(),
                category: "Transferencia",
                accountId: toAccountId,
                fromAccountId: fromAccountId,
            });

            // Reset and close
            setFromAccountId("");
            setToAccountId("");
            setAmount("");
            setDescription("");
            onClose();
        } catch (error) {
            console.error("Error en transferencia:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const swapAccounts = () => {
        const temp = fromAccountId;
        setFromAccountId(toAccountId);
        setToAccountId(temp);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1a1f2e] rounded-3xl p-6 w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <ArrowLeftRight className="text-emerald-600" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Transferir Fondos
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* From Account */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Desde
                        </label>
                        <select
                            value={fromAccountId}
                            onChange={(e) => setFromAccountId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        >
                            <option value="">Seleccionar cuenta origen</option>
                            {availableAccounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.icon} {account.name} ({formatCurrency(account.balance)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={swapAccounts}
                            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full transition-colors"
                        >
                            <ArrowRight size={20} className="text-slate-500 rotate-90" />
                        </button>
                    </div>

                    {/* To Account */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Hacia
                        </label>
                        <select
                            value={toAccountId}
                            onChange={(e) => setToAccountId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        >
                            <option value="">Seleccionar cuenta destino</option>
                            {availableAccounts
                                .filter(a => a.id !== fromAccountId)
                                .map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.icon} {account.name} ({formatCurrency(account.balance)})
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Monto
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                RD$
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                                max={fromAccount?.balance || 999999999}
                                className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 text-lg font-semibold"
                                required
                            />
                        </div>
                        {fromAccount && (
                            <p className="mt-1 text-xs text-slate-400">
                                Disponible: {formatCurrency(fromAccount.balance)}
                            </p>
                        )}
                    </div>

                    {/* Description (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Descripción (opcional)
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Pago de tarjeta, Ahorro mensual..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !fromAccountId || !toAccountId || !amount}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            "Procesando..."
                        ) : (
                            <>
                                <ArrowLeftRight size={18} />
                                Transferir
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
