"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";

export function RecentTransactions() {
    const { transactions } = useFinancial();

    // Sort by date desc and take top 5
    const recentTx = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    if (recentTx.length === 0) {
        return (
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-blue-900/30">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Actividad Reciente</h3>
                <p className="text-sm text-slate-500 text-center py-4">No hay transacciones recientes.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-blue-900/30">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
                {recentTx.map((t) => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-blue-950/40 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold
                                ${t.type === 'income'
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                }`}>
                                {t.category.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]" title={t.description}>
                                    {t.description || t.category}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {/* Use simplistic relative time if date-fns fails or for MVP simplicity, 
                                        but trying standard approach first. Falls back to Date string if needed manually.
                                        Since I can't verify packages easily, I will strip date-fns to be safe and use native Intl API.
                                    */}
                                    {new Date(t.date).toLocaleDateString('es-DO')}
                                </p>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
