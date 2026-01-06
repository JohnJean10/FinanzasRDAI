"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { DebtStrategyCalculator } from "@/components/features/debts/DebtStrategyCalculator";
import { DebtList } from "@/components/features/debts/DebtList";
import { Plus } from "lucide-react";

export default function DebtsPage() {
    const { debts } = useFinancial();

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Deudas</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Estrategias para tu libertad financiera</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                    <Plus size={18} /> Nueva Deuda
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Calculator (Takes 2/3) */}
                <div className="lg:col-span-2">
                    <DebtStrategyCalculator debts={debts} />
                </div>

                {/* Right Col: List (Takes 1/3) */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Tus Compromisos</h3>
                        <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">{debts.length} Activas</span>
                    </div>
                    <DebtList debts={debts} />
                </div>
            </div>
        </div>
    );
}
