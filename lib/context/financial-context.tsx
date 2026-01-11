"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { AppData, Transaction, Goal, Debt, BudgetConfig, TimeRange } from '../types';
import { NotificationService, Notification } from '../services/notifications';
import { getBudgetMonthDate, processRecurringTransactions } from '../utils';

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
    updateBudget: (id: string, updates: Partial<BudgetConfig>) => void;
    addBudget: (budget: Omit<BudgetConfig, 'id'>) => void;
    deleteBudget: (id: string) => void;
    addNotification: (n: Notification) => void;
    markNotificationRead: (id: string) => void;
    // Debts
    // Debts
    addDebt: (debt: Omit<Debt, 'id'>) => void;
    deleteDebt: (id: string) => void;
    payDebt: (id: string, amount: number) => void;
    updateDebt: (id: string, debt: Partial<Debt>) => void;
    learnFact: (fact: string) => void; // NUEVO: Memoria
    setBudget: (category: string, limit: number) => void; // Alias for AI
    metrics: {
        totalIncome: number;
        totalExpenses: number;
        balance: number;
        availableBalance: number;
        totalSavings: number;
        totalGoalsTarget: number;
        savingsRate: number;
        monthlyBurnRate: number;
        totalAssets: number;
        totalDebt: number;
    };
    timeRange: TimeRange;
    setTimeRange: (range: TimeRange) => void;
    isTransactionModalOpen: boolean;
    openTransactionModal: () => void;
    alertSystem: Notification[];
    closeTransactionModal: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AppData>(INITIAL_DATA);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>('thisMonth');

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

    useEffect(() => {
        localStorage.setItem('finanzasrd_data_v2', JSON.stringify(data));
    }, [data]);

    // ... (metrics logic omitted for brevity as it is unchanged) ...

    // --- AI MEMORY ---
    const learnFact = (fact: string) => {
        setData(prev => {
            const currentFacts = prev.user.aiLearnedFacts || [];
            // Avoid duplicates
            if (currentFacts.includes(fact)) return prev;
            return {
                ...prev,
                user: {
                    ...prev.user,
                    aiLearnedFacts: [...currentFacts, fact]
                }
            };
        });
    };

    // ... (rest of functions) ...
    // Note: I will only replace the end of the file to include the new export, assuming the intermediate code is intact or handled by not overwriting it if I target specific blocks. 
    // actually, replace_file_content replaces a block. I need to be careful.
    // I will use multi_replace to insert the interface change and the implementation separately.
    // wait, I can just use one block if I target the return.

    // Changing strategy: using multi_replace to be precise.


    // --- CÁLCULO DE MÉTRICAS CON SEGMENTACIÓN TEMPORAL AVANZADA ---
    const metrics = useMemo(() => {
        const { transactions, goals } = data; // Destructure transactions AND goals from data
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();

        // Configuración de Fechas (El corazón de la segmentación)
        switch (timeRange) {
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'lastMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'last3Months': // Trimestral
                startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'last4Months': // Cuatrimestral (Tu pedido)
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'last6Months': // Semestral
                startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'last12Months': // Anual (Rolling)
                startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'ytd': // Year to Date
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = now;
                break;
            case 'all': // Histórico
                startDate = new Date(0);
                endDate = new Date(now.getFullYear() + 10, 0, 1);
                break;
        }

        // 1. "La Foto" (Balance): Acumulado histórico HASTA la fecha de corte seleccionada
        const historicalBalance = transactions.reduce((acc, t) => {
            const tDate = new Date(t.date);
            // Si elijo "Mes Pasado", el balance debe ser el que tenía EL ÚLTIMO DÍA del mes pasado
            if (tDate <= endDate) {
                // AHORRO: No resta al balance total (es una transferencia interna), 
                // pero si es Gasto resta, Ingreso suma.
                if (t.type === 'saving') return acc;
                return acc + (t.type === 'income' ? t.amount : -t.amount);
            }
            return acc;
        }, 0);

        // 2. NUEVO: Calcular Ahorros Acumulados (Suma de todas las Metas)
        // Nota: Asumimos que 'goals' contiene el estado actual de las metas
        const totalSavings = goals.reduce((acc, goal) => acc + goal.current, 0);
        const totalGoalsTarget = goals.reduce((acc, goal) => acc + goal.target, 0);

        // 3. NUEVO: Lógica Híbrida de Disponibilidad
        // Si el ahorro fue 'expense' (Salió), ya restó del balance.
        // Si el ahorro fue 'saving' (Virtual), está en el balance pero no es disponible.
        // Available = Balance - (Ahorros Virtuales/Phantom)
        const phantomSavings = transactions
            .filter(t => t.type === 'saving')
            .reduce((acc, t) => acc + t.amount, 0);

        const availableBalance = historicalBalance - phantomSavings;

        // 4. "La Película" (Flujo): Ingresos/Gastos DENTRO del rango seleccionado
        const periodMetrics = transactions.reduce(
            (acc, t) => {
                // Aplicamos tu lógica de "Rollover" (Día 31 -> Mes siguiente)
                const smartDate = getBudgetMonthDate(t.date, t.type);

                if (smartDate >= startDate && smartDate <= endDate) {
                    if (t.type === 'income') acc.income += t.amount;
                    if (t.type === 'expense') acc.expense += t.amount;
                }
                return acc;
            },
            { income: 0, expense: 0 }
        );

        const savingsRate = periodMetrics.income > 0
            ? ((periodMetrics.income - periodMetrics.expense) / periodMetrics.income) * 100
            : 0;

        return {
            totalIncome: periodMetrics.income,
            totalExpenses: periodMetrics.expense,
            balance: historicalBalance,
            availableBalance,
            totalSavings,
            totalGoalsTarget,
            savingsRate,

            monthlyBurnRate: periodMetrics.expense,
            totalAssets: historicalBalance, // In this simple model, cash balance = assets
            totalDebt: data.debts.reduce((sum, d) => sum + d.currentBalance, 0) // Sum of all debt balances
        };

    }, [data.transactions, data.goals, timeRange]);

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

    // --- AUTOMATIC RECURRING TRANSACTIONS ENGINE ---
    useEffect(() => {
        // Only run if we have data to avoid initial empty check issues or conflicts
        if (data.transactions.length > 0) {
            const { newTransactions, updatedBaseTransactions } = processRecurringTransactions(data.transactions);

            if (newTransactions.length > 0 || updatedBaseTransactions.length > 0) {
                console.log("🔄 Motor de Recurrencia: Actualizando transacciones...");

                setData(prev => ({
                    ...prev,
                    transactions: [...newTransactions, ...updatedBaseTransactions].sort((a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                }));

                // Optional: Notify user about new auto-recs (Toast)
                // We'll skip this for now to avoid spam/loop issues until proven stable, 
                // but the console logs in utils will show activity.
            }
        }
    }, [data.transactions]);

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
        let finalType = t.type;
        let finalCategory = t.category;

        // CRITICAL LOGIC: If linked to a goal, FORCE it to be an expense (money leaving)
        // but categorized as 'ahorro' for tracking.
        if (t.goalId || t.category === 'ahorro' || t.type === 'saving') {
            finalType = 'expense';
            finalCategory = 'ahorro';
        }

        const newTx = {
            ...t,
            type: finalType,
            category: finalCategory,
            id: Date.now()
        } as Transaction;

        // 1. Handle Budget Check (Only for true Expenses, excluding savings if we want, but user said 'expense')
        // We warn about savings if they exceed budget too? Yes, usually.
        if (finalType === 'expense') {
            const budget = data.budgetConfigs.find(b => b.category === finalCategory);
            if (budget) {
                const currentMonth = new Date().getMonth();
                const totalSpent = data.transactions
                    .filter(tx => tx.category === finalCategory && tx.type === 'expense' && new Date(tx.date).getMonth() === currentMonth)
                    .reduce((sum, tx) => sum + tx.amount, 0) + t.amount;

                const alert = NotificationService.checkBudgetThreshold(finalCategory, totalSpent, budget.limit);
                if (alert) {
                    addNotification(alert);
                }
            }
        }

        // 2. Handle Savings Goal Update
        if (t.goalId) {
            setData(prev => ({
                ...prev,
                transactions: [newTx, ...prev.transactions],
                // Force new array reference for goals to trigger updates
                goals: prev.goals.map(g =>
                    g.id === t.goalId ? { ...g, current: g.current + t.amount } : g
                )
            }));
            return;
        }

        setData(prev => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
    };

    const deleteTransaction = (id: number) => {
        const txToDelete = data.transactions.find(t => t.id === id);

        // If deleting a saving transaction, rollback the goal amount
        if (txToDelete && txToDelete.type === 'saving' && txToDelete.goalId) {
            setData(prev => ({
                ...prev,
                transactions: prev.transactions.filter(t => t.id !== id),
                goals: prev.goals.map(g =>
                    g.id === txToDelete.goalId ? { ...g, current: Math.max(0, g.current - txToDelete.amount) } : g
                )
            }));
        } else {
            setData(prev => ({
                ...prev,
                transactions: prev.transactions.filter(t => t.id !== id)
            }));
        }
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

    // --- DEBT MANAGEMENT ---
    // --- DEBT MANAGEMENT ---
    const addDebt = (debt: Omit<Debt, 'id'>) => {
        const newDebt = { ...debt, id: Date.now().toString() } as Debt;
        setData(prev => ({ ...prev, debts: [...prev.debts, newDebt] }));
    };

    const deleteDebt = (id: string) => {
        setData(prev => ({ ...prev, debts: prev.debts.filter(d => d.id !== id) }));
    };

    const updateDebt = (id: string, updatedData: Partial<Debt>) => {
        setData(prev => ({
            ...prev,
            debts: prev.debts.map(d => d.id === id ? { ...d, ...updatedData } : d)
        }));
    };

    const payDebt = (id: string, amount: number) => {
        setData(prev => ({
            ...prev,
            debts: prev.debts.map(d => {
                if (d.id === id) {
                    return { ...d, currentBalance: Math.max(0, d.currentBalance - amount) };
                }
                return d;
            })
        }));
    };

    const updateUser = (u: Partial<AppData['user']>) => {
        setData(prev => ({ ...prev, user: { ...prev.user, ...u } }));
    };



    const addBudget = (budget: Omit<BudgetConfig, 'id'>) => {
        const newBudget = { ...budget, id: Date.now().toString() };
        setData(prev => ({
            ...prev,
            budgetConfigs: [...prev.budgetConfigs, newBudget]
        }));
    };

    const updateBudget = (id: string, updates: Partial<BudgetConfig>) => {
        setData(prev => ({
            ...prev,
            budgetConfigs: prev.budgetConfigs.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
    };

    const deleteBudget = (id: string) => {
        setData(prev => ({
            ...prev,
            budgetConfigs: prev.budgetConfigs.filter(b => b.id !== id)
        }));
    };

    // Alias for AI/Legacy compatibility (if needed, but better to enforce new API)
    // We'll keep a legacy wrapper if strict compatibility is needed, 
    // but the request implies refactoring.
    // However, existing calls might break. Checking usages...
    // Only usage seems to be `addTransaction` (read-only) and maybe `ChatInterface`?
    // User asked to "Consumir budget context... addBudget...".
    // I will remove the old `updateBudget` signature.

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
            addBudget,
            deleteBudget,
            addNotification,
            markNotificationRead,
            isTransactionModalOpen,
            openTransactionModal,
            closeTransactionModal,
            timeRange,
            setTimeRange,
            metrics,
            addDebt,
            deleteDebt,
            updateDebt,
            payDebt,
            learnFact,
            alertSystem: data.notifications,
            setBudget: (cat, lim) => {
                // Compatibility shim for AI or other components that might use strict signature
                // Use a find-or-create logic
                const exists = data.budgetConfigs.find(b => b.category === cat);
                if (exists) updateBudget(exists.id, { limit: lim });
                else addBudget({ category: cat, limit: lim, alerts: [80, 100] });
            }
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
