import { EmergencyFund } from "@/components/features/education/EmergencyFund";
import { InvestmentGuide } from "@/components/features/education/InvestmentGuide";
import { GoalsContainer } from "@/components/features/planning/GoalsContainer";
import BudgetManager from "@/components/features/planning/BudgetManager";

export default function PlanningPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Planificación Financiera</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Tus metas, presupuestos y estrategia a largo plazo</p>
            </div>

            {/* Advanced Emergency Fund Analysis */}
            <EmergencyFund />

            {/* Budget Manager - Full Width */}
            <BudgetManager />

            {/* Goals Section */}
            <GoalsContainer />

            {/* Educational Investment Section */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Guía de Inversión en RD</h2>
                <InvestmentGuide />
            </div>
        </div>
    );
}
