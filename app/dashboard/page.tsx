import { KPIGrid } from "@/components/features/dashboard/KPIGrid";
import { TrendChart } from "@/components/features/dashboard/TrendChart";
import { InsightWidget } from "@/components/features/dashboard/InsightWidget";

export default function DashboardPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
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

                    {/* Recent Transactions Widget Placeholder */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Actividad Reciente</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold text-xs">SB</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Supermercado Bravo</p>
                                        <p className="text-xs text-slate-400">Hace 2 horas</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-red-500">- RD$4,500</span>
                            </div>
                            {/* More items */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
