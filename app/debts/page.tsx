"use client"

import { useState } from "react"
import { useFinancial } from "@/lib/context/financial-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, TrendingDown, Target, ShieldAlert, CreditCard, Banknote, Calendar, Edit2, Wallet } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { Debt, DebtType } from "@/lib/types"

export default function DebtPage() {
    const { debts, addDebt, deleteDebt, updateDebt, payDebt } = useFinancial()

    // Estados de UI
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isPayOpen, setIsPayOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
    const [paymentAmount, setPaymentAmount] = useState("")
    const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball')

    // Estado del formulario (Add/Edit)
    const [formData, setFormData] = useState<Partial<Debt>>({
        type: 'credit_card',
        name: "",
        currentBalance: 0,
        interestRate: 0,
        minPayment: 0,
        creditLimit: 0,
        cutoffDay: 1,
        paymentDay: 15,
        endDate: "",
        isAmortized: true
    })

    // --- LÓGICA DE ESTRATEGIA ---
    const sortedDebts = [...debts].sort((a, b) => {
        if (strategy === 'snowball') {
            // Bola de Nieve: Menor saldo primero
            return a.currentBalance - b.currentBalance
        } else {
            // Avalancha: Mayor interés primero
            return b.interestRate - a.interestRate
        }
    })

    // --- MANEJADORES ---
    const handleOpenAdd = () => {
        setFormData({ type: 'credit_card', name: "", currentBalance: 0, interestRate: 0, minPayment: 0 })
        setIsAddOpen(true)
    }

    const handleOpenEdit = (debt: Debt) => {
        setFormData(debt)
        setSelectedDebt(debt)
        setIsEditOpen(true)
    }

    const handleOpenPay = (debt: Debt) => {
        setSelectedDebt(debt)
        setPaymentAmount("")
        setIsPayOpen(true)
    }

    const handleSave = () => {
        const debtPayload = {
            ...formData,
            currentBalance: Number(formData.currentBalance),
            interestRate: Number(formData.interestRate),
            minPayment: Number(formData.minPayment),
            creditLimit: Number(formData.creditLimit || 0),
            category: 'debt'
        } as Omit<Debt, 'id'>

        if (isEditOpen && selectedDebt) {
            updateDebt(selectedDebt.id, debtPayload)
            setIsEditOpen(false)
        } else {
            addDebt(debtPayload)
            setIsAddOpen(false)
        }
    }

    const handlePayment = () => {
        if (selectedDebt && paymentAmount) {
            payDebt(selectedDebt.id, parseFloat(paymentAmount))
            setIsPayOpen(false)
        }
    }

    // --- COMPONENTE DE FORMULARIO REUTILIZABLE ---
    const DebtFormContent = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label>Tipo de Deuda</Label>
                    <Select
                        value={formData.type || 'credit_card'}
                        onValueChange={(v: string) => setFormData({ ...formData, type: v as DebtType })}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="credit_card">💳 Tarjeta de Crédito</SelectItem>
                            <SelectItem value="loan">🏦 Préstamo Bancario</SelectItem>
                            <SelectItem value="informal">🤝 Préstamo Informal / Prestamista</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-2">
                    <Label>Nombre / Banco</Label>
                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Visa Popular" />
                </div>

                <div className="space-y-2">
                    <Label>Saldo Actual (Deuda)</Label>
                    <Input type="number" value={formData.currentBalance} onChange={e => setFormData({ ...formData, currentBalance: Number(e.target.value) })} />
                </div>

                <div className="space-y-2">
                    <Label>Tasa Anual (%)</Label>
                    <Input type="number" value={formData.interestRate} onChange={e => setFormData({ ...formData, interestRate: Number(e.target.value) })} placeholder="60" />
                </div>

                <div className="space-y-2">
                    <Label>{formData.type === 'credit_card' ? 'Pago Mínimo' : 'Cuota Mensual'}</Label>
                    <Input type="number" value={formData.minPayment} onChange={e => setFormData({ ...formData, minPayment: Number(e.target.value) })} />
                </div>

                {/* CAMPOS ESPECÍFICOS DE TARJETA */}
                {formData.type === 'credit_card' && (
                    <>
                        <div className="space-y-2">
                            <Label>Límite de Crédito</Label>
                            <Input type="number" value={formData.creditLimit} onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Día de Corte</Label>
                            <Input type="number" max={31} value={formData.cutoffDay} onChange={e => setFormData({ ...formData, cutoffDay: Number(e.target.value) })} placeholder="Ej: 4" />
                        </div>
                        <div className="space-y-2">
                            <Label>Día Límite Pago</Label>
                            <Input type="number" max={31} value={formData.paymentDay} onChange={e => setFormData({ ...formData, paymentDay: Number(e.target.value) })} placeholder="Ej: 22" />
                        </div>
                    </>
                )}

                {/* CAMPOS ESPECÍFICOS DE PRÉSTAMO */}
                {(formData.type === 'loan' || formData.type === 'informal') && (
                    <div className="col-span-2 space-y-2">
                        <Label>Fecha Final (Estimada o Acuerdo)</Label>
                        <Input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                    </div>
                )}
            </div>
        </div>
    )

    // Cálculos Totales
    const totalDebt = debts.reduce((acc, d) => acc + d.currentBalance, 0)
    const totalMonthly = debts.reduce((acc, d) => acc + d.minPayment, 0)

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto pb-24">

            {/* Header y Botón Agregar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Centro de Deudas</h1>
                    <p className="text-muted-foreground">Gestiona tus pasivos y ejecuta tu plan de salida.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleOpenAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Nueva Deuda
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Nueva Obligación</DialogTitle>
                        </DialogHeader>
                        <DebtFormContent />
                        <DialogFooter>
                            <Button onClick={handleSave}>Guardar Deuda</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Selector de Estrategia */}
            <div className="flex flex-col gap-4">
                <Tabs value={strategy} onValueChange={(v) => setStrategy(v as any)} className="w-full">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">Estrategia de Ataque:</h2>
                        <TabsList>
                            <TabsTrigger value="snowball">Bola de Nieve ❄️</TabsTrigger>
                            <TabsTrigger value="avalanche">Avalancha 🏔️</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg border text-sm mb-6">
                        {strategy === 'snowball'
                            ? "🎯 Prioridad: Pagar la deuda más PEQUEÑA primero. Ideal para ganar motivación rápida."
                            : "🧠 Prioridad: Pagar la deuda con MAYOR TASA DE INTERÉS primero. Matemáticamente superior (ahorras dinero)."}
                    </div>

                    {/* LISTA DE DEUDAS ORDENADA */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sortedDebts.map((debt, index) => {
                            const progress = debt.creditLimit
                                ? (debt.currentBalance / debt.creditLimit) * 100
                                : 100; // Si no es tarjeta, asumimos full impact

                            return (
                                <Card key={debt.id} className="relative overflow-hidden group border-l-4 border-l-red-500 hover:shadow-lg transition-all">
                                    {/* Badge de Orden */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Badge variant={index === 0 ? "destructive" : "secondary"}>
                                            #{index + 1} en Lista
                                        </Badge>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenEdit(debt)}>
                                            <Edit2 className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            {debt.type === 'credit_card' ? <CreditCard className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
                                            {debt.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {debt.type === 'credit_card' && debt.creditLimit
                                                ? `Disp: ${formatCurrency(debt.creditLimit - debt.currentBalance)}`
                                                : `Tasa: ${debt.interestRate}% Anual`}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Saldo Pendiente</p>
                                                <p className="text-2xl font-bold text-red-600">{formatCurrency(debt.currentBalance)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Pago Mín/Cuota</p>
                                                <p className="font-semibold">{formatCurrency(debt.minPayment)}</p>
                                            </div>
                                        </div>

                                        {/* Fechas Importantes */}
                                        <div className="flex gap-2 text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                            <Calendar className="h-3 w-3 mt-0.5" />
                                            {debt.type === 'credit_card' ? (
                                                <span>Corte: Día {debt.cutoffDay} • Pago: Día {debt.paymentDay}</span>
                                            ) : (
                                                <span>Vencimiento: {debt.endDate || 'No definido'}</span>
                                            )}
                                        </div>

                                        <Progress value={progress} className="h-2" indicatorColor="bg-red-500" />

                                        <div className="flex gap-2">
                                            <Button className="w-full" variant="default" onClick={() => handleOpenPay(debt)}>
                                                Registrar Pago
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => deleteDebt(debt.id)}>
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </Tabs>
            </div>

            {/* MODAL DE PAGOS */}
            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Abono</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            Estás abonando a: <span className="font-bold text-foreground">{selectedDebt?.name}</span>
                        </p>
                        <div className="space-y-2">
                            <Label>Monto Pagado</Label>
                            <Input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handlePayment} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Confirmar Pago 🎉
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL DE EDICIÓN (Reutiliza el form) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Deuda</DialogTitle>
                    </DialogHeader>
                    <DebtFormContent />
                    <DialogFooter>
                        <Button onClick={handleSave}>Actualizar Cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}
