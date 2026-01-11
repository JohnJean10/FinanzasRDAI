"use client";

import React, { useState, useMemo } from 'react';
import { useFinancial } from '@/lib/context/financial-context';
import { useAlerts } from '@/components/features/planning/AlertSystem';
import { Plus, Trash2, AlertTriangle, CheckCircle, TrendingUp, Settings, BarChart2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/lib/types';

export default function BudgetManager() {
  const { budgetConfigs, transactions, addBudget, updateBudget, deleteBudget } = useFinancial();
  const alertContext = useAlerts();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showAlertConfig, setShowAlertConfig] = useState<string | null>(null);

  const [newBudget, setNewBudget] = useState({
    name: '',
    category: '', // Used for matching transactions
    emoji: '📦',
    amount: 0,
    alerts: [80, 100]
  });

  // Calculate SPENT dynamically based on current month's transactions
  const budgetsWithStats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return budgetConfigs.map(config => {
      const spent = transactions
        .filter(t =>
          (t.category === config.category || t.category === config.category.toLowerCase()) &&
          t.type === 'expense' &&
          new Date(t.date).getMonth() === currentMonth &&
          new Date(t.date).getFullYear() === currentYear
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...config,
        spent,
        percentage: config.limit > 0 ? (spent / config.limit) * 100 : 0
      };
    });
  }, [budgetConfigs, transactions]);

  // Totals
  const totalBudget = budgetsWithStats.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetsWithStats.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleAddBudget = () => {
    if (!newBudget.name || newBudget.amount <= 0) return;

    // Normalize category name for simplicity (or let user pick from existing categories)
    // For now, we assume Category Name = Budget Name
    addBudget({
      category: newBudget.name, // Using name as category key for now
      limit: newBudget.amount,
      alerts: newBudget.alerts
    });

    setNewBudget({ name: '', category: '', emoji: '📦', amount: 0, alerts: [80, 100] });
    setIsAddingNew(false);
  };

  const getStatusInfo = (percentage: number) => {
    if (percentage >= 100) return { label: '¡Te pasaste! 🚫', color: 'text-red-600', bgColor: 'bg-red-50', barColor: 'bg-red-500', icon: AlertTriangle };
    if (percentage >= 80) return { label: 'Cuidao ahí... ⚠️', color: 'text-orange-600', bgColor: 'bg-orange-50', barColor: 'bg-orange-500', icon: AlertTriangle };
    if (percentage >= 50) return { label: 'A mitad de camino', color: 'text-yellow-600', bgColor: 'bg-yellow-50', barColor: 'bg-yellow-500', icon: TrendingUp };
    return { label: 'Nitido 👌', color: 'text-emerald-600', bgColor: 'bg-emerald-50', barColor: 'bg-emerald-500', icon: CheckCircle };
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

      {/* Header Summary */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <BarChart2 size={200} />
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Tu Plan de Ataque 🇩🇴</h1>
          <p className="text-blue-100 mb-8 max-w-lg">Aquí es donde se gana la guerra contra la olla. Organiza tus cuartos por categoría.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Presupuesto Total</p>
              <p className="text-3xl font-bold">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Has Gastado</p>
              <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Disponible Real</p>
              <p className="text-3xl font-bold">{formatCurrency(totalBudget - totalSpent)}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2 opacity-90">
              <span>Consumo General</span>
              <span className="font-bold">{overallPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
              <div
                className={`h-full transition-all duration-700 ease-out ${overallPercentage >= 100 ? 'bg-red-400' :
                    overallPercentage >= 80 ? 'bg-orange-400' :
                      'bg-emerald-400'
                  }`}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetsWithStats.map(budget => {
          const status = getStatusInfo(budget.percentage);
          const StatusIcon = status.icon;
          // Note: Alerts are actually handled by NotificationService, but we can visualize thresholds here

          return (
            <div key={budget.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden group">
              <div className={`${status.bgColor} dark:bg-slate-800 p-5 border-b border-slate-100 dark:border-slate-700`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {/* We don't save emoji in context yet, using generic or first char */}
                      📦
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">{budget.category}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tope: {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => deleteBudget(budget.id)}
                      className="p-2 hover:bg-white/50 rounded-lg text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusIcon size={18} className={status.color} />
                  <span className={`text-sm font-bold ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-end">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Consumido</span>
                  <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(budget.spent)}</span>
                </div>

                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4 shadow-inner">
                  <div
                    className={`h-full transition-all duration-500 ${status.barColor}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{budget.percentage.toFixed(0)}% del tope</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    Quedan {formatCurrency(Math.max(0, budget.limit - budget.spent))}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Card */}
        {!isAddingNew ? (
          <button
            onClick={() => setIsAddingNew(true)}
            className="rounded-2xl border-3 border-dashed border-slate-200 dark:border-slate-800 p-8 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all flex flex-col items-center justify-center gap-4 min-h-[250px] group"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-slate-600 dark:text-slate-300 font-bold text-lg">Crear Nuevo Presupuesto</span>
          </button>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-blue-500 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-6 text-lg">Nueva Categoría</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newBudget.name}
                    onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                    placeholder="Ej: Salidas"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Límite Mensual</label>
                  <input
                    type="number"
                    value={newBudget.amount || ''}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="RD$ 0.00"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-colors font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddBudget}
                disabled={!newBudget.name || newBudget.amount <= 0}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}