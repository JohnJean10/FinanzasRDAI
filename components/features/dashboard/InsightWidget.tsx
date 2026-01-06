"use client";

import { Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useFinancial } from "@/lib/context/financial-context";

export function InsightWidget() {
    const { transactions, user } = useFinancial();

    // Simple Insight Logic
    const currentMonth = new Date().getMonth();
    const currentTx = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
    const income = currentTx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = currentTx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    let title = `Hola ${user.name.split(' ')[0]}, ¡Empecemos! 👋`;
    let message = "Registra tus primeros ingresos y gastos para que la IA pueda darte consejos personalizados.";

    if (currentTx.length > 0) {
        if (expenses > income) {
            title = `Cuidado con los gastos, ${user.name.split(' ')[0]} ⚠️`;
            message = `Tus gastos (${income > 0 ? ((expenses / income) * 100).toFixed(0) + '%' : 'superan'}) son mayores que tus ingresos este mes. Revisa tu presupuesto.`;
        } else if (savingsRate > 20) {
            title = `¡Excelente trabajo, ${user.name.split(' ')[0]}! 🚀`;
            message = `Estás ahorrando un ${savingsRate.toFixed(0)}% de tus ingresos. ¡Mantén ese ritmo para alcanzar tus metas más rápido!`;
        } else if (savingsRate > 0) {
            title = `Vas por buen camino, ${user.name.split(' ')[0]} 👍`;
            message = `Tienes un flujo de caja positivo. Considera destinar ese excedente a tu Fondo de Emergencia.`;
        }
    }

    return (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-900/20">
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
