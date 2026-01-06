"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { Plus } from "lucide-react";
import { DebtElimination } from "@/components/features/education/DebtElimination";

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

            <div className="grid grid-cols-1 gap-8">
                {/* Advanced Debt Strategy Tool */}
                <DebtElimination initialDebts={debts} />
            </div>
        </div>
    );
}
