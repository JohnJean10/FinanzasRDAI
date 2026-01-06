"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Wallet, AlertCircle } from "lucide-react";

export function CoachSidebar() {
    const { user, transactions, debts } = useFinancial();

    // Basic Calculations for MVP
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;
    // Green Number simplified: Balance - (Debts min payments, simplifed)
    const greenNumber = Math.max(0, balance);

    return (
        <aside className="space-y-6 overflow-y-auto pr-2">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                        👤
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">{user.name}</h4>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/20">
                            {user.profile}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-slate-400 text-xs mb-1">Ingresos</p>
                        <p className="font-semibold">{formatCurrency(income)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs mb-1">Gastos</p>
                        <p className="font-semibold">{formatCurrency(expenses)}</p>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-white/10">
                        <p className="text-slate-400 text-xs mb-1">Balance del Mes</p>
                        <p className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatCurrency(balance)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Green Number */}
            <div className="bg-emerald-50 rounded-2xl p-6 border-l-4 border-emerald-500">
                <h5 className="text-emerald-900 font-medium mb-2 flex items-center gap-2">
                    <TrendingUp size={18} /> Tu Número Verde
                </h5>
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {formatCurrency(greenNumber)}
                </div>
                <p className="text-emerald-800/70 text-xs leading-relaxed">
                    Dinero disponible para gastar hoy sin afectar tus metas ni tus ahorros. ¡Disfrútalo!
                </p>
            </div>

            {/* Context Suggestions */}
            <div>
                <h5 className="text-slate-500 text-sm font-medium mb-4 uppercase tracking-wider">Sugerencias</h5>
                <div className="space-y-3">
                    {debts.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors">
                                    <AlertCircle size={18} />
                                </div>
                                <div>
                                    <h6 className="font-medium text-slate-800 text-sm">Deuda Activa</h6>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Tienes {debts.length} deudas reportadas. ¿Revisamos una estrategia?
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <Wallet size={18} />
                            </div>
                            <div>
                                <h6 className="font-medium text-slate-800 text-sm">Ahorro Inteligente</h6>
                                <p className="text-slate-500 text-xs mt-1">
                                    Podrías mover RD$3,500 al fondo de emergencia hoy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
