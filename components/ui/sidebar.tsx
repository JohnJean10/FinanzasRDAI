"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    Map,
    CreditCard,
    FileText,
    Settings,
    Menu,
    ArrowRightLeft
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";

const MENU_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transacciones", href: "/transactions", icon: ArrowRightLeft },
    { name: "Coach IA", href: "/coach", icon: MessageSquare },
    { name: "Planificación", href: "/planning", icon: Map },
    { name: "Deudas", href: "/debts", icon: CreditCard },
    { name: "Reportes", href: "/reports", icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out border-r shadow-xl lg:translate-x-0 lg:shadow-none",
                    "bg-gradient-to-b from-blue-900 to-indigo-950 border-r-0 text-white",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold shadow-lg backdrop-blur-sm border border-white/10">
                            F
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                FinanzasRD
                            </h1>
                            <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider">AI Assistant</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-8 px-4 space-y-1">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "text-white bg-white/10 font-semibold shadow-sm border border-white/5"
                                        : "text-blue-200 hover:bg-white/5 hover:text-white"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                )}
                                <Icon size={20} className={cn("transition-colors", isActive ? "text-emerald-400" : "text-blue-300 group-hover:text-white")} />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10 bg-black/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-2">
                        <Link
                            href="/settings"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-all text-sm flex-1"
                        >
                            <Settings size={18} />
                            <span>Configuración</span>
                        </Link>
                        <ModeToggle />
                    </div>
                </div>
            </aside >
        </>
    );
}
