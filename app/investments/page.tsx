import { InvestmentGuide } from "@/components/features/education/InvestmentGuide";
import { TrendingUp, BarChart3 } from "lucide-react";

export default function InvestmentsPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inversiones</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Guía práctica para invertir en República Dominicana</p>
                </div>
            </div>

            {/* Investment Guide */}
            <InvestmentGuide />
        </div>
    );
}
