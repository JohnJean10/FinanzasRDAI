// === ACCOUNT TYPES ===
export type AccountType = 'cash' | 'bank' | 'credit' | 'investment' | 'wallet';
export type AccountBrand = 'visa' | 'mastercard' | 'popular' | 'banreservas' | 'bhd' | 'scotiabank' | 'apap' | 'other';

export interface Account {
    id: string;
    name: string;                    // Ej: 'Popular Nómina', 'Visa BHD'
    type: AccountType;
    balance: number;                 // Saldo actual. En crédito = lo consumido (deuda)
    limit?: number;                  // Solo crédito: Límite total
    currency: 'DOP' | 'USD';
    brand?: AccountBrand;            // Para logo/icono del banco o tarjeta
    icon?: string;                   // Emoji alternativo
    isDefault?: boolean;             // Cuenta por defecto para transacciones

    // Investment/Savings specific fields
    interestRate?: number;           // Tasa de interés anual (%)
    maturityDate?: string;           // Fecha de vencimiento (ISO) - para certificados
    investmentType?: 'certificate' | 'savings' | 'stocks' | 'mutual_fund' | 'other'; // Subtipo
}

// === TRANSACTION TYPES ===
export interface Transaction {
    id: number;
    type: 'income' | 'expense' | 'saving' | 'transfer';
    description: string;
    amount: number;
    budgetId?: string | null; // Links to BudgetConfig.id
    category?: string; // Legacy - will be migrated
    date: string;
    accountId: string;               // MANDATORY: Links to Account.id
    account?: string;                // Legacy field for migration
    fromAccountId?: string;          // For transfers: source account
    isRecurring?: boolean;
    frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
    nextPaymentDate?: string;
    subscriptionName?: string;
    goalId?: number; // Added to link saving to a goal
}

export interface BudgetConfig {
    id: string;
    name: string; // Display name (e.g., "Comida")
    category: string; // Normalized key (e.g., "alimentacion")
    icon: string; // Emoji icon
    limit: number;
    alerts?: number[]; // Percentages to trigger alerts
}

export interface Goal {
    id: number;
    name: string;
    target: number;
    current: number;
    deadline: string;
    icon: string;
    monthlyContribution?: number; // Calculated monthly amount needed
    isLinkedToBudget?: boolean; // Toggle to reserve this amount in budget
    isNative?: boolean; // System goal (e.g., Emergency Fund)
    priority?: 'alta' | 'media' | 'baja';
}
// Deudas y Pasivos
export type DebtType = 'credit_card' | 'loan' | 'informal'; // Tarjeta, Préstamo, Prestamista

export type PaymentFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface Debt {
    id: string;
    type: DebtType;
    name: string;
    currentBalance: number;
    interestRate: number;
    minPayment: number;
    paymentFrequency?: PaymentFrequency; // Default to monthly if undefined
    category: string; // 'debt'

    // Específico de Tarjetas
    creditLimit?: number;
    overdraftLimit?: number;
    cutoffDay?: number; // Día de corte
    paymentDay?: number; // Día límite de pago (o día de pago para préstamos)
    availableBalance?: number;

    // Específico de Préstamos
    endDate?: string; // Fecha fin acuerdo
    isAmortized?: boolean; // True = Banco, False = Prestamista (solo interés)

    // Link to Account (for credit cards synced from Accounts module)
    linkedAccountId?: string;
}

export type TimeRange =
    | 'thisMonth'    // Mes Actual
    | 'lastMonth'    // Mes Anterior
    | 'last3Months'  // Trimestral (Rolling)
    | 'last4Months'  // Cuatrimestral (Rolling) - ¡Pedido especial!
    | 'last6Months'  // Semestral (Rolling)
    | 'last12Months' // Anual (Rolling)
    | 'ytd'          // Year to Date (Desde Enero 1)
    | 'all';         // Histórico completo

export interface UserProfile {
    name: string;
    monthlyIncome: number;
    monthsOfPeace?: number; // Desired coverage for Emergency Fund (default 3)
    profile: 'Basico' | 'Premium';
    hasCompletedOnboarding: boolean;
    currency: 'DOP' | 'USD';
    language: 'es' | 'en';
    notifications: {
        budgetAlerts: boolean;
        goalAchievements: boolean;
        debtReminders: boolean;
    };
    aiLearnedFacts?: string[]; // Memory of user preferences
}

import { Notification } from '../services/notifications';

export interface AppData {
    user: UserProfile;
    accounts: Account[];             // NEW: Bank accounts, cards, wallets
    transactions: Transaction[];
    budgetConfigs: BudgetConfig[];
    goals: Goal[];
    debts: Debt[];
    notifications: Notification[];
}
