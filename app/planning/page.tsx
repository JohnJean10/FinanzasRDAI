import { EmergencyFundWidget } from "@/components/features/planning/EmergencyFundWidget";
import { GoalsContainer } from "@/components/features/planning/GoalsContainer";
import { BudgetContainer } from "@/components/features/planning/BudgetContainer";

export default function PlanningPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Planificación Financiera</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Tus metas, presupuestos y estrategia a largo plazo</p>
            </div>

            {/* Hero Widget: Emergency Fund */}
            <EmergencyFundWidget />

            {/* Two Column Layout for Goals and Budgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GoalsContainer />
                <BudgetContainer />
            </div>
        </div>
    );
}
