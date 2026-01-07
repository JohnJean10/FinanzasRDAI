export interface Transaction {
    id: number;
    type: 'income' | 'expense' | 'saving'; // Added 'saving'
    description: string;
    amount: number;
    category: string;
    date: string;
    account: string;
    isRecurring?: boolean;
    frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
    nextPaymentDate?: string;
    subscriptionName?: string;
    goalId?: number; // Added to link saving to a goal
}

export interface BudgetConfig {
    category: string;
    limit: number;
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
}

export interface Debt {
    id: number; // Added ID for better management
    name: string;
    balance: number;
    rate: number;
    minPayment: number;
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
}

import { Notification } from '../services/notifications';

export interface AppData {
    user: UserProfile;
    transactions: Transaction[];
    budgetConfigs: BudgetConfig[];
    goals: Goal[];
    debts: Debt[];
    notifications: Notification[];
}
