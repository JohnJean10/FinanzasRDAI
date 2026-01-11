"use client";

import React, { useState, useMemo } from 'react';
import { useFinancial } from '@/lib/context/financial-context';
import { useAlerts } from '@/components/features/planning/AlertSystem';
import { Plus, Trash2, AlertTriangle, CheckCircle, TrendingUp, Edit2, X, Lock, BarChart2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { BudgetConfig } from '@/lib/types';

// Common financial emojis for picker
const EMOJI_OPTIONS = ['🍔', '🚗', '🏠', '💡', '🎮', '💊', '📚', '✈️', '👕', '🍺', '💰', '📦', '🛒', '💅', '🎬', '🏋️', '🐕', '👶', '💳', '🎁'];

interface EditBudgetModalProps {
  budget: BudgetConfig | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<BudgetConfig>) => void;
  onDelete: (id: string) => void;
  availableToAssign: number;
}

function EditBudgetModal({ budget, onClose, onSave, onDelete, availableToAssign }: EditBudgetModalProps) {
  const [name, setName] = useState(budget?.name || '');
  const [icon, setIcon] = useState(budget?.icon || '📦');
  const [limit, setLimit] = useState(budget?.limit || 0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!budget) return null;

  const maxAllowedLimit = budget.limit + availableToAssign;
  const isOtros = budget.id === 'otros-default';

  const handleSave = () => {
    if (limit > maxAllowedLimit) return;
    onSave(budget.id, { name, icon, limit });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Edit2 className="text-indigo-500" size={20} /> Editar Presupuesto
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Icono</label>
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-3xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {icon}
              </button>
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-10 grid grid-cols-5 gap-2 w-64">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setIcon(emoji); setShowEmojiPicker(false); }}
                      className="w-10 h-10 flex items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isOtros}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium disabled:opacity-50"
            />
          </div>

          {/* Limit */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Límite Mensual <span className="text-slate-400 font-normal">(Máx: {formatCurrency(maxAllowedLimit)})</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">RD$</span>
              <input
                type="number"
                value={limit || ''}
                onChange={(e) => setLimit(Math.min(parseFloat(e.target.value) || 0, maxAllowedLimit))}
                max={maxAllowedLimit}
                className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-lg"
              />
            </div>
            {limit > maxAllowedLimit && (
              <p className="text-red-500 text-xs mt-1">Excede el ingreso disponible</p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex gap-3">
          {!isOtros && (
            <button
              onClick={() => { onDelete(budget.id); onClose(); }}
              className="px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={limit > maxAllowedLimit || !name.trim()}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BudgetManager() {
  const {
    budgetConfigs,
    transactions,
    user,
    addBudget,
    updateBudget,
    deleteBudget,
    getTotalBudgeted,
    getAvailableToAssign
  } = useFinancial();

  const [editingBudget, setEditingBudget] = useState<BudgetConfig | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBudget, setNewBudget] = useState({ name: '', icon: '📦', limit: 0 });

  const totalBudgeted = getTotalBudgeted();
  const availableToAssign = getAvailableToAssign();
  const monthlyIncome = user.monthlyIncome || 0;
  const assignmentPercentage = monthlyIncome > 0 ? (totalBudgeted / monthlyIncome) * 100 : 0;

  // Calculate SPENT dynamically based on current month's transactions
  const budgetsWithStats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return budgetConfigs.map(config => {
      const spent = transactions
        .filter(t =>
          t.budgetId === config.id &&
          t.type === 'expense' &&
          new Date(t.date).getMonth() === currentMonth &&
          new Date(t.date).getFullYear() === currentYear
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...config,
        spent,
        percentage: config.limit > 0 ? (spent / config.limit) * 100 : (spent > 0 ? 100 : 0)
      };
    });
  }, [budgetConfigs, transactions]);

  const handleAddBudget = () => {
    if (!newBudget.name || newBudget.limit <= 0 || newBudget.limit > availableToAssign) return;

    addBudget({
      name: newBudget.name,
      category: newBudget.name.toLowerCase().replace(/\s+/g, '_'),
      icon: newBudget.icon,
      limit: newBudget.limit,
      alerts: [80, 100]
    });

    setNewBudget({ name: '', icon: '📦', limit: 0 });
    setIsAddingNew(false);
  };

  const getStatusInfo = (percentage: number) => {
    if (percentage >= 100) return { label: '¡Te pasaste! 🚫', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20', barColor: 'bg-red-500', icon: AlertTriangle };
    if (percentage >= 80) return { label: 'Cuidao ahí... ⚠️', color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20', barColor: 'bg-orange-500', icon: AlertTriangle };
    if (percentage >= 50) return { label: 'A mitad de camino', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', barColor: 'bg-yellow-500', icon: TrendingUp };
    return { label: 'Nitido 👌', color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', barColor: 'bg-emerald-500', icon: CheckCircle };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header with Assignment Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <BarChart2 size={200} />
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Presupuestos 🇩🇴</h1>
          <p className="text-blue-100 mb-6 max-w-lg">Distribuye tu ingreso en categorías para no comerte los cuartos.</p>

          {/* Assignment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Ingreso Mensual</p>
              <p className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">Ya Asignado</p>
              <p className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
            </div>
            <div className={`backdrop-blur-md rounded-2xl p-5 border ${availableToAssign > 0 ? 'bg-emerald-500/20 border-emerald-400/30' : 'bg-red-500/20 border-red-400/30'}`}>
              <p className="text-xs uppercase tracking-wider mb-1 opacity-80">Disponible</p>
              <p className="text-2xl font-bold">{formatCurrency(availableToAssign)}</p>
            </div>
          </div>

          {/* Assignment Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2 opacity-90">
              <span>Ingresos Asignados</span>
              <span className="font-bold">{assignmentPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
              <div
                className={`h-full transition-all duration-700 ease-out ${assignmentPercentage >= 100 ? 'bg-red-400' :
                    assignmentPercentage >= 80 ? 'bg-orange-400' :
                      'bg-emerald-400'
                  }`}
                style={{ width: `${Math.min(assignmentPercentage, 100)}%` }}
              />
            </div>
            {availableToAssign <= 0 && (
              <p className="text-yellow-300 text-xs mt-2 flex items-center gap-1">
                <Lock size={12} /> Todo tu ingreso está asignado
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Budget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetsWithStats.map(budget => {
          const status = getStatusInfo(budget.percentage);
          const StatusIcon = status.icon;
          const isOtros = budget.id === 'otros-default';

          return (
            <div
              key={budget.id}
              onClick={() => setEditingBudget(budget)}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden cursor-pointer group"
            >
              <div className={`${status.bgColor} p-5 border-b border-slate-100 dark:border-slate-700`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {budget.icon || '📦'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">{budget.name || budget.category}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tope: {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={18} className="text-slate-400" />
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

        {/* Add New Card - Disabled if no available income */}
        {!isAddingNew ? (
          <button
            onClick={() => availableToAssign > 0 && setIsAddingNew(true)}
            disabled={availableToAssign <= 0}
            className={`rounded-2xl border-3 border-dashed p-8 transition-all flex flex-col items-center justify-center gap-4 min-h-[250px] group ${availableToAssign > 0
                ? 'border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer'
                : 'border-slate-100 dark:border-slate-900 opacity-50 cursor-not-allowed'
              }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform ${availableToAssign > 0 ? 'bg-blue-100 dark:bg-blue-900 group-hover:scale-110' : 'bg-slate-100 dark:bg-slate-800'
              }`}>
              {availableToAssign > 0 ? (
                <Plus size={32} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <Lock size={24} className="text-slate-400" />
              )}
            </div>
            <span className="text-slate-600 dark:text-slate-300 font-bold text-lg">
              {availableToAssign > 0 ? 'Crear Nuevo Presupuesto' : 'Ingreso Agotado'}
            </span>
            {availableToAssign > 0 && (
              <span className="text-xs text-slate-400">Disponible: {formatCurrency(availableToAssign)}</span>
            )}
          </button>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-blue-500 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-6 text-lg">Nueva Categoría</h3>

              <div className="space-y-4">
                {/* Emoji Picker */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-2xl"
                    >
                      {newBudget.icon}
                    </button>
                    <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 grid grid-cols-5 gap-1 w-48 z-10">
                      {EMOJI_OPTIONS.slice(0, 10).map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setNewBudget({ ...newBudget, icon: emoji })}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newBudget.name}
                    onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                    placeholder="Nombre"
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Límite <span className="text-slate-400 font-normal">(Máx: {formatCurrency(availableToAssign)})</span>
                  </label>
                  <input
                    type="number"
                    value={newBudget.limit || ''}
                    onChange={(e) => setNewBudget({ ...newBudget, limit: Math.min(parseFloat(e.target.value) || 0, availableToAssign) })}
                    max={availableToAssign}
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
                disabled={!newBudget.name || newBudget.limit <= 0 || newBudget.limit > availableToAssign}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSave={updateBudget}
          onDelete={deleteBudget}
          availableToAssign={availableToAssign}
        />
      )}
    </div>
  );
}