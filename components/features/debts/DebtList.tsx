"use client";

import { Debt } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, AlertCircle } from "lucide-react";

export function DebtList({ debts }: { debts: Debt[] }) {
    if (debts.length === 0) {
        return (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard size={24} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">¡Libre de Deudas!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">No tienes deudas registradas activo. ¡Felicidades!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {debts.map((debt) => (
                <div key={debt.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">{debt.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Tasa Anual: {debt.interestRate}%</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-bold text-xl text-slate-900 dark:text-white">{formatCurrency(debt.currentBalance)}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Mínimo: {formatCurrency(debt.minPayment)}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                            <span>Progreso de Pago</span>
                            <span>{Math.max(0, 100 - (debt.currentBalance / 50000) * 100).toFixed(0)}% (Estimado)</span> {/* Mock max for proto */}
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            {/* Mock progress visualization */}
                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: '20%' }}
                            ></div>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg transition-colors">
                            Ver Detalles
                        </button>
                        <button className="flex-1 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-lg transition-colors">
                            Registrar Pago
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
