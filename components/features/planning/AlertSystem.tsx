"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                ALERT CONTEXT                               */
/* -------------------------------------------------------------------------- */

const AlertContext = createContext<any>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alerts, setAlerts] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('budget_alerts');
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('budget_alerts', JSON.stringify(alerts));
    }, [alerts]);

    const addAlert = (alertData: any) => {
        const newAlert = {
            ...alertData,
            id: `alert-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            read: false,
            dismissed: false
        };

        // Prevent duplicate alerts in a short timeframe
        const isDuplicate = alerts.some(a =>
            a.budgetId === newAlert.budgetId &&
            a.threshold === newAlert.threshold &&
            Date.now() - a.timestamp < 60000
        );

        if (!isDuplicate) {
            setAlerts(prev => [newAlert, ...prev]);
        }
    };

    const markAsRead = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    };

    const dismissAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
    };

    const unreadCount = alerts.filter(a => !a.read && !a.dismissed).length;

    const getAlertsByBudget = (budgetId: string) => {
        return alerts.filter(a => a.budgetId === budgetId && !a.dismissed);
    };

    const value = {
        alerts,
        addAlert,
        markAsRead,
        dismissAlert,
        unreadCount,
        getAlertsByBudget
    };

    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error('useAlerts must be used within AlertProvider');
    return context;
};

/* -------------------------------------------------------------------------- */
/*                          ALERT NOTIFICATION CENTER                         */
/* -------------------------------------------------------------------------- */

export const AlertNotificationCenter = () => {
    const alertContext = useAlerts();
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    const visibleAlerts = alertContext.alerts
        .filter((a: any) => !a.dismissed)
        .filter((a: any) => filter === 'all' || !a.read);

    const getAlertIcon = (type: string) => {
        if (type === 'exceeded') return '🚨';
        if (type === 'critical') return '⚠️';
        if (type === 'warning') return '⚡';
        return '📊';
    };

    const getAlertTitle = (type: string) => {
        const titles: Record<string, string> = {
            exceeded: '¡Te Pasaste! 🚫',
            critical: 'Nivel Crítico 🔥',
            warning: 'Ojo con eso 👀',
        };
        return titles[type] || 'Notificación';
    };

    const formatTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes}m`;
        if (hours < 24) return `Hace ${hours}h`;
        return `Hace ${days}d`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
                <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                {alertContext.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                        {alertContext.unreadCount > 9 ? '9+' : alertContext.unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notificaciones</h3>
                            <p className="text-xs text-slate-500">{alertContext.unreadCount} sin leer</p>
                        </div>
                        <button onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')} className="text-xs text-blue-600 font-medium">
                            {filter === 'all' ? 'Ver no leídas' : 'Ver todas'}
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {visibleAlerts.length === 0 ? (
                            <div className="p-8 text-center">
                                <CheckCircle size={32} className="mx-auto text-green-500 mb-2 opacity-50" />
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">¡Todo limpio!</p>
                            </div>
                        ) : (
                            visibleAlerts.map((alert: any) => (
                                <div key={alert.id} className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!alert.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                    <div className="flex gap-3">
                                        <div className="text-xl pt-1">{getAlertIcon(alert.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{getAlertTitle(alert.type)}</h4>
                                                <span className="text-[10px] text-slate-400">{formatTime(alert.timestamp)}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                                <strong>{alert.budgetName}</strong>: {alert.percentage.toFixed(0)}% del presupuesto.
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                {!alert.read && (
                                                    <button onClick={() => alertContext.markAsRead(alert.id)} className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                                                        Marcar Leída
                                                    </button>
                                                )}
                                                <button onClick={() => alertContext.dismissAlert(alert.id)} className="text-[10px] text-slate-400 hover:text-slate-600">
                                                    Descartar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
        </div>
    );
};
