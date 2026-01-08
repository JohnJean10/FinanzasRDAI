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
import { Plus, Trash2, TrendingDown, Target, ShieldAlert, CreditCard, Banknote, Calendar, Edit2, Wallet, Clock, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { formatCurrency, calculateRealInterestRate } from "@/lib/utils"
import { Debt, DebtType, PaymentFrequency } from "@/lib/types"
import { Calculator } from "lucide-react"

// --- COMPONENTE CALCULADORA DE TASA ---
const RateCalculator = ({ onCalculate }: { onCalculate: (rate: number) => void }) => {
    const [open, setOpen] = useState(false)
    const [principal, setPrincipal] = useState("")
    const [payment, setPayment] = useState("")
    const [periods, setPeriods] = useState("")
    const [frequency, setFrequency] = useState("30") // 30=Mensual default

    const handleCalculate = () => {
        const rate = calculateRealInterestRate(
            Number(principal),
            Number(payment),
            Number(periods),
            Number(frequency)
        )
        onCalculate(rate)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                    <Calculator className="h-3 w-3" /> Calcular Tasa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>Calculadora de Interés Real 🕵️‍♂️</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-1">
                        <Label className="text-xs">Monto Recibido (Prestado)</Label>
                        <Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="Ej: 10000" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Cuota a Pagar</Label>
                        <Input type="number" value={payment} onChange={e => setPayment(e.target.value)} placeholder="Ej: 2200" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Cada cuánto tiempo?</Label>
                        <Select value={frequency} onValueChange={setFrequency}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Semanal (7 días)</SelectItem>
                                <SelectItem value="15">Quincenal (15 días)</SelectItem>
                                <SelectItem value="30">Mensual (30 días)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Número de Cuotas</Label>
                        <Input type="number" value={periods} onChange={e => setPeriods(e.target.value)} placeholder="Ej: 12" />
                    </div>
                    <Button onClick={handleCalculate} className="w-full mt-2" disabled={!principal || !payment || !periods}>
                        Calcular e Insertar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// --- COMPONENTE DE FORMULARIO MEJORADO ---
interface DebtFormProps {
    formData: Partial<Debt>;
    setFormData: (data: Partial<Debt>) => void;
}

const DebtForm = ({ formData, setFormData }: DebtFormProps) => {
    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label>Tipo de Deuda</Label>
                    <Select
                        value={formData.type || 'credit_card'}
                        onValueChange={(v) => setFormData({ ...formData, type: v as DebtType })}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="credit_card">💳 Tarjeta de Crédito</SelectItem>
                            <SelectItem value="loan">🏦 Préstamo Bancario / Financiamiento</SelectItem>
                            <SelectItem value="informal">🤝 Préstamo Informal / Acuerdo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-2">
                    <Label>Nombre / Referencia</Label>
                    <Input
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder={formData.type === 'informal' ? "Ej: Acuerdo Pasola" : "Ej: Préstamo Popular"}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Saldo Actual</Label>
                    <Input
                        type="number"
                        value={formData.currentBalance || ''}
                        onChange={e => setFormData({ ...formData, currentBalance: Number(e.target.value) })}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Tasa Anual Real (%)</Label>
                        <RateCalculator onCalculate={(rate) => setFormData({ ...formData, interestRate: rate })} />
                    </div>
                    <Input
                        type="number"
                        value={formData.interestRate || ''}
                        onChange={e => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                        placeholder="Ej: 60"
                    />
                </div>

                {/* SECCIÓN DE PAGOS */}
                <div className="col-span-2 grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border">
                    <div className="space-y-2">
                        <Label>{formData.type === 'credit_card' ? 'Pago Mínimo' : 'Monto Cuota'}</Label>
                        <Input
                            type="number"
                            value={formData.minPayment || ''}
                            onChange={e => setFormData({ ...formData, minPayment: Number(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Frecuencia</Label>
                        <Select
                            value={formData.paymentFrequency || 'monthly'}
                            onValueChange={(v) => setFormData({ ...formData, paymentFrequency: v as PaymentFrequency })}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Mensual (x1)</SelectItem>
                                <SelectItem value="biweekly">Quincenal (x2)</SelectItem>
                                <SelectItem value="weekly">Semanal (x4)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* CAMPOS ESPECÍFICOS DE TARJETA */}
                {formData.type === 'credit_card' && (
                    <>
                        <div className="space-y-2">
                            <Label>Límite Crédito</Label>
                            <Input type="number" value={formData.creditLimit || ''} onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-blue-600 dark:text-blue-400">Límite Sobregiro</Label>
                            <Input type="number" value={formData.overdraftLimit || ''} onChange={e => setFormData({ ...formData, overdraftLimit: Number(e.target.value) })} placeholder="Opcional" />
                        </div>
                        <div className="space-y-2">
                            <Label>Día Corte</Label>
                            <Input type="number" max={31} value={formData.cutoffDay || ''} onChange={e => setFormData({ ...formData, cutoffDay: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Día Pago</Label>
                            <Input type="number" max={31} value={formData.paymentDay || ''} onChange={e => setFormData({ ...formData, paymentDay: Number(e.target.value) })} />
                        </div>
                    </>
                )}

                {/* CAMPOS ESPECÍFICOS DE PRÉSTAMO (AHORA CON DÍA DE PAGO) */}
                {(formData.type === 'loan' || formData.type === 'informal') && (
                    <>
                        <div className="space-y-2">
                            <Label className="text-emerald-600 dark:text-emerald-400 font-semibold">Día de Pago (Mensual)</Label>
                            <Input
                                type="number" min={1} max={31}
                                placeholder="Ej: 15 o 30"
                                value={formData.paymentDay || ''} // Reusamos paymentDay para préstamos
                                onChange={e => setFormData({ ...formData, paymentDay: Number(e.target.value) })}
                            />
                            <p className="text-[10px] text-muted-foreground">Día del mes que toca la cuota</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha Final (Vencimiento)</Label>
                            <Input
                                type="date"
                                value={formData.endDate || ''}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// --- PÁGINA PRINCIPAL ---
export default function DebtPage() {
    const { debts, addDebt, deleteDebt, updateDebt, payDebt } = useFinancial()

    // Estados UI
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isPayOpen, setIsPayOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
    const [paymentAmount, setPaymentAmount] = useState("")
    const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball')

    // Estado Formulario
    const [formData, setFormData] = useState<Partial<Debt>>({
        type: 'credit_card',
        name: "",
        currentBalance: 0,
        interestRate: 0,
        minPayment: 0,
        paymentFrequency: 'monthly',
        creditLimit: 0,
        overdraftLimit: 0,
        cutoffDay: 1,
        paymentDay: 15,
        endDate: "",
        isAmortized: true
    })

    // --- CÁLCULO DE FECHAS DE PAGO (PARA TODOS LOS TIPOS) ---
    const getNextPaymentDate = (debt: Debt) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const dayOfPayment = debt.paymentDay || 30; // Default a fin de mes si no hay día

        // 1. Calcular Próxima Fecha
        let nextDate = new Date(currentYear, currentMonth, dayOfPayment);

        // Si el día ya pasó, pasamos al próximo mes
        if (nextDate < today) {
            nextDate.setMonth(currentMonth + 1);
        }

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isUrgent = daysUntil <= 5 && daysUntil >= 0;

        return {
            label: nextDate.toLocaleDateString('es-DO', options), // "15 feb."
            daysUntil,
            isUrgent,
            rawDate: nextDate
        };
    }

    // --- CÁLCULO ESPECÍFICO TARJETAS (CORTE + PAGO) ---
    const getCardDates = (debt: Debt) => {
        const paymentInfo = getNextPaymentDate(debt);

        // Calcular Corte asociado (usualmente mes anterior si PAGO < CORTE)
        const cutoffDay = debt.cutoffDay || 1;
        let cutoffDate = new Date(paymentInfo.rawDate.getFullYear(), paymentInfo.rawDate.getMonth(), cutoffDay);

        if ((debt.paymentDay || 15) < cutoffDay) {
            cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        }

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

        return {
            ...paymentInfo,
            cutoffLabel: cutoffDate.toLocaleDateString('es-DO', options)
        };
    }

    // --- CÁLCULO DE IMPACTO MENSUAL ---
    const calculateMonthlyImpact = (debt: Debt) => {
        const amount = debt.minPayment;
        switch (debt.paymentFrequency) {
            case 'weekly': return amount * 4;
            case 'biweekly': return amount * 2;
            default: return amount;
        }
    }

    const totalMonthlyCommitment = debts.reduce((acc, d) => acc + calculateMonthlyImpact(d), 0);

    // Estrategia Ordenamiento
    const sortedDebts = [...debts].sort((a, b) => {
        if (strategy === 'snowball') return a.currentBalance - b.currentBalance;
        return b.interestRate - a.interestRate;
    })

    // Manejadores
    const handleOpenAdd = () => {
        setFormData({
            type: 'credit_card', name: "", currentBalance: 0, interestRate: 0, minPayment: 0,
            paymentFrequency: 'monthly', creditLimit: 0, overdraftLimit: 0, paymentDay: 15
        });
        setIsAddOpen(true);
    }

    const handleOpenEdit = (debt: Debt) => {
        setFormData(debt);
        setSelectedDebt(debt);
        setIsEditOpen(true);
    }

    const handleOpenPay = (debt: Debt) => {
        setSelectedDebt(debt);
        setPaymentAmount("");
        setIsPayOpen(true);
    }

    const handleSave = () => {
        const debtPayload = {
            ...formData,
            currentBalance: Number(formData.currentBalance),
            interestRate: Number(formData.interestRate),
            minPayment: Number(formData.minPayment),
            creditLimit: Number(formData.creditLimit || 0),
            overdraftLimit: Number(formData.overdraftLimit || 0),
            paymentDay: Number(formData.paymentDay || 0), // Guardamos el día para todos
            category: 'debt'
        } as Omit<Debt, 'id'>

        if (isEditOpen && selectedDebt) {
            updateDebt(selectedDebt.id, debtPayload);
            setIsEditOpen(false);
        } else {
            addDebt(debtPayload);
            setIsAddOpen(false);
        }
    }

    const handlePayment = () => {
        if (selectedDebt && paymentAmount) {
            payDebt(selectedDebt.id, parseFloat(paymentAmount));
            setIsPayOpen(false);
        }
    }

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto pb-24">

            {/* Header & Stats Rápidas */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Centro de Deudas</h1>
                    <p className="text-muted-foreground">Gestiona tus pasivos y ejecuta tu plan de salida.</p>
                </div>
                <div className="flex gap-4">
                    {/* Tarjeta Resumen Rápido */}
                    <div className="hidden md:block bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border">
                        <p className="text-xs text-muted-foreground">Compromiso Mensual Total</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(totalMonthlyCommitment)}</p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleOpenAdd}>
                                <Plus className="mr-2 h-4 w-4" /> Nueva Deuda
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Registrar Obligación</DialogTitle>
                            </DialogHeader>
                            <DebtForm formData={formData} setFormData={setFormData} />
                            <DialogFooter>
                                <Button onClick={handleSave}>Guardar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Selector de Estrategia */}
            <div className="flex flex-col gap-4">
                <Tabs value={strategy} onValueChange={(v) => setStrategy(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="snowball">Bola de Nieve ❄️</TabsTrigger>
                        <TabsTrigger value="avalanche">Avalancha 🏔️</TabsTrigger>
                    </TabsList>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sortedDebts.map((debt, index) => {
                            const totalLimit = (debt.creditLimit || 0) + (debt.overdraftLimit || 0);
                            const available = totalLimit - debt.currentBalance;
                            const progress = totalLimit > 0 ? (debt.currentBalance / totalLimit) * 100 : 100;

                            // Lógica de Fechas Inteligente (Universal)
                            const paymentInfo = debt.type === 'credit_card'
                                ? getCardDates(debt)
                                : (debt.paymentDay ? getNextPaymentDate(debt) : null);

                            const freqLabel = { monthly: '/mes', biweekly: '/quincena', weekly: '/semana' }[debt.paymentFrequency || 'monthly'];

                            return (
                                <Card key={debt.id} className="relative overflow-hidden group border-l-4 border-l-red-500 hover:shadow-lg transition-all">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Badge variant={index === 0 ? "destructive" : "secondary"}>#{index + 1}</Badge>
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
                                            {debt.type === 'credit_card' && totalLimit > 0
                                                ? <span className="text-emerald-600 font-medium">Disp: {formatCurrency(available)}</span>
                                                : `Tasa Real: ${debt.interestRate}%`
                                            }
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Saldo Pendiente</p>
                                                <p className="text-2xl font-bold text-red-600">{formatCurrency(debt.currentBalance)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Cuota</p>
                                                <p className="font-semibold">{formatCurrency(debt.minPayment)}<span className="text-xs text-muted-foreground">{freqLabel}</span></p>
                                            </div>
                                        </div>

                                        {/* PANEL DE ALERTAS Y FECHAS */}
                                        <div className={`flex flex-col gap-1 text-xs p-2 rounded border ${paymentInfo?.isUrgent
                                            ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:border-red-900"
                                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {debt.type === 'credit_card' ? (
                                                    // Layout Tarjeta
                                                    <>
                                                        <Calendar className="h-3 w-3" />
                                                        <div className="flex justify-between w-full">
                                                            <span>Corte: <strong>{(paymentInfo as any)?.cutoffLabel}</strong></span>
                                                            <span>Pago: <strong>{paymentInfo?.label}</strong></span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    // Layout Préstamo
                                                    <>
                                                        <Clock className="h-3 w-3" />
                                                        <div className="flex justify-between w-full">
                                                            {paymentInfo ? (
                                                                <span>Próximo Pago: <strong>{paymentInfo.label}</strong></span>
                                                            ) : (
                                                                <span>Vencimiento Final: <strong>{debt.endDate || 'N/A'}</strong></span>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Mensaje de Urgencia */}
                                            {paymentInfo?.isUrgent && (
                                                <div className="font-bold flex items-center gap-1 mt-1 animate-pulse">
                                                    <AlertCircle className="h-3 w-3" />
                                                    ¡Atención! Faltan {paymentInfo.daysUntil} días.
                                                </div>
                                            )}
                                        </div>

                                        <Progress value={progress} className="h-2" indicatorColor="bg-red-500" />

                                        <div className="flex gap-2">
                                            <Button className="w-full" variant="default" onClick={() => handleOpenPay(debt)}>Registrar Pago</Button>
                                            <Button variant="outline" size="icon" onClick={() => deleteDebt(debt.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </Tabs>
            </div>

            {/* MODALES DE ACCIÓN */}
            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Registrar Abono</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">Abonando a: <span className="font-bold">{selectedDebt?.name}</span></p>
                        <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} autoFocus placeholder="Monto" />
                    </div>
                    <DialogFooter><Button onClick={handlePayment} className="w-full bg-emerald-600">Confirmar</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Editar Deuda</DialogTitle></DialogHeader>
                    <DebtForm formData={formData} setFormData={setFormData} />
                    <DialogFooter><Button onClick={handleSave}>Actualizar</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
