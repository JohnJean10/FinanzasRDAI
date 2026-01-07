import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
