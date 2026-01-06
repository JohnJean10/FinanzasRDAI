"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Transaction, Goal, Debt, BudgetConfig } from '../types';
import { NotificationService, Notification } from '../services/notifications';

// Initial Mock Data
const INITIAL_DATA: AppData = {
    user: {
        name: 'Usuario Nuevo',
        monthlyIncome: 0,
        monthsOfPeace: 3, // Default
        profile: 'Basico',
        hasCompletedOnboarding: false,
        currency: 'DOP',
        language: 'es',
        notifications: {
            budgetAlerts: true,
            goalAchievements: true,
            debtReminders: true
        }
    },
    transactions: [],
    budgetConfigs: [],
    goals: [],
    debts: [],
    notifications: []
};

interface FinancialContextType extends AppData {
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: number) => void;
    updateTransaction: (id: number, updates: Partial<Transaction>) => void;
    addGoal: (g: Omit<Goal, 'id'>) => void;
    deleteGoal: (id: number) => void;
    updateGoal: (id: number, updates: Partial<Goal>) => void;
    updateUser: (u: Partial<AppData['user']>) => void;
    updateBudget: (category: string, limit: number) => void;
    addNotification: (n: Notification) => void;
    markNotificationRead: (id: string) => void;
    isTransactionModalOpen: boolean;
    openTransactionModal: () => void;
    closeTransactionModal: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AppData>(INITIAL_DATA);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const openTransactionModal = () => setIsTransactionModalOpen(true);
    const closeTransactionModal = () => setIsTransactionModalOpen(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('finanzasrd_data_v2');
        if (stored) {
            try {
                setData(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to load data", e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('finanzasrd_data_v2', JSON.stringify(data));
    }, [data]);

    // --- EMERGENCY FUND AUTO-SYNC ---
    useEffect(() => {
        const monthsOfPeace = data.user.monthsOfPeace || 3;

        // Calculate monthly expenses (Sum of all budgets EXCEPT 'ahorros')
        const monthlyExpenses = data.budgetConfigs
            .filter(b => b.category !== 'ahorros')
            .reduce((sum, b) => sum + b.limit, 0);

        const targetAmount = monthlyExpenses * monthsOfPeace;

        if (targetAmount > 0) {
            setData(prev => {
                const exists = prev.goals.find(g => g.isNative && g.name === 'Fondo de Emergencia');

                if (exists) {
                    // Only update if target changed significantly
                    if (Math.abs(exists.target - targetAmount) > 1) {
                        return {
                            ...prev,
                            goals: prev.goals.map(g => g.id === exists.id ? { ...g, target: targetAmount } : g)
                        };
                    }
                    return prev;
                } else {
                    // Create Native Goal
                    const newGoal: Goal = {
                        id: Date.now(),
                        name: 'Fondo de Emergencia',
                        current: 0,
                        target: targetAmount,
                        deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // 1 Year default
                        icon: '🛡️',
                        isNative: true,
                        isLinkedToBudget: true,
                        monthlyContribution: 0 // Will be calculated by user/system interaction later
                    };
                    return { ...prev, goals: [newGoal, ...prev.goals] };
                }
            });
        }
    }, [data.budgetConfigs, data.user.monthsOfPeace]);

    const addNotification = (n: Notification) => {
        setData(prev => ({ ...prev, notifications: [n, ...prev.notifications] }));
    };

    const markNotificationRead = (id: string) => {
        setData(prev => ({
            ...prev,
            notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }));
    };

    const addTransaction = (t: Omit<Transaction, 'id'>) => {
        const newTx = { ...t, id: Date.now() } as Transaction;

        // Trigger Budget Check
        if (t.type === 'expense') {
            const budget = data.budgetConfigs.find(b => b.category === t.category);
            if (budget) {
                const currentMonth = new Date().getMonth();
                const totalSpent = data.transactions
                    .filter(tx => tx.category === t.category && tx.type === 'expense' && new Date(tx.date).getMonth() === currentMonth)
                    .reduce((sum, tx) => sum + tx.amount, 0) + t.amount;

                const alert = NotificationService.checkBudgetThreshold(t.category, totalSpent, budget.limit);
                if (alert) {
                    addNotification(alert);
                }
            }
        }

        setData(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
    };

    const deleteTransaction = (id: number) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== id)
        }));
    };

    const updateTransaction = (id: number, updates: Partial<Transaction>) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
    };

    const addGoal = (g: Omit<Goal, 'id'>) => {
        const newGoal = { ...g, id: Date.now() } as Goal;
        setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
    };

    const deleteGoal = (id: number) => {
        setData(prev => ({
            ...prev,
            notifications: prev.notifications || [], // Safety check
            goals: prev.goals.filter(g => g.id !== id)
        }));
    };

    const updateUser = (u: Partial<AppData['user']>) => {
        setData(prev => ({ ...prev, user: { ...prev.user, ...u } }));
    };

    const updateBudget = (category: string, limit: number) => {
        setData(prev => {
            const existing = prev.budgetConfigs.find(b => b.category === category);
            let newBudgets;
            if (existing) {
                newBudgets = prev.budgetConfigs.map(b => b.category === category ? { category, limit } : b);
            } else {
                newBudgets = [...prev.budgetConfigs, { category, limit }];
            }
            return { ...prev, budgetConfigs: newBudgets };
        });
    };

    const updateGoal = (id: number, updates: Partial<Goal>) => {
        setData(prev => {
            const updatedGoals = prev.goals.map(g => {
                if (g.id === id) {
                    const newGoal = { ...g, ...updates };
                    // Trigger Goal Completion Check
                    if (newGoal.current >= newGoal.target && g.current < g.target) {
                        const achievement = NotificationService.checkSavingsGoal(newGoal.name, newGoal.current, newGoal.target);
                        if (achievement) {
                            // Can't call addNotification here directly due to state update batching/logic
                            // Usually better to handle side effects in useEffect or separate function
                            // but for this MVP, we'll append to the new state object
                            return { ...newGoal, _triggeredAchievement: achievement };
                        }
                    }
                    return newGoal;
                }
                return g;
            });

            // Extract achievements if any
            const achievements = updatedGoals
                .filter((g: any) => g._triggeredAchievement)
                .map((g: any) => g._triggeredAchievement);

            // Clean up temporary property
            const cleanGoals = updatedGoals.map((g: any) => {
                const { _triggeredAchievement, ...rest } = g;
                return rest;
            }) as Goal[];

            return {
                ...prev,
                goals: cleanGoals,
                notifications: [...achievements, ...prev.notifications]
            };
        });
    };

    return (
        <FinancialContext.Provider value={{
            ...data,
            addTransaction,
            deleteTransaction,
            updateTransaction,
            addGoal,
            deleteGoal,
            updateGoal,
            updateUser,
            updateBudget,
            addNotification,
            markNotificationRead,
            isTransactionModalOpen,
            openTransactionModal,
            closeTransactionModal
        }}>
            {children}
        </FinancialContext.Provider>
    );
}

export function useFinancial() {
    const context = useContext(FinancialContext);
    if (context === undefined) {
        throw new Error('useFinancial must be used within a FinancialProvider');
    }
    return context;
}
