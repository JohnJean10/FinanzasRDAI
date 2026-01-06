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
    // Implement logic if needed here or in context
    // Placeholder based on legacy app.js logic
    return { income: 0, expenses: 0, cashFlow: 0, savingsRate: 0 };
}
