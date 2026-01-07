"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinancial } from "@/lib/context/financial-context"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet, PiggyBank, Percent } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function KPIGrid() {
    const { metrics } = useFinancial()

    // Cálculo del porcentaje de progreso global de ahorros
    const savingsProgress = metrics.totalGoalsTarget > 0
        ? (metrics.totalSavings / metrics.totalGoalsTarget) * 100
        : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* 1. DISPONIBLE PARA USAR (La métrica reina) */}
            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Disponible para usar
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(metrics.availableBalance)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Libre de compromisos y ahorros
                    </p>
                </CardContent>
            </Card>

            {/* 2. BALANCE TOTAL (Bancario) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Balance Total (Bancos)
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(metrics.balance)}
                    </div>
                </CardContent>
            </Card>

            {/* 3. AHORROS (Progreso Global) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Ahorros Acumulados
                    </CardTitle>
                    <PiggyBank className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mb-2">
                        {formatCurrency(metrics.totalSavings)}
                    </div>
                    {/* Barra de Progreso */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-semibold">
                            <span>Progreso Global</span>
                            <span>{savingsProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={savingsProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right pt-1">
                            Meta: {formatCurrency(metrics.totalGoalsTarget)}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 4. RELACIÓN INGRESOS-GASTOS (Antes % Ahorro) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Relación Ingresos-Gastos
                    </CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${metrics.savingsRate >= 20 ? 'text-green-600' : metrics.savingsRate > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                        {metrics.savingsRate.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {metrics.savingsRate >= 0
                            ? "Del ingreso retenido este periodo"
                            : "Estás gastando más de lo que ingresas"}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
