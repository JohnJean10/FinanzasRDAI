import { KPIGrid } from "@/components/features/dashboard/KPIGrid";
import { TrendChart } from "@/components/features/dashboard/TrendChart";
import { InsightWidget } from "@/components/features/dashboard/InsightWidget";
import { BudgetAlerts } from "@/components/features/dashboard/BudgetAlerts";
import { RecentTransactions } from "@/components/features/dashboard/RecentTransactions";

export default function DashboardPage() {
    return (
        <div className="p-6 md:p-8 space-y-8 relative">
            <BudgetAlerts />
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Panel Principal</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Resumen de tu actividad financiera</p>
                </div>
                <div className="text-sm text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                    📅 {new Date().toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* KPI Stats */}
            <KPIGrid />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Section */}
                <div className="lg:col-span-2 space-y-8">
                    <TrendChart />
                    {/* TODO: Add Expenses by Category Pie Chart */}
                </div>

                {/* Sidebar/Widgets Section */}
                <div className="space-y-6">
                    <InsightWidget />

                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
