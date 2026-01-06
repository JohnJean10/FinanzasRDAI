"use client";

import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, User, Wallet, Target } from "lucide-react";

export default function OnboardingWizard() {
    const { updateUser, addGoal, addTransaction } = useFinancial();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        monthlyIncome: "",
        currency: "DOP",
        emergencyGoal: ""
    });

    const handleNext = () => {
        if (step === 2) {
            completeOnboarding();
        } else {
            setStep(step + 1);
        }
    };

    const completeOnboarding = () => {
        const income = parseFloat(formData.monthlyIncome);

        // 1. Update User Profile
        updateUser({
            name: formData.name,
            monthlyIncome: income,
            currency: formData.currency as 'DOP' | 'USD',
            hasCompletedOnboarding: true
        });

        // 2. Add Initial Income Transaction (Mental Boost)
        addTransaction({
            type: 'income',
            amount: income,
            category: 'ingreso_sueldo',
            description: 'Ingreso Mensual Ref.',
            date: new Date().toISOString().split('T')[0],
            account: 'general'
        });

        // 3. Create Emergency Fund Goal
        const emergencyTarget = parseFloat(formData.emergencyGoal) || (income * 3);
        addGoal({
            name: 'Fondo de Emergencia',
            target: emergencyTarget,
            current: 0,
            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            icon: '🛡️'
        });

        router.push('/dashboard');
    };

    const steps = [
        {
            icon: User,
            title: "¡Hola! Soy tu Coach Financiero",
            subtitle: "Vamos a personalizar tu experiencia. ¿Cómo te llamas?",
            content: (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tu Nombre</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Juan Pérez"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Moneda Principal</label>
                        <select
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        >
                            <option value="DOP">Peso Dominicano (DOP)</option>
                            <option value="USD">Dólar Estadounidense (USD)</option>
                        </select>
                    </div>
                </div>
            )
        },
        {
            icon: Wallet,
            title: "Tu Salud Financiera",
            subtitle: "Para darte buenos consejos, necesito saber tus ingresos.",
            content: (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ingreso Mensual Promedio</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                            value={formData.monthlyIncome}
                            onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                        />
                        <p className="text-xs text-slate-500 mt-2">Esta información es privada y solo se guarda en tu dispositivo.</p>
                    </div>
                </div>
            )
        },
        {
            icon: Target,
            title: "Tu Primera Meta",
            subtitle: "Todo buen plan empieza por un Fondo de Emergencia de 3 meses.",
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1">Recomendación del Coach</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            Basado en tus ingresos, te sugiero guardar <b>RD${((parseFloat(formData.monthlyIncome) || 0) * 3).toLocaleString()}</b> para imprevistos.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta para Fondo de Emergencia</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Monto objetivo"
                            value={formData.emergencyGoal || (parseFloat(formData.monthlyIncome) ? (parseFloat(formData.monthlyIncome) * 3).toString() : "")}
                            onChange={(e) => setFormData({ ...formData, emergencyGoal: e.target.value })}
                        />
                    </div>
                </div>
            )
        }
    ];

    const CurrentStep = steps[step];
    const Icon = CurrentStep.icon;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
                    ))}
                </div>

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                        <Icon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{CurrentStep.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{CurrentStep.subtitle}</p>
                </div>

                {/* Content */}
                <div className="mb-8">
                    {CurrentStep.content}
                </div>

                {/* Actions */}
                <button
                    onClick={handleNext}
                    disabled={
                        (step === 0 && !formData.name) ||
                        (step === 1 && !formData.monthlyIncome)
                    }
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {step === 2 ? 'Comenzar mi Viaje' : 'Continuar'} <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
