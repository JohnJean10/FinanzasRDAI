"use client";

import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { Edit2, Trash2, Search, Filter } from "lucide-react";
import { Transaction } from "@/lib/types";

interface TransactionTableProps {
    onEdit: (t: Transaction) => void;
}

export function TransactionTable({ onEdit }: TransactionTableProps) {
    const { transactions, deleteTransaction } = useFinancial();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

    const filtered = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900">
                <div className="relative w-full md:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                    />
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {(['all', 'income', 'expense'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${filterType === type
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                        >
                            {type === 'all' ? 'Todos' : type === 'income' ? 'Ingresos' : 'Gastos'}
                        </button>
                    ))}
                </div>
            </div>

            {/* List (Mobile optimized as cards, Tablet+ as Table) */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/30 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="p-4">Descripción</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Fecha</th>
                            <th className="p-4 text-right">Monto</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {filtered.map((t) => (
                            <tr key={t.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="p-4 font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {t.description}
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 capitalize">
                                        {t.category.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">
                                    {new Date(t.date).toLocaleDateString()}
                                </td>
                                <td className={`p-4 text-right font-bold font-mono ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {t.type === 'expense' && '-'} {formatCurrency(t.amount)}
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(t)}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-slate-400 dark:text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Filter size={32} className="text-slate-200 dark:text-slate-700 mb-2" />
                                        <p>No se encontraron transacciones.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
