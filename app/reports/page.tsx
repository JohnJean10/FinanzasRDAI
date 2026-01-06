"use client";

import { FileText } from "lucide-react";
import { ExpensePieChart } from "@/components/features/reports/ExpensePieChart";
import { BudgetBarChart } from "@/components/features/reports/BudgetBarChart";
import { NetWorthChart } from "@/components/features/reports/NetWorthChart";
import { ExportPanel } from "@/components/features/reports/ExportPanel";

export default function ReportsPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="text-blue-600 dark:text-blue-400" />
                    Reportes y Analíticas
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Visualiza tus patrones financieros a largo plazo.
                </p>
            </div>

            {/* Export Panel */}
            <ExportPanel />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ExpensePieChart />
                <BudgetBarChart />
                <NetWorthChart />

                {/* Placeholder for future insights or another chart */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center p-8">
                    <p className="text-slate-400 text-sm text-center">
                        Más métricas avanzadas estarán disponibles<br />cuando acumules más historial.
                    </p>
                </div>
            </div>
        </div>
    );
}
