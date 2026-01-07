"use client"

import { useMemo } from "react"
import { useFinancial } from "@/lib/context/financial-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, detectRecurringTransactions } from "@/lib/utils"
import { PlayCircle, PauseCircle, XCircle } from "lucide-react"
// Importamos la interfaz Transaction existente
import { Transaction } from "@/lib/types/index"

interface SubscriptionAnalysisProps {
    // Usamos el tipo correcto en lugar de any[]
    transactions: Transaction[];
}

export function SubscriptionAnalysis({ transactions }: SubscriptionAnalysisProps) {
    const { user } = useFinancial()

    // 1. Detect recurring expenses (explicit + inferred)
    const subscriptions = useMemo(() => {
        // A. Explicitly marked transactions
        const explicit = transactions
            .filter(t => t.isRecurring && t.type === 'expense')
            .reduce((acc, t) => {
                const key = t.subscriptionName || t.description;
                // Keep the most recent, or just one instance to represent the subscription
                if (!acc[key] || new Date(t.date) > new Date(acc[key].date)) {
                    acc[key] = t;
                }
                return acc;
            }, {} as Record<string, Transaction>) // Tipado explícito del acumulador

        // Forzamos el tipado en el map para evitar errores "unknown"
        const explicitList = Object.values(explicit).map((t: Transaction) => ({
            id: `explicit-${t.id}`,
            name: t.subscriptionName || t.description,
            cost: t.amount,
            usage: 3, // Mock usage
            status: 'active' as const,
            category: t.category,
            frequency: t.frequency || 'monthly'
        }))

        // B. Inferred from patterns
        const patterns = detectRecurringTransactions(transactions)
        const inferred = patterns
            .filter(p => p.type === 'expense' && p.frequency === 'monthly')
            .map((p, idx) => ({
                id: `inferred-${idx}`,
                name: p.description,
                cost: p.amount,
                usage: 3,
                status: 'active' as const,
                category: p.category,
                frequency: 'monthly'
            }))

        // Combine and deduplicate by name (Explicit takes precedence)
        // Usamos any temporalmente aquí para facilitar la mezcla de listas
        const combined: any[] = [...explicitList];
        inferred.forEach(inf => {
            if (!combined.find(e => e.name.toLowerCase() === inf.name.toLowerCase())) {
                combined.push(inf);
            }
        });

        return combined;
    }, [transactions])

    const getVerdict = (sub: any) => {
        if (sub.usage === 0) return { label: 'CANCELAR', color: 'bg-red-500', icon: XCircle }
        if (sub.usage < 2) return { label: 'EVALUAR', color: 'bg-amber-500', icon: PauseCircle }
        return { label: 'MANTENER', color: 'bg-emerald-500', icon: PlayCircle }
    }

    const potentialSavings = subscriptions
        .filter((s: any) => s.usage < 2 && s.status === 'active')
        .reduce((sum: number, s: any) => sum + s.cost, 0)

    const totalCost = subscriptions
        .filter((s: any) => s.status === 'active')
        .reduce((sum: number, s: any) => sum + s.cost, 0)

    const monthlyIncome = user.monthlyIncome || 50000

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Inventario de Suscripciones</CardTitle>
                    <CardDescription>
                        Detectadas automáticamente de tus transacciones mensuales
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead>Costo</TableHead>
                                    <TableHead>Frecuencia</TableHead>
                                    <TableHead>Veredicto</TableHead>
                                    <TableHead>Acción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.map((sub: any) => {
                                    const verdict = getVerdict(sub)
                                    // const Icon = verdict.icon // Icon no usado visualmente en la tabla por ahora
                                    return (
                                        <TableRow key={sub.id} className={sub.status !== 'active' ? 'opacity-50' : ''}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{sub.name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">{sub.category}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatCurrency(sub.cost)}</TableCell>
                                            <TableCell className="capitalize">{sub.frequency || 'Mensual'}</TableCell>
                                            <TableCell>
                                                <Badge className={`${verdict.color} hover:${verdict.color} text-[10px]`}>
                                                    {verdict.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {sub.status === 'active' && verdict.label !== 'MANTENER' && (
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 h-8 px-2">
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Detener
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {subscriptions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No se detectaron suscripciones recurrentes aún.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Ahorro Potencial</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-800 dark:text-emerald-100">
                            {formatCurrency(potentialSavings)}
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">por mes</p>
                        <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-700">
                            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
                                Impacto Anual: <span className="text-base font-bold">{formatCurrency(potentialSavings * 12)}</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Costo Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(totalCost)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Representa el {((totalCost / monthlyIncome) * 100).toFixed(1)}% de tus ingresos.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
