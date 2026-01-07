
"use client";

import { detectRecurringTransactions, formatCurrency } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import { RefreshCcw } from "lucide-react";

interface RecurringExpensesProps {
    transactions: Transaction[];
}

export function RecurringExpenses({ transactions }: RecurringExpensesProps) {
    const patterns = detectRecurringTransactions(transactions);

    if (patterns.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                    <RefreshCcw className="text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Sin Suscripciones</h3>
                <p className="text-slate-400 text-sm">No detectamos pagos recurrentes (como Netflix o Gimnasio) en este periodo.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-blue-900/30">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <RefreshCcw size={18} className="text-purple-500" />
                Suscripciones y Recurrentes
            </h3>
            <div className="space-y-4">
                {patterns.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                <span className="text-xs font-bold">{p.description.charAt(0)}</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white text-sm">{p.description}</p>
                                <p className="text-xs text-slate-500 capitalize">{p.frequency}</p>
                            </div>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(p.amount)}</span>
                    </div>
                ))}
            </div>
            <p className="text-slate-400 text-xs mt-4 italic">
                *Detectado automáticamente basado en historial.
            </p>
        </div>
    );
}
