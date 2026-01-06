"use client";

import { Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useFinancial } from "@/lib/context/financial-context";

export function InsightWidget() {
    const { user } = useFinancial();

    return (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 font-medium text-sm">
                    <Lightbulb size={18} />
                    <span>Insight del Día</span>
                </div>

                <h3 className="text-xl font-bold mb-2">
                    Hola {user.name.split(' ')[0]}, vas por buen camino 🚀
                </h3>

                <p className="text-slate-300 text-sm mb-6 max-w-md leading-relaxed">
                    Has logrado reducir tus gastos hormiga un <strong>15%</strong> esta semana.
                    Si mantienes este ritmo, alcanzarás tu meta del "Clavo de Emergencia" 2 semanas antes.
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
