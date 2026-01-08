"use client"

import { useState } from "react"
import { useFinancial } from "@/lib/context/financial-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, TrendingDown, Target, ShieldAlert } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

export default function DebtPage() {
    const { debts, addDebt, deleteDebt } = useFinancial()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Estado del formulario nuevo
    const [newDebt, setNewDebt] = useState({
        name: "",
        currentBalance: "",
        interestRate: "",
        minPayment: ""
    })

    // 1. Cálculos Globales (Para las tarjetas de resumen)
    const totalDebt = debts.reduce((acc, d) => acc + d.currentBalance, 0)
    const totalMonthlyPayment = debts.reduce((acc, d) => acc + d.minPayment, 0)

    // Simulación simple de fecha libre (Mejoraremos esto con la calculadora real después)
    // Asumiendo que pagas el mínimo + 10% extra
    const monthsToFreedom = totalMonthlyPayment > 0 ? Math.ceil(totalDebt / (totalMonthlyPayment * 1.1)) : 0

    const handleAdd = () => {
        addDebt({
            name: newDebt.name,
            currentBalance: Number(newDebt.currentBalance),
            interestRate: Number(newDebt.interestRate),
            minPayment: Number(newDebt.minPayment),
            category: 'debt'
        })
        setIsDialogOpen(false)
        setNewDebt({ name: "", currentBalance: "", interestRate: "", minPayment: "" })
    }

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">

            {/* ENCABEZADO: Inspirador, no aburrido */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Plan de Libertad</h1>
                    <p className="text-muted-foreground">Tu estrategia para eliminar deudas y recuperar tu flujo de efectivo.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20">
                            <Plus className="mr-2 h-4 w-4" /> Registrar Deuda
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <DialogHeader>
                            <DialogTitle>Nueva Obligación Financiera</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombre (Ej: Visa BHD)</Label>
                                    <Input value={newDebt.name} onChange={e => setNewDebt({ ...newDebt, name: e.target.value })} className="bg-slate-50 dark:bg-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Saldo Actual</Label>
                                    <Input type="number" value={newDebt.currentBalance} onChange={e => setNewDebt({ ...newDebt, currentBalance: e.target.value })} className="bg-slate-50 dark:bg-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tasa Interés Anual (%)</Label>
                                    <Input type="number" value={newDebt.interestRate} onChange={e => setNewDebt({ ...newDebt, interestRate: e.target.value })} className="bg-slate-50 dark:bg-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Pago Mínimo Mensual</Label>
                                    <Input type="number" value={newDebt.minPayment} onChange={e => setNewDebt({ ...newDebt, minPayment: e.target.value })} className="bg-slate-50 dark:bg-slate-800" />
                                </div>
                            </div>
                            <Button onClick={handleAdd} className="w-full bg-slate-900 dark:bg-indigo-600 text-white">Guardar Deuda</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* RESUMEN DE IMPACTO (KPIS) */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Deuda Total</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalDebt)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Dinero que no te pertenece</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Compromiso Mensual</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalMonthlyPayment)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Pago mínimo obligatorio</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Libertad Estimada</CardTitle>
                        <Target className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">~ {monthsToFreedom} Meses</div>
                        <p className="text-xs text-muted-foreground mt-1">Si mantienes el ritmo actual</p>
                    </CardContent>
                </Card>
            </div>

            {/* SELECCIÓN DE ESTRATEGIA (Tabs visuales) */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Tu Estrategia de Ataque</h2>
                <Tabs defaultValue="snowball" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-slate-100 dark:bg-slate-800">
                        <TabsTrigger value="snowball" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">Bola de Nieve ❄️</TabsTrigger>
                        <TabsTrigger value="avalanche" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">Avalancha 🏔️</TabsTrigger>
                    </TabsList>
                    <TabsContent value="snowball" className="mt-4">
                        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30">
                            <CardContent className="pt-6">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    <strong>Enfoque Psicológico:</strong> Ordenaremos tus deudas de la más pequeña a la más grande.
                                    Eliminarás las pequeñas rápido para ganar motivación. ¡Ideal para empezar!
                                </p>
                            </CardContent>
                        </Card>
                        {/* Aquí renderizaríamos la lista ordenada por saldo ascendente */}
                    </TabsContent>
                    <TabsContent value="avalanche" className="mt-4">
                        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30">
                            <CardContent className="pt-6">
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    <strong>Enfoque Matemático:</strong> Ordenaremos por tasa de interés (la más cara primero).
                                    Ahorrarás dinero en intereses a largo plazo, pero tardarás más en cerrar la primera deuda.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* LISTA DE TARJETAS DE DEUDA (No tabla) */}
            <div className="grid gap-4 md:grid-cols-2">
                {debts.map((debt) => (
                    <Card key={debt.id} className="relative overflow-hidden transition-all hover:shadow-md border-slate-200 dark:border-slate-800">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{debt.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                                            {debt.interestRate}% Tasa
                                        </span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => deleteDebt(debt.id)} className="text-slate-400 hover:text-red-500 h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Actual</span>
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(debt.currentBalance)}</span>
                                </div>
                                {/* Barra de progreso inversa: Muestra cuánto falta por pagar vs un total teórico */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase">
                                        <span>Mínimo: {formatCurrency(debt.minPayment)}</span>
                                        <span>Meta: RD$0</span>
                                    </div>
                                    <Progress value={100} className="h-2 bg-red-100 dark:bg-red-950/50 [&>div]:bg-red-500" />
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Registrar Pago
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Empty State */}
                {debts.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50">
                        <ShieldAlert className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No tienes deudas registradas.</p>
                        <p className="text-sm mt-1">¡Eso es genial! O quizás, aún no las has agregado.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
