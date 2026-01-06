"use client";

import { Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";

export function InsightWidget() {
    const { transactions, user } = useFinancial();

    // Advanced Insight Logic
    const currentMonth = new Date().getMonth();
    const currentTx = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
    const income = currentTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = currentTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // Find top spending category
    const categoryTotals = currentTx
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

    // Default State
    let title = `Hola ${user.name.split(' ')[0]}, ¡Empecemos! 👋`;
    let message = "Registra tus primeros ingresos y gastos para que la IA pueda darte consejos personalizados.";
    let type = 'neutral'; // neutral, warning, success, danger

    if (currentTx.length > 0) {
        // SCENARIO 1: Danger - Deficit
        if (expenses > income) {
            title = `Alerta de Déficit ⚠️`;
            message = `Tus gastos superan tus ingresos por ${formatCurrency(expenses - income)}. Revisa tus gastos hormiga y prioriza lo esencial.`;
            type = 'danger';
        }
        // SCENARIO 2: Warning - High Expenses (>80%)
        else if (expenses > (income * 0.8)) {
            title = `Presupuesto Ajustado 📉`;
            message = `Has consumido el ${((expenses / income) * 100).toFixed(0)}% de tus ingresos. Intenta reducir gastos discrecionales esta semana.`;
            type = 'warning';
        }
        // SCENARIO 3: Warning - Single Category Domination (>40%)
        else if (topCategory && topCategory[1] > (expenses * 0.4)) {
            title = `Ojo con: ${topCategory[0]} 🍔`;
            message = `Esta categoría representa el ${((topCategory[1] / expenses) * 100).toFixed(0)}% de tus gastos totales. ¿Es posible optimizar aquí?`;
            type = 'warning';
        }
        // SCENARIO 4: Success - High Savings (>20%)
        else if (savingsRate > 20) {
            title = `¡Excelente ritmo! 🚀`;
            message = `Estás ahorrando el ${savingsRate.toFixed(0)}% de tus ingresos. Es un buen momento para considerar invertir ese excedente.`;
            type = 'success';
        }
        // SCENARIO 5: Neutral/Good - Positive Cashflow
        else {
            title = `Finanzas Saludables 👍`;
            message = `Tienes un superávit de ${formatCurrency(income - expenses)}. Podrías destinar ${formatCurrency((income - expenses) * 0.5)} a tu fondo de emergencia.`;
            type = 'success';
        }
    }

    const getGradient = () => {
        switch (type) {
            case 'danger': return 'from-red-900 to-rose-900 border-red-800';
            case 'warning': return 'from-amber-900 to-orange-900 border-amber-800';
            case 'success': return 'from-emerald-900 to-teal-900 border-emerald-800';
            default: return 'from-blue-900 to-indigo-900 border-blue-800';
        }
    };

    return (
        <div className={`bg-gradient-to-r ${getGradient()} border rounded-xl p-6 text-white relative overflow-hidden shadow-lg transition-all duration-500`}>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 font-medium text-sm">
                    <Lightbulb size={18} />
                    <span>Insight del Día</span>
                </div>

                <h3 className="text-xl font-bold mb-2">
                    {title}
                </h3>

                <p className="text-slate-300 text-sm mb-6 max-w-md leading-relaxed">
                    {message}
                </p>

                <Link
                    href="/coach"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                >
                    Hablar con el Coach <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
