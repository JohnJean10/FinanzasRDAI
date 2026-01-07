
"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

export type DateRange = 'day' | 'week' | 'fortnight' | 'month' | 'year' | 'ytd' | 'all';

interface DateRangeSelectProps {
    value: DateRange;
    onChange: (value: DateRange) => void;
}

export function DateRangeSelect({ value, onChange }: DateRangeSelectProps) {
    const options: { value: DateRange; label: string }[] = [
        { value: 'day', label: 'Hoy' },
        { value: 'week', label: 'Semana' },
        { value: 'fortnight', label: 'Quincena' },
        { value: 'month', label: 'Mes' },
        { value: 'year', label: 'Año' },
        { value: 'ytd', label: 'YTD' },
        { value: 'all', label: 'Histórico' },
    ];

    return (
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto w-full md:w-auto">
            <div className="pl-2 pr-1 text-slate-400">
                <Calendar size={16} />
            </div>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${value === opt.value
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
