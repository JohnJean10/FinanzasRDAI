import { EmergencyFund } from "@/components/features/education/EmergencyFund";
import { GoalsContainer } from "@/components/features/planning/GoalsContainer";
import { Target, TrendingUp } from "lucide-react";

export default function SavingsPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Metas y Ahorros</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Tu fondo de emergencia y objetivos financieros</p>
                </div>
            </div>

            {/* Emergency Fund Calculator */}
            <EmergencyFund />

            {/* Savings Goals */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-emerald-500" size={20} />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Metas de Ahorro</h2>
                </div>
                <GoalsContainer />
            </div>
        </div>
    );
}
