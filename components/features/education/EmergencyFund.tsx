"use client"

import { useState, useEffect } from "react"
import { useFinancial } from "@/lib/context/financial-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { emergencyFundEducation } from "@/lib/data/education-templates"
import { formatCurrency } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

export function EmergencyFund() {
    const { user, budgetConfigs, goals, updateUser } = useFinancial()

    // Auto-calculate values from context
    const realMonthlyExpenses = budgetConfigs
        .filter(b => b.category !== 'ahorros')
        .reduce((sum, b) => sum + b.limit, 0);

    const realMonthlyIncome = user.monthlyIncome || 0;

    const emergencyGoal = goals.find(g => g.isNative && g.name === 'Fondo de Emergencia');
    const realCurrentSavings = emergencyGoal?.current || 0;

    // State for local manipulation if needed, but synced with context
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(realMonthlyExpenses)
    const [currentSavings, setCurrentSavings] = useState<number>(realCurrentSavings)
    const [monthlyIncome, setMonthlyIncome] = useState<number>(realMonthlyIncome)
    const [targetMonths, setTargetMonths] = useState<number>(user.monthsOfPeace || 3)

    const potentialSavings = Math.max(0, monthlyIncome - monthlyExpenses)
    const [simulatedContribution, setSimulatedContribution] = useState<number>(potentialSavings)

    // Sync when context changes
    useEffect(() => {
        setMonthlyExpenses(realMonthlyExpenses)
        setCurrentSavings(realCurrentSavings)
        setMonthlyIncome(realMonthlyIncome)
        setTargetMonths(user.monthsOfPeace || 3)
        // Reset simulation to new potential if logic requires, or keep responsive
        setSimulatedContribution(Math.max(0, realMonthlyIncome - realMonthlyExpenses))
    }, [realMonthlyExpenses, realCurrentSavings, realMonthlyIncome, user.monthsOfPeace])

    // Update User Preference when slider changes
    const handleSliderChange = (vals: number[]) => {
        const months = vals[0];
        setTargetMonths(months);
        updateUser({ monthsOfPeace: months });
    }

    const minimumTarget = monthlyExpenses * 3
    const safeTarget = monthlyExpenses * 6
    const userTarget = monthlyExpenses * targetMonths
    const progress = Math.min((currentSavings / userTarget) * 100, 100) || 0
    const monthsCovered = currentSavings / monthlyExpenses || 0

    const calculateTimeToGoal = (monthlyContribution: number, target: number = userTarget) => {
        if (monthlyContribution <= 0) return Infinity
        const remaining = target - currentSavings
        if (remaining <= 0) return 0
        return Math.ceil(remaining / monthlyContribution)
    }



    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1 border-indigo-100/20 dark:border-indigo-800/20 bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                        Calculadora de Fondo de Emergencia
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                            Auto-Sincronizada
                        </span>
                    </CardTitle>
                    <CardDescription>
                        Calcula cuánto necesitas para tu paz financiera based en tus datos reales.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex justify-between">
                                Gastos Mensuales Fijos
                                <div className="group relative">
                                    <span className={`text-xs ${realMonthlyExpenses > 0 ? 'text-indigo-500 cursor-help underline decoration-dotted' : 'text-orange-500'}`}>
                                        {realMonthlyExpenses > 0 ? 'Ver Detalle' : 'Manual'}
                                    </span>
                                    {realMonthlyExpenses > 0 && (
                                        <div className="absolute right-0 top-6 w-48 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 hidden group-hover:block">
                                            <p className="text-xs font-bold mb-2 border-b pb-1">Desglose de Gastos:</p>
                                            <ul className="space-y-1">
                                                {budgetConfigs.filter(b => b.category !== 'ahorros').map(b => (
                                                    <li key={b.category} className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300">
                                                        <span className="capitalize">{b.category}</span>
                                                        <span>RD${b.limit.toLocaleString()}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </label>
                            <Input
                                type="number"
                                disabled={realMonthlyExpenses > 0}
                                value={monthlyExpenses || ''}
                                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                placeholder={realMonthlyExpenses === 0 ? "Ingresa tus gastos..." : ""}
                                className={`font-mono ${realMonthlyExpenses > 0 ? 'bg-slate-50 dark:bg-slate-900' : 'bg-white dark:bg-slate-950 border-indigo-300 dark:border-indigo-700'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex justify-between">
                                Ahorro Actual (Fondo Emergencia)
                                <span className="text-xs text-indigo-500" title="Saldo actual de tu meta">Detectado</span>
                            </label>
                            <Input
                                type="number"
                                disabled
                                value={currentSavings || ''}
                                className="font-mono bg-slate-50 dark:bg-slate-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex justify-between">
                                Ingresos Mensuales
                                <span className="text-xs text-indigo-500">Detectado</span>
                            </label>
                            <Input
                                type="number"
                                disabled
                                value={monthlyIncome || ''}
                                className="font-mono bg-slate-50 dark:bg-slate-900"
                            />
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-muted-foreground">Meses de Paz Objetivo: <strong className="text-indigo-600">{targetMonths}</strong></span>
                            </div>
                            <Slider
                                value={[targetMonths]}
                                min={1}
                                max={12}
                                step={1}
                                onValueChange={handleSliderChange}
                                className="cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                                <span>1 mes</span>
                                <span>3 meses (Mínimo)</span>
                                <span>6 meses (Ideal)</span>
                                <span>12 meses</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Meta ({targetMonths} meses)</span>
                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                {formatCurrency(userTarget)}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progreso Actual</span>
                                <span>{progress.toFixed(1)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                        <div className="text-xs text-center text-muted-foreground pt-1">
                            Cubres actualmente: <strong className="text-foreground">{monthsCovered.toFixed(1)} meses</strong> de gastos
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-1 border-indigo-100/20 dark:border-indigo-800/20 bg-card/50 backdrop-blur h-full flex flex-col min-h-[400px]">
                <Tabs defaultValue="plan" className="w-full flex-1 flex flex-col">
                    <div className="px-6 pt-6">
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="plan">🚀 Tu Plan</TabsTrigger>
                            <TabsTrigger value="education">📚 Educación</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="education" className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <ReactMarkdown>{emergencyFundEducation.replace(/\[nombre\]/g, "Usuario")}</ReactMarkdown>
                        </div>
                    </TabsContent>

                    <TabsContent value="plan" className="flex-1 p-6 space-y-6">
                        {potentialSavings > 0 ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-lg">Capacidad de Ahorro Actual</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Con tus ingresos y gastos actuales, tienes un excedente teórico de <strong>{formatCurrency(potentialSavings)}</strong>.
                                    </p>

                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="font-medium">Simular Aporte Mensual:</span>
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                                {formatCurrency(simulatedContribution)}
                                            </span>
                                        </div>
                                        <Slider
                                            value={[simulatedContribution]}
                                            min={Math.max(100, potentialSavings * 0.1)}
                                            max={potentialSavings * 2} // Allow simulating up to 2x potential (aggressive)
                                            step={100}
                                            onValueChange={(vals) => setSimulatedContribution(vals[0])}
                                            className="cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground text-center">
                                            Ajusta este valor para ver cómo cambia tu tiempo de llegada a la meta.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold">Proyección con Aporte Simulado</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-muted rounded-md text-sm">
                                            <span>Para llegar a 3 meses:</span>
                                            <span className={`font-mono font-medium ${calculateTimeToGoal(simulatedContribution, minimumTarget) > 12 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                                {calculateTimeToGoal(simulatedContribution, minimumTarget)} meses
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-muted rounded-md text-sm ring-1 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-900/10">
                                            <span className="font-medium text-indigo-700 dark:text-indigo-300">Para llegar a {targetMonths} meses (Meta):</span>
                                            <span className={`font-mono font-bold ${calculateTimeToGoal(simulatedContribution, userTarget) > 12 ? 'text-orange-600' : 'text-indigo-600'}`}>
                                                {calculateTimeToGoal(simulatedContribution, userTarget)} meses
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-muted rounded-md text-sm">
                                            <span>Para llegar a 6 meses (Ideal):</span>
                                            <span className="font-mono font-medium">
                                                {calculateTimeToGoal(simulatedContribution, safeTarget)} meses
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-4">
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-full w-fit mx-auto">
                                    ⚠️
                                </div>
                                <h4 className="text-lg font-semibold">Revisión Recomendada</h4>
                                <p className="text-sm text-muted-foreground">
                                    Tus gastos actuales igualan o superan tus ingresos. Para construir tu fondo, primero necesitamos encontrar ese "Número Verde".
                                </p>
                                <Button variant="outline" className="mt-4">
                                    Ir a Presupuesto
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}
