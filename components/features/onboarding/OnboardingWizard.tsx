"use client";

import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { useRouter } from "next/navigation";
import { ArrowRight, Bell, ShieldAlert, TrendingUp, Wallet, CheckCircle2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function OnboardingWizard() {
    const { updateUser, addGoal, addTransaction } = useFinancial();
    const router = useRouter();
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        currency: "DOP",
        incomeAmount: "",
        incomeFrequency: "quincenal",
        fixedExpenses: "",
        profileType: "", // 'deudas' | 'inversion' (Tu lógica)
        emergencyGoal: ""
    });

    // AI Diagnosis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiOpinion, setAiOpinion] = useState<string | null>(null);

    // --- CÁLCULOS MATEMÁTICOS (El Cerebro) ---
    const calculateMonthlyIncome = () => {
        const amount = parseFloat(formData.incomeAmount) || 0;
        return formData.incomeFrequency === 'quincenal' ? amount * 2 : amount;
    };

    const calculateMonthlyExpenses = () => {
        return parseFloat(formData.fixedExpenses) || 0;
    };

    const calculateSavingsCapacity = () => {
        return calculateMonthlyIncome() - calculateMonthlyExpenses();
    };

    const handleNext = async () => {
        // Intercept Step 2 (Financials) to trigger AI Diagnosis
        if (step === 2 && !aiOpinion && !isAnalyzing) {
            await fetchAiOpinion();
            setStep(step + 1);
            return;
        }

        if (step === steps.length - 1) {
            completeOnboarding();
        } else {
            setStep(step + 1);
        }
    };

    const fetchAiOpinion = async () => {
        setIsAnalyzing(true);
        try {
            const income = parseFloat(formData.incomeAmount);
            const expenses = parseFloat(formData.fixedExpenses);

            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "ANALIZA_AHORA", // Trigger keyword
                    systemInstruction: `
                        ERES: Un Coach Financiero Dominicano experto y muy directo.
                        MODO: "Reacción Visceral".
                        DATOS:
                        - Nombre: ${formData.name}
                        - Ingresos: ${formatCurrency(income)}
                        - Gastos Fijos: ${formatCurrency(expenses)}
                        - Capacidad de Ahorro: ${formatCurrency(income - expenses)}

                        TAREA: Dame una OPINIÓN DE UNA SOLA FRASE (Máximo 20 palabras) sobre esta situación.
                        
                        EJEMPLOS DE TONO:
                        - Si está mal: "¡Diablo manín, esa olla ta caliente, frenemos eso ya!"
                        - Si está bien: "¡Te la comiste! Tamo en racha, vamo a invertir."
                        - Si está medio: "Tamo a flote, pero no te duermas en los laureles."
                        
                        IMPORTANTE: NUNCA USES FORMATO MARKDOWN, SOLO TEXTO PLANO.
                    `,
                    history: []
                })
            });

            const data = await response.json();
            if (data.response) {
                setAiOpinion(data.response);
            }
        } catch (error) {
            console.error("AI Error", error);
            setAiOpinion("¡Vamos a organizar esto!"); // Fallback
        } finally {
            setIsAnalyzing(false);
        }
    };

    const completeOnboarding = () => {
        const monthlyIncome = calculateMonthlyIncome();
        const monthlyExpenses = calculateMonthlyExpenses();

        // 1. Guardar Perfil y Preferencias
        updateUser({
            name: formData.name,
            monthlyIncome: monthlyIncome,
            currency: formData.currency as 'DOP' | 'USD',
            hasCompletedOnboarding: true,
            // Aquí podríamos guardar el profileType en el futuro
        });

        // 2. Registrar Ingreso Inicial
        addTransaction({
            type: 'income',
            amount: parseFloat(formData.incomeAmount),
            category: 'ingreso_sueldo',
            description: `Nómina (${formData.incomeFrequency})`,
            date: new Date().toISOString().split('T')[0],
            account: 'general'
        });

        // 3. Crear Meta (El Clavo)
        const suggestedTarget = monthlyExpenses > 0 ? monthlyExpenses * 3 : monthlyIncome * 3;
        const finalTarget = parseFloat(formData.emergencyGoal) || suggestedTarget;

        addGoal({
            name: 'Fondo de Emergencia (El Clavo)',
            target: finalTarget,
            current: 0,
            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            icon: '🛡️',
            priority: 'alta'
        });

        // 4. RUTEO INTELIGENTE (Tu Lógica de Bifurcación)
        // Si tiene líos, lo mandamos directo a configurar las deudas.
        if (formData.profileType === 'deudas') {
            router.push('/debts');
        } else {
            router.push('/dashboard');
        }
    };

    // --- PASOS DEL WIZARD (Tu Personalidad + Mi Data) ---
    const steps = [
        {
            // PASO 1: LA BIENVENIDA (Tu Texto)
            icon: Bot,
            title: "¡Dímelo líder! 🤖",
            subtitle: "Soy tu nuevo asesor financiero. No soy un banco, así que no te voy a vender tarjetas. Vine a que hablemos claro de tus cuartos.",
            content: (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <Label>¿Cómo te llamas?</Label>
                        <Input
                            placeholder="Tu nombre aquí..."
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="text-lg py-6"
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Moneda</Label>
                        <Select
                            value={formData.currency}
                            onValueChange={(v) => setFormData({ ...formData, currency: v })}
                        >
                            <SelectTrigger className="py-6"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DOP">🇩🇴 Peso (DOP)</SelectItem>
                                <SelectItem value="USD">🇺🇸 Dólar (USD)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )
        },
        {
            // PASO 2: EL PERFILADO (Tu bifurcación visual)
            icon: ShieldAlert, // Usamos un icono genérico aquí, cambiaremos dinámicamente
            title: "Sé sincero conmigo...",
            subtitle: "¿Cuál es tu realidad ahora mismo? Esto define cómo te voy a aconsejar.",
            content: (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Opción A: Deudas (Tu diseño) */}
                    <div
                        onClick={() => setFormData({ ...formData, profileType: 'deudas' })}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all group ${formData.profileType === 'deudas'
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-red-300'
                            }`}
                    >
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full mr-4">
                            <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <span className="block font-bold text-slate-900 dark:text-white">Tengo un lío de deudas</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Necesito organizar mis pagos y salir de esto rápido.</span>
                        </div>
                    </div>

                    {/* Opción B: Inversión (Tu diseño) */}
                    <div
                        onClick={() => setFormData({ ...formData, profileType: 'inversion' })}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all group ${formData.profileType === 'inversion'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                            }`}
                    >
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full mr-4">
                            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <span className="block font-bold text-slate-900 dark:text-white">Estoy "limpio", quiero crecer</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Quiero invertir o saber si puedo darme un gusto.</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            // PASO 3: LA DATA DURA (Necesaria para que la app funcione)
            icon: Wallet,
            title: "Hablemos de Cuartos 💸",
            subtitle: "Para armar tu estrategia, necesito los números crudos.",
            content: (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>¿Cuánto cobras?</Label>
                            <Input
                                type="number"
                                className="py-6 text-lg"
                                placeholder="0.00"
                                value={formData.incomeAmount}
                                onChange={(e) => setFormData({ ...formData, incomeAmount: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label>¿Frecuencia?</Label>
                            <Select
                                value={formData.incomeFrequency}
                                onValueChange={(v) => setFormData({ ...formData, incomeFrequency: v })}
                            >
                                <SelectTrigger className="py-6"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="quincenal">Quincenal (x2)</SelectItem>
                                    <SelectItem value="mensual">Mensual (x1)</SelectItem>
                                    <SelectItem value="semanal">Semanal (x4)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>¿Cuánto se te va OBLIGADO en gastos fijos?</Label>
                        <Input
                            type="number"
                            className="py-6 text-lg"
                            placeholder="Casa, luz, comida..."
                            value={formData.fixedExpenses}
                            onChange={(e) => setFormData({ ...formData, fixedExpenses: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Sé sincero, esto es para calcular tu capacidad real.</p>
                    </div>
                </div>
            )
        },
        {
            // PASO 4: PERMISOS (Tu idea de transparencia)
            icon: Bell,
            title: "Una última cosa, sin rodeos",
            subtitle: "Para que esto funcione, necesito que me des luz verde.",
            content: (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* OPINIÓN DEL COACH (Highlight) */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-xl shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border-none relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Bot size={64} />
                            </div>
                            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                                <Bot size={14} /> Diagnóstico Express
                            </h4>
                            <p className="text-lg font-bold text-slate-800 dark:text-white italic leading-tight">
                                "{aiOpinion || 'Analizando tus números...'}"
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start mb-2">
                            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-1" />
                            <p className="text-sm font-medium text-slate-900 dark:text-white">¿Para qué las notificaciones?</p>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            No es para molestarte. Es para avisarte <b>2 días antes</b> de que el banco te cobre mora o el prestamista te llame.
                            Si se te pasa la fecha, pierdes dinero, y mi trabajo es que no pierdas.
                        </p>
                    </div>

                    {/* Resumen Final antes de arrancar */}
                    <div className="text-center p-4">
                        <p className="text-sm text-muted-foreground mb-1">Tu Capacidad de Ahorro estimada:</p>
                        <p className={`text-2xl font-bold ${calculateSavingsCapacity() > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {formatCurrency(calculateSavingsCapacity())} / mes
                        </p>
                    </div>
                </div>
            )
        }
    ];

    const CurrentStep = steps[step];
    // Icono dinámico para el paso 2
    const StepIcon = step === 1 && formData.profileType === 'deudas' ? ShieldAlert : (step === 1 && formData.profileType === 'inversion' ? TrendingUp : CurrentStep.icon);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300">
                {/* Progress Dots */}
                <div className="flex gap-2 mb-8 justify-center">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${i === step ? 'bg-blue-600 w-6' : (i < step ? 'bg-blue-400' : 'bg-slate-200 dark:bg-slate-800')
                                }`}
                        />
                    ))}
                </div>

                {/* Header */}
                <div className="mb-8 text-center animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 shadow-sm">
                        <StepIcon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{CurrentStep.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                        {CurrentStep.subtitle}
                    </p>
                </div>

                {/* Content */}
                <div className="mb-8 min-h-[220px]">
                    {CurrentStep.content}
                </div>

                {/* Actions */}
                <Button
                    onClick={handleNext}
                    disabled={
                        (step === 0 && !formData.name) ||
                        (step === 1 && !formData.profileType) ||
                        (step === 2 && (!formData.incomeAmount || !formData.fixedExpenses)) ||
                        isAnalyzing
                    }
                    className="w-full py-6 text-lg rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                    size="lg"
                >
                    {isAnalyzing ? (
                        <span className="flex items-center gap-2 animate-pulse">
                            <Bot className="animate-bounce" /> Calculando estrategia...
                        </span>
                    ) : (
                        step === steps.length - 1 ? (
                            <span className="flex items-center">Dale, actívalo 🚀 <ArrowRight className="ml-2 h-5 w-5" /></span>
                        ) : (
                            <span className="flex items-center">Vamos al mambo <ArrowRight className="ml-2 h-5 w-5" /></span>
                        )
                    )}
                </Button>

                {step > 0 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="w-full mt-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        Volver atrás
                    </button>
                )}
            </div>
        </div>
    );
}
