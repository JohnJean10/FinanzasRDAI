"use client";



import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { Shield, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { DepositModal } from "./DepositModal";

export function EmergencyFundWidget() {
    const { transactions, goals } = useFinancial();
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    // 1. Calculate Average Monthly Expenses
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
    // Simplified logic: assume history is roughly 1 month for prototype
    const avgMonthlyExpenses = totalExpenses || 1;

    // 2. Find Emergency Fund Goal
    const emergencyGoal = goals.find(g => g.name.toLowerCase().includes('emergencia')) || {
        id: -1, // Dummy ID if not found
        name: "Fondo de Emergencia",
        current: 0,
        target: avgMonthlyExpenses * 3,
        deadline: "",
        icon: "🛡️"
    };

    // 3. Calculate Runway
    const runwayMonths = emergencyGoal.current / avgMonthlyExpenses;
    const targetMonths = emergencyGoal.target / avgMonthlyExpenses;
    const progressPercent = Math.min((emergencyGoal.current / emergencyGoal.target) * 100, 100);

    // Status Styling
    let statusColor = "text-yellow-600";
    let statusBg = "bg-yellow-50";
    let Icon = AlertTriangle;
    let message = "Construyendo tu seguridad";

    if (runwayMonths >= 3) {
        statusColor = "text-emerald-600 dark:text-emerald-400";
        statusBg = "bg-emerald-50 dark:bg-emerald-900/30";
        Icon = CheckCircle;
        message = "¡Fondo Saludable!";
    } else if (runwayMonths < 1) {
        statusColor = "text-red-600 dark:text-red-400";
        statusBg = "bg-red-50 dark:bg-red-900/30";
        Icon = AlertTriangle;
        message = "Prioridad Crítica";
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Shield className="text-blue-500" size={20} /> Fondo de Emergencia
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tu "Clavo" para imprevistos</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusBg} ${statusColor}`}>
                    <Icon size={14} /> {message}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visual Runway */}
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Cobertura Actual</span>
                        <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(emergencyGoal.current)}</span>
                    </div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${runwayMonths >= 3 ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span>{formatCurrency(0)}</span>
                        <span>Meta: {formatCurrency(emergencyGoal.target)}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Monto Actual</span>
                        <span className="font-bold text-xl text-slate-900 dark:text-white">{formatCurrency(emergencyGoal.current)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Gasto Mensual Prom.</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{formatCurrency(avgMonthlyExpenses)}</span>
                    </div>

                    {emergencyGoal.id !== -1 && (
                        <button
                            onClick={() => setIsDepositModalOpen(true)}
                            className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Agregar Fondos
                        </button>
                    )}
                </div>
            </div>

            {/* Deposit Modal - Only render if we have a valid goal */}
            {emergencyGoal.id !== -1 && (
                <DepositModal
                    isOpen={isDepositModalOpen}
                    onClose={() => setIsDepositModalOpen(false)}
                    goal={emergencyGoal as any}
                />
            )}
        </div>
    );
}
