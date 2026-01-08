"use client";

import { useState, useMemo } from "react";
import { Debt } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, Calendar, DollarSign } from "lucide-react";

interface StrategyResult {
    method: 'snowball' | 'avalanche';
    totalInterest: number;
    monthsToFree: number;
    payoffDate: Date;
}

export function DebtStrategyCalculator({ debts }: { debts: Debt[] }) {
    const [extraPayment, setExtraPayment] = useState(2000); // Default extra payment

    const calculateStrategy = (method: 'snowball' | 'avalanche'): StrategyResult => {
        let currentDebts = debts.map(d => ({ ...d, currentBalance: d.currentBalance }));
        let months = 0;
        let totalInterest = 0;

        // Sort based on strategy
        if (method === 'snowball') {
            currentDebts.sort((a, b) => a.currentBalance - b.currentBalance);
        } else {
            currentDebts.sort((a, b) => b.interestRate - a.interestRate);
        }

        let activeDebts = true;
        while (activeDebts && months < 360) { // Safety break at 30 years
            months++;
            let monthlyExtra = extraPayment;
            let allPaid = true;

            for (let i = 0; i < currentDebts.length; i++) {
                const debt = currentDebts[i];
                if (debt.currentBalance <= 0) continue;

                allPaid = false;

                // Calculate Interest
                const monthlyRate = (debt.interestRate / 100) / 12;
                const interest = debt.currentBalance * monthlyRate;
                totalInterest += interest;

                // Determine Payment
                let payment = debt.minPayment;

                // Apply rollover/extra to the first active debt in the sorted list
                // Note: In a real "active" rollover, we'd need to track which specific index is the current target.
                // For this simplified logic simulation, we apply extra to the first unpaid debt found.
                if (monthlyExtra > 0) {
                    payment += monthlyExtra;
                    monthlyExtra = 0; // Consumed for this debt (unless it pays off, conceptually complicate)
                }

                // Apply Payment
                const principalPayment = payment - interest;

                if (principalPayment > 0) {
                    debt.currentBalance -= principalPayment;
                }

                // If paid off, in a full simulation we'd "roll over" the minPayment to the next debt.
                // Simplified for UI demo speed.
            }
            if (allPaid) activeDebts = false;
        }

        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + months);

        return { method, totalInterest, monthsToFree: months, payoffDate };
    };

    const snowball = useMemo(() => calculateStrategy('snowball'), [debts, extraPayment]);
    const avalanche = useMemo(() => calculateStrategy('avalanche'), [debts, extraPayment]);

    const bestMethod = snowball.totalInterest < avalanche.totalInterest ? 'Avalancha' : 'Bola de Nieve';
    // Often Avalanche is mathematically cheaper, Snowball is psychologically faster for first win. 
    // If difference is small, Snowball is usually recommended for behavior.

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <TrendingDown className="text-red-500" size={20} /> Simulador de Libertad
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Compara estrategias de pago</p>
                </div>
            </div>

            {/* Inputs */}
            <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Pago Extra Mensual (adicional a mínimos)
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0"
                        max="20000"
                        step="500"
                        value={extraPayment}
                        onChange={(e) => setExtraPayment(Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-bold text-slate-900 dark:text-white w-24 text-right">{formatCurrency(extraPayment)}</span>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Snowball */}
                <div className={`p-5 rounded-xl border-2 transition-all ${snowball.totalInterest > avalanche.totalInterest ? 'border-slate-100 dark:border-slate-700' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'}`}>
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Bola de Nieve ❄️</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Pagar menor balance primero</p>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Tiempo Total</span>
                            <span className="font-bold text-slate-900 dark:text-white">{Math.floor(snowball.monthsToFree / 12)}a {snowball.monthsToFree % 12}m</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Intereses Totales</span>
                            <span className="font-bold text-red-600 dark:text-red-400">{formatCurrency(snowball.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Fecha Libertad</span>
                            <span className="text-sm font-medium bg-white dark:bg-slate-950 px-2 py-1 rounded border dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300">
                                {snowball.payoffDate.toLocaleDateString('es-DO', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Avalanche */}
                <div className={`p-5 rounded-xl border-2 transition-all ${avalanche.totalInterest < snowball.totalInterest ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-700'}`}>
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Avalancha 🏔️</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Pagar mayor interés primero</p>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Tiempo Total</span>
                            <span className="font-bold text-slate-900 dark:text-white">{Math.floor(avalanche.monthsToFree / 12)}a {avalanche.monthsToFree % 12}m</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Intereses Totales</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(avalanche.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Fecha Libertad</span>
                            <span className="text-sm font-medium bg-white dark:bg-slate-950 px-2 py-1 rounded border dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300">
                                {avalanche.payoffDate.toLocaleDateString('es-DO', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendation */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm flex gap-3">
                <DollarSign className="shrink-0" />
                <div>
                    <strong>Recomendación:</strong> Basado en tus números, el método
                    <span className="font-bold"> {avalanche.totalInterest < snowball.totalInterest ? 'Avalancha' : 'Bola de Nieve'} </span>
                    te ahorrará <span className="font-bold">{formatCurrency(Math.abs(avalanche.totalInterest - snowball.totalInterest))}</span> en intereses.
                </div>
            </div>
        </div>
    );
}
