"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowRight } from "lucide-react"
import { debtEliminationEducation } from "@/lib/data/education-templates"
import { formatCurrency } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

import { Debt } from "@/lib/types"

interface DebtEliminationProps {
    initialDebts?: Debt[]
}

export function DebtElimination({ initialDebts = [] }: DebtEliminationProps) {
    const [debts, setDebts] = useState<Debt[]>(initialDebts)
    const [newDebt, setNewDebt] = useState<Partial<Debt>>({})
    const [extraPayment, setExtraPayment] = useState<number>(0)
    const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball')

    const addDebt = () => {
        if (newDebt.name && newDebt.currentBalance && newDebt.interestRate && newDebt.minPayment) {
            setDebts([...debts, { ...newDebt, id: Date.now() } as Debt])
            setNewDebt({})
        }
    }

    const removeDebt = (id: number) => {
        setDebts(debts.filter(d => d.id !== id))
    }

    const sortDebts = (debts: Debt[]) => {
        return [...debts].sort((a, b) => {
            if (strategy === 'snowball') return a.currentBalance - b.currentBalance
            return b.interestRate - a.interestRate
        })
    }

    const orderedDebts = sortDebts(debts)
    const totalBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0)
    const totalMinPayment = debts.reduce((sum, d) => sum + d.minPayment, 0)

    // Simple calculation for demo purposes (real calculation would require amortization schedule)
    const calculatePayoffMonths = () => {
        if (totalMinPayment + extraPayment <= 0) return 0
        // Rough estimate ignoring compound interest reduction for simplicity in this MVP view
        // A real implementation would simulate month-by-month payment application
        return Math.ceil(totalBalance / (totalMinPayment + extraPayment))
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1 border-red-100/20 dark:border-red-800/20 bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-red-900 dark:text-red-100">
                        Calculadora de Deudas
                    </CardTitle>
                    <CardDescription>
                        Define tu estrategia para salir de deudas
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <h4 className="text-sm font-medium">Agregar Deuda</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Nombre (ej: Tarjeta)"
                                value={newDebt.name || ''}
                                onChange={e => setNewDebt({ ...newDebt, name: e.target.value })}
                            />
                            <Input
                                type="number"
                                placeholder="Saldo"
                                value={newDebt.currentBalance || ''}
                                onChange={e => setNewDebt({ ...newDebt, currentBalance: parseFloat(e.target.value) })}
                            />
                            <Input
                                type="number"
                                placeholder="Tasa % Anual"
                                value={newDebt.interestRate || ''}
                                onChange={e => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) })}
                            />
                            <Input
                                type="number"
                                placeholder="Pago Mínimo"
                                value={newDebt.minPayment || ''}
                                onChange={e => setNewDebt({ ...newDebt, minPayment: parseFloat(e.target.value) })}
                            />
                        </div>
                        <Button onClick={addDebt} className="w-full" disabled={!newDebt.name || !newDebt.currentBalance}>
                            <Plus className="mr-2 h-4 w-4" /> Agregar Deuda
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Tus Deudas ({debts.length})</h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {orderedDebts.map((debt, index) => (
                                <div key={debt.id} className="flex items-center justify-between p-3 bg-card border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="font-mono">{index + 1}</Badge>
                                        <div>
                                            <p className="font-medium">{debt.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(debt.currentBalance)} • {debt.interestRate}%
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeDebt(debt.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground animate-in text-red-500 hover:text-red-600" />
                                    </Button>
                                </div>
                            ))}
                            {debts.length === 0 && (
                                <p className="text-sm text-center text-muted-foreground py-4">No hay deudas registradas.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-1 border-red-100/20 dark:border-red-800/20 bg-card/50 backdrop-blur h-full flex flex-col">
                <Tabs defaultValue="strategy" className="w-full flex-1 flex flex-col">
                    <div className="px-6 pt-6">
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="strategy">Estrategia</TabsTrigger>
                            <TabsTrigger value="education">Guía</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="strategy" className="flex-1 p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Estrategia Preferida</label>
                                <Select value={strategy} onValueChange={(val: any) => setStrategy(val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="snowball">Bola de Nieve (Menor saldo primero)</SelectItem>
                                        <SelectItem value="avalanche">Avalancha (Mayor tasa primero)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {strategy === 'snowball'
                                        ? "Ideal para mantener motivación viendo deudas desaparecer rápido."
                                        : "Matemáticamente superior, ahorras más intereses a largo plazo."
                                    }
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pago Extra Mensual (Planifiestord)</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={extraPayment || ''}
                                    onChange={e => setExtraPayment(parseFloat(e.target.value))}
                                />
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg space-y-3">
                                <h4 className="font-semibold text-red-700 dark:text-red-300">Resumen del Plan</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Deuda Total</p>
                                        <p className="font-bold text-lg">{formatCurrency(totalBalance)}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Tiempo Estimado</p>
                                        <p className="font-bold text-lg">~{calculatePayoffMonths()} meses</p>
                                    </div>
                                </div>
                                {extraPayment > 0 && (
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                        <ArrowRight className="h-3 w-3" />
                                        Estás acelerando tu libertad con {formatCurrency(extraPayment)} extra!
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="education" className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <ReactMarkdown>{debtEliminationEducation.replace(/\[nombre\]/g, "Usuario")}</ReactMarkdown>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}
