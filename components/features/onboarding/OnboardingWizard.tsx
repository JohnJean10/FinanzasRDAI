'use client'

import { useState } from 'react'
import { Bell, ShieldAlert, TrendingUp, Wallet } from 'lucide-react'
import { useFinancial } from "@/lib/context/financial-context"
import { useRouter } from "next/navigation"

export default function OnboardingWizard() {
    const [step, setStep] = useState(1)
    const [profile, setProfile] = useState<'deudas' | 'inversion' | null>(null)

    const { updateUser } = useFinancial()
    const router = useRouter()

    const handleFinish = () => {
        // Guardar perfilado (podríamos añadir esto al contexto luego)
        console.log('Perfil seleccionado:', profile);

        // Completar onboarding básico
        updateUser({
            hasCompletedOnboarding: true,
            // Defaults seguros para evitar errores en dashboard
            name: 'Líder',
            monthlyIncome: 0,
            currency: 'DOP'
        });

        router.push('/dashboard');
    }

    // FRENTE 1: El Hook (Bienvenida con personalidad)
    const renderStep1 = () => (
        <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <span className="text-4xl">🤖</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                ¡Dímelo líder!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
                Soy tu nuevo asesor financiero. No soy un banco, así que no te voy a vender tarjetas.
                Vine a que hablemos claro de tus cuartos.
            </p>
            <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
                Vamos al mambo
            </button>
        </div>
    )

    // FRENTE 2: Perfilado Inteligente (La bifurcación)
    const renderStep2 = () => (
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Para empezar, sé sincero conmigo...
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
                ¿Cuál es tu realidad ahora mismo? Esto define cómo te voy a aconsejar.
            </p>

            <div className="grid gap-4">
                {/* Opción A: Deudas (Modo Bola de Nieve) */}
                <button
                    onClick={() => { setProfile('deudas'); setStep(3); }}
                    className="flex items-center p-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left group"
                >
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-800">
                        <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <span className="block font-bold text-slate-900 dark:text-white">Tengo un lío de deudas</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Necesito organizar mis pagos y salir de esto rápido.</span>
                    </div>
                </button>

                {/* Opción B: Inversión/Gasto (Modo Psicológico) */}
                <button
                    onClick={() => { setProfile('inversion'); setStep(3); }}
                    className="flex items-center p-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-left group"
                >
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-800">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <span className="block font-bold text-slate-900 dark:text-white">Estoy "limpio", quiero crecer</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Quiero invertir o saber si puedo darme un gusto sin culpa.</span>
                    </div>
                </button>
            </div>
        </div>
    )

    // FRENTE 3: Permisos (Sinceridad total)
    const renderStep3 = () => (
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Una última cosa, sin rodeos
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>
                    Para que esto funcione, necesito que me des luz verde con las notificaciones.
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start mb-2">
                        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-1" />
                        <p className="text-sm font-medium text-slate-900 dark:text-white">¿Para qué?</p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No es para molestarte. Es para avisarte 2 días antes de que el banco te cobre mora.
                        Si se te pasa la fecha, pierdes dinero, y mi trabajo es que no pierdas.
                    </p>
                </div>
            </div>

            <button
                onClick={handleFinish}
                className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-slate-200 dark:shadow-blue-900/20"
            >
                Dale, activalo
            </button>

            <button onClick={handleFinish} className="w-full py-3 text-slate-400 text-sm hover:text-slate-600 dark:hover:text-slate-200">
                Ahora no, prefiero arriesgarme
            </button>
        </div>
    )

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                {/* Indicador de progreso simple */}
                <div className="flex justify-center mt-8 space-x-2">
                    <div className={`h-1 w-8 rounded ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                    <div className={`h-1 w-8 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                    <div className={`h-1 w-8 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                </div>
            </div>
        </div>
    )
}
