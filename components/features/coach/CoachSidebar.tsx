"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, AlertCircle, ShieldCheck, CreditCard } from "lucide-react";

export function CoachSidebar() {
    const { user, transactions, debts, metrics, goals, budgetConfigs } = useFinancial();

    // 1. Core Calculations
    const netWorth = metrics.totalAssets - metrics.totalDebt;
    const monthlyIncome = user.monthlyIncome;
    const monthlyExpenses = metrics.totalExpenses;
    const cashFlow = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (cashFlow / monthlyIncome) * 100 : 0;

    // 2. Financial Health Score (0-100)
    let score = 50; // Base score
    if (cashFlow > 0) score += 15;
    if (savingsRate > 20) score += 15;
    if (debts.length === 0) score += 20;
    if (debts.some(d => d.interestRate > 20)) score -= 15; // High interest penalty
    if (metrics.availableBalance < 0) score -= 20;

    // Normalize score
    score = Math.max(0, Math.min(100, score));

    // Color coding for score
    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-emerald-500";
        if (s >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <aside className="space-y-6 overflow-y-auto pr-2 h-full pb-20">
            {/* Header / Health Score */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <h5 className="text-slate-500 font-medium text-xs uppercase tracking-wider">Tu Salud Financiera</h5>
                    <ShieldCheck size={18} className={getScoreColor(score)} />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
                    <span className="text-slate-400 text-sm">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>

            {/* Net Worth Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wallet size={64} />
                </div>
                <div className="relative z-10">
                    <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Patrimonio Neto</p>
                    <h3 className="text-2xl font-bold mb-4">{formatCurrency(netWorth)}</h3>

                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-white/10 pt-4">
                        <div>
                            <p className="text-emerald-400 text-xs mb-0.5">Activos</p>
                            <p className="font-semibold">{formatCurrency(metrics.totalAssets)}</p>
                        </div>
                        <div>
                            <p className="text-red-400 text-xs mb-0.5">Pasivos</p>
                            <p className="font-semibold">{formatCurrency(metrics.totalDebt)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Proactive Insights / Smart Alerts */}
            <div>
                <h5 className="text-slate-500 text-sm font-medium mb-4 uppercase tracking-wider">Alertas Inteligentes</h5>
                <div className="space-y-3">

                    {/* Cash Flow Alert */}
                    {cashFlow < 0 ? (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                            <div className="flex gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/50 text-red-600 rounded-lg h-fit">
                                    <TrendingDown size={18} />
                                </div>
                                <div>
                                    <h6 className="font-medium text-slate-900 dark:text-white text-sm">Flujo de Caja Negativo</h6>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                                        Estás gastando <b>{formatCurrency(Math.abs(cashFlow))}</b> más de lo que ganas. Revisa tus gastos hormiga.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-lg h-fit">
                                    <TrendingUp size={18} />
                                </div>
                                <div>
                                    <h6 className="font-medium text-slate-900 dark:text-white text-sm">Buen Ritmo de Ahorro</h6>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                                        Guardas el <b>{savingsRate.toFixed(1)}%</b> de tus ingresos. ¡Sigue así!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* High Interest Debt Alert */}
                    {debts.some(d => d.interestRate > 25) && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                            <div className="flex gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 text-orange-600 rounded-lg h-fit">
                                    <AlertCircle size={18} />
                                </div>
                                <div>
                                    <h6 className="font-medium text-slate-900 dark:text-white text-sm">Alerta de Intereses</h6>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                                        Tienes deudas con tasa > 25%. Prioriza pagar esto antes de invertir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Budget Alert (Mock Logic) */}
                    {budgetConfigs.length === 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 cursor-pointer hover:bg-blue-100 transition-colors">
                            <div className="flex gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-lg h-fit">
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <h6 className="font-medium text-slate-900 dark:text-white text-sm">Sin Presupuesto</h6>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                                        No has definido límites de gastos. Configura tu presupuesto para mejorar tu score.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </aside>
    );
}
