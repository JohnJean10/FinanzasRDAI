"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { DateRange, DateRangeSelect } from "@/components/ui/DateRangeSelect";
import { ExpensePieChart } from "@/components/features/reports/ExpensePieChart";
import { BudgetBarChart } from "@/components/features/reports/BudgetBarChart";
import { NetWorthChart } from "@/components/features/reports/NetWorthChart";
import { CashFlowPrediction } from "@/components/features/finance/CashFlowPrediction";
import { SubscriptionAnalysis } from "@/components/features/finance/SubscriptionAnalysis";
import { ExportPanel } from "@/components/features/reports/ExportPanel";

export default function ReportsPage() {
    const { transactions } = useFinancial();
    const [dateRange, setDateRange] = useState<DateRange>('month');

    // Filter Logic
    const filteredTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (dateRange === 'all') return true;
        if (dateRange === 'day') {
            return date.toDateString() === now.toDateString();
        }
        if (dateRange === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return date >= weekAgo;
        }
        if (dateRange === 'fortnight') {
            const fortnightAgo = new Date(now);
            fortnightAgo.setDate(now.getDate() - 15);
            return date >= fortnightAgo;
        }
        if (dateRange === 'month') {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }
        if (dateRange === 'year') {
            return date.getFullYear() === now.getFullYear();
        }
        if (dateRange === 'ytd') {
            return date.getFullYear() === now.getFullYear() && date <= now;
        }
        return true;
    });

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="text-blue-600 dark:text-blue-400" />
                        Análisis Financiero
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Profundiza en tus flujos de dinero y patrimonio.
                    </p>
                </div>
                <div className="flex gap-2">
                    <DateRangeSelect value={dateRange} onChange={setDateRange} />
                    <ExportPanel data={filteredTransactions} />
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Row 1: High Level */}
                <NetWorthChart />

                {/* Row 2: Prediction and Analysis (Full Width or Grid) */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Predicción de Flujo</h2>
                        <CashFlowPrediction transactions={filteredTransactions} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Análisis de Suscripciones</h2>
                        <SubscriptionAnalysis transactions={filteredTransactions} />
                    </div>
                </div>

                {/* Row 3: Breakdown */}
                <ExpensePieChart filteredTransactions={filteredTransactions} />
                <BudgetBarChart />

                {/* Future */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center p-8">
                    <p className="text-slate-400 text-sm text-center">
                        Más métricas (ROI, Deuda) próximamente.
                    </p>
                </div>
            </div>
        </div>
    );
}
