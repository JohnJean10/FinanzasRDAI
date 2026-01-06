"use client"

import { useMemo } from "react"
import { useFinancial } from "@/lib/context/financial-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, DollarSign, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { formatCurrency, detectRecurringTransactions, calculateCashFlowPrediction } from "@/lib/utils"

export function CashFlowPrediction() {
    const { transactions } = useFinancial()

    // 1. Detect recurring patterns
    const patterns = useMemo(() => detectRecurringTransactions(transactions), [transactions])

    // 2. Calculate current balance (simplified for this view)
    const currentBalance = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
        const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
        return income - expenses
    }, [transactions])

    // 3. Generate 4-week prediction
    const weeks = useMemo(() => calculateCashFlowPrediction(currentBalance, patterns), [currentBalance, patterns])

    // 4. Find potential liquidity issues
    const negativeWeek = weeks.find(w => w.balance < 0)
    const totalIncome = weeks.reduce((acc, w) => acc + w.income, 0)
    const totalExpenses = weeks.reduce((acc, w) => acc + w.expenses, 0)

    // Significant future events (from patterns)
    const largeEvents = patterns
        .filter(p => p.amount > 5000)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {weeks.map((week) => (
                    <Card key={week.id} className={`border-l-4 ${week.balance >= 0 ? 'border-l-emerald-500' : 'border-l-red-500'} bg-card/50 backdrop-blur`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                {week.range}
                                {week.balance >= 0 ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(week.balance)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Ingresos: {formatCurrency(week.income)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Gastos: {formatCurrency(week.expenses)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-indigo-500" />
                            Análisis de Pronóstico
                        </CardTitle>
                        <CardDescription>
                            Proyección basada en tus patrones recurrentes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {negativeWeek ? (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Alerta de Liquidez - {negativeWeek.range.split(' ')[0]} {negativeWeek.range.split(' ')[1]}</AlertTitle>
                                <AlertDescription>
                                    Tu balance estimado caerá por debajo de cero ({formatCurrency(negativeWeek.balance)}) debido a gastos programados que superan tus ingresos proyectados.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                                <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                                    ¡Flujo saludable! Tus proyecciones se mantienen positivas para las próximas 4 semanas.
                                </p>
                            </div>
                        )}

                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Recomendación del Coach</h4>
                            <p className="text-sm text-indigo-800 dark:text-indigo-200">
                                {negativeWeek
                                    ? `Para evitar el déficit en la ${negativeWeek.range.split(' ')[1]}, intenta reservar ${formatCurrency(Math.abs(negativeWeek.balance))} de semanas anteriores o reducir gastos no esenciales.`
                                    : `Continúa manteniendo este ritmo. Es un buen momento para asignar el excedente proyectado de ${weeks[3]?.balance !== undefined ? formatCurrency(weeks[3].balance) : '$0'} a tus metas de ahorro o pago de deudas.`
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Próximos Grandes Eventos</CardTitle>
                        <CardDescription>Eventos recurrentes detectados</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {largeEvents.length > 0 ? largeEvents.map((event, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${event.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span>{event.description}</span>
                                </div>
                                <span className="font-mono">{formatCurrency(event.amount)}</span>
                            </div>
                        )) : (
                            <p className="text-xs text-muted-foreground text-center py-4">No se detectaron grandes eventos recurrentes aún.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
