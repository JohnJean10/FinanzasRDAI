"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Transaction, Goal, Debt, BudgetConfig } from '../types';

// Initial Mock Data (mirrors legacy app.js)
const INITIAL_DATA: AppData = {
    user: {
        name: 'Usuario Nuevo',
        monthlyIncome: 0,
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
    debts: []
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
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AppData>(INITIAL_DATA);

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

    const addTransaction = (t: Omit<Transaction, 'id'>) => {
        const newTx = { ...t, id: Date.now() };
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
        const newGoal = { ...g, id: Date.now() };
        setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
    };

    const deleteGoal = (id: number) => {
        setData(prev => ({
            ...prev,
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
        setData(prev => ({
            ...prev,
            goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
        }));
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
            updateBudget
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
