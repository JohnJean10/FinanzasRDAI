import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transaction } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function calculatePeriodStats(transactions: any[], year: number, month: number) {
    const periodTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    const income = periodTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = periodTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    return {
        income,
        expenses,
        cashFlow: income - expenses,
        savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0
    };
}

export interface RecurringPattern {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    frequency: 'monthly' | 'quincenal';
    lastDate: string;
}

export function detectRecurringTransactions(transactions: any[]): RecurringPattern[] {
    const patterns: RecurringPattern[] = [];
    const grouped = transactions.reduce((acc, t) => {
        const key = `${t.description}-${t.type}-${t.category}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(t);
        return acc;
    }, {} as Record<string, any[]>);

    Object.entries(grouped).forEach(([_, txs]) => {
        const typedTxs = txs as any[];
        if (typedTxs.length >= 2) {
            // Check for monthly pattern (roughly 25-35 days apart) or quincenal (13-17 days)
            typedTxs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const d1 = new Date(typedTxs[0].date).getTime();
            const d2 = new Date(typedTxs[1].date).getTime();
            const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);

            if (diffDays >= 25 && diffDays <= 35) {
                patterns.push({
                    description: typedTxs[0].description,
                    amount: typedTxs[0].amount,
                    type: typedTxs[0].type,
                    category: typedTxs[0].category,
                    frequency: 'monthly',
                    lastDate: typedTxs[0].date
                });
            } else if (diffDays >= 13 && diffDays <= 17) {
                patterns.push({
                    description: typedTxs[0].description,
                    amount: typedTxs[0].amount,
                    type: typedTxs[0].type,
                    category: typedTxs[0].category,
                    frequency: 'quincenal',
                    lastDate: typedTxs[0].date
                });
            }
        }
    });

    return patterns;
}

export function calculateCashFlowPrediction(currentBalance: number, patterns: RecurringPattern[]) {
    const weeks = [];
    const today = new Date();
    let runningBalance = currentBalance;

    for (let i = 1; i <= 4; i++) {
        const start = new Date(today);
        start.setDate(today.getDate() + (i - 1) * 7);
        const end = new Date(today);
        end.setDate(today.getDate() + i * 7);

        let weekIncome = 0;
        let weekExpenses = 0;

        patterns.forEach(p => {
            const lastDate = new Date(p.lastDate);
            // Simple projection: if it happened 30 days ago (monthly) or 15 days ago (quincenal), it will happen again in this timeframe
            if (p.frequency === 'monthly') {
                const nextDate = new Date(lastDate);
                nextDate.setMonth(nextDate.getMonth() + 1);
                if (nextDate >= start && nextDate < end) {
                    if (p.type === 'income') weekIncome += p.amount;
                    else weekExpenses += p.amount;
                }
            } else if (p.frequency === 'quincenal') {
                const nextDate = new Date(lastDate);
                nextDate.setDate(nextDate.getDate() + 15);
                if (nextDate >= start && nextDate < end) {
                    if (p.type === 'income') weekIncome += p.amount;
                    else weekExpenses += p.amount;
                }
                const secondNextDate = new Date(nextDate);
                secondNextDate.setDate(secondNextDate.getDate() + 15);
                if (secondNextDate >= start && secondNextDate < end) {
                    if (p.type === 'income') weekIncome += p.amount;
                    else weekExpenses += p.amount;
                }
            }
        });

        runningBalance += (weekIncome - weekExpenses);

        weeks.push({
            id: i,
            range: `Semana ${i} (${start.getDate()}-${end.getDate()})`,
            income: weekIncome,
            expenses: weekExpenses,
            balance: runningBalance,
            status: runningBalance >= 0 ? 'positive' : 'negative'
        });
    }

    return weeks;
}

export function getBudgetMonthDate(dateStr: string, type: string) {
    const d = new Date(dateStr);
    // Rollover logic: If day is 31, count as next month
    if (d.getDate() === 31) {
        d.setDate(1);
        d.setMonth(d.getMonth() + 1);
    }
    return d;
}

export const processRecurringTransactions = (transactions: Transaction[]): { newTransactions: Transaction[], updatedBaseTransactions: Transaction[] } => {
    const today = new Date();
    const newTransactions: Transaction[] = [];
    // Deep copy segura
    const updatedBase = JSON.parse(JSON.stringify(transactions));
    let hasChanges = false;

    updatedBase.forEach((t: Transaction) => {
        // Validación estricta: Debe ser recurrente Y tener próxima fecha
        if (t.isRecurring && t.nextPaymentDate) {
            let nextDate = new Date(t.nextPaymentDate);

            // Si la fecha próxima ya pasó o es hoy, ¡A TRABAJAR!
            if (nextDate <= today) {
                console.log(`⚡ Procesando recurrencia para: ${t.description} (Tocaba: ${nextDate.toISOString().split('T')[0]})`);
                hasChanges = true;

                // Bucle para ponerse al día (por si pasaron 3 meses sin abrir la app)
                while (nextDate <= today) {
                    const nextDateISO = nextDate.toISOString();
                    const expectedDescription = `${t.description} (Auto)`;

                    // IDEMPOTENCY CHECK: Comprueba si YA existe una transacción generada para la misma fecha y descripción
                    // Revisamos tanto las transacciones existentes como las que acabamos de generar en este bucle
                    const alreadyExists = transactions.some(existing =>
                        existing.description === expectedDescription &&
                        Math.abs(existing.amount - t.amount) < 0.01 &&
                        existing.date.split('T')[0] === nextDateISO.split('T')[0]
                    ) || newTransactions.some(newTx =>
                        newTx.description === expectedDescription &&
                        Math.abs(newTx.amount - t.amount) < 0.01 &&
                        newTx.date.split('T')[0] === nextDateISO.split('T')[0]
                    );

                    if (!alreadyExists) {
                        const newTrans: Transaction = {
                            ...t,
                            id: Date.now() + Math.floor(Math.random() * 10000), // Numeric ID compatible
                            date: nextDateISO,
                            isRecurring: false, // La hija NO es recurrente, es un pago único
                            nextPaymentDate: undefined,
                            description: expectedDescription
                        };

                        newTransactions.push(newTrans);
                        console.log(`   -> Generada transacción para: ${newTrans.date.split('T')[0]}`);
                    } else {
                        console.log(`   ⚠️ Saltando duplicado para: ${nextDateISO.split('T')[0]}`);
                    }

                    // Calcular la SIGUIENTE fecha
                    // IMPORTANTE: Avanzamos la fecha SIEMPRE, incluso si saltamos la creación, para salir del bucle
                    switch (t.frequency) {
                        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
                        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
                        case 'biweekly': nextDate.setDate(nextDate.getDate() + 14); break;
                        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
                        case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
                        default: nextDate.setMonth(nextDate.getMonth() + 1);
                    }
                }

                // Actualizamos la transacción MADRE con la nueva fecha futura definitiva
                t.nextPaymentDate = nextDate.toISOString();
                console.log(`   -> Próximo cobro actualizado a: ${t.nextPaymentDate.split('T')[0]}`);
            }
        }
    });

    // Si no hubo cambios, devolvemos arrays vacíos para no renderizar
    if (!hasChanges) return { newTransactions: [], updatedBaseTransactions: [] };

    return { newTransactions, updatedBaseTransactions: updatedBase };
};
