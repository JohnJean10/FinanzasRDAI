"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Transaction, Goal, Debt, BudgetConfig } from '../types';

// Initial Mock Data (mirrors legacy app.js)
const INITIAL_DATA: AppData = {
    user: { name: 'Juan Diaz', monthlyIncome: 85000, profile: 'Premium' },
    transactions: [
        { id: 1, type: 'expense', description: 'Supermercado Bravo', amount: 4500, category: 'alimentacion', date: '2026-01-04', account: 'banreservas' },
        { id: 2, type: 'income', description: 'Sueldo Enero', amount: 37500, category: 'ingreso_sueldo', date: '2026-01-15', account: 'bhd' },
        { id: 3, type: 'expense', description: 'Uber Eats', amount: 850, category: 'entretenimiento', date: '2026-01-05', account: 'popular' }
    ],
    budgetConfigs: [
        { category: 'alimentacion', limit: 15000 },
        { category: 'transporte', limit: 5000 }
    ],
    goals: [
        { id: 1, name: 'Clavo de Emergencia', target: 50000, current: 15000, deadline: '2026-06-01', icon: '🛡️' }
    ],
    debts: [
        { id: 1, name: 'Tarjeta BHD', balance: 25000, rate: 60, minPayment: 1500 }
    ]
};

interface FinancialContextType extends AppData {
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: number) => void;
    updateTransaction: (id: number, updates: Partial<Transaction>) => void;
    addGoal: (g: Omit<Goal, 'id'>) => void;
    deleteGoal: (id: number) => void;
    updateUser: (u: Partial<AppData['user']>) => void;
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

    return (
        <FinancialContext.Provider value={{
            ...data,
            addTransaction,
            deleteTransaction,
            updateTransaction,
            addGoal,
            deleteGoal,
            updateUser
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
