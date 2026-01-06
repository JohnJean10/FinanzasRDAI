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
    Menu
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";

const MENU_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
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
                    "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/60",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                            F
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                                FinanzasRD
                            </h1>
                            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AI Assistant</p>
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
                                        ? "text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
                                )}
                                <Icon size={20} className={cn("transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300")} />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-2">
                        <Link
                            href="/settings"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all text-sm flex-1"
                        >
                            <Settings size={18} />
                            <span>Configuración</span>
                        </Link>
                        <ModeToggle />
                    </div>
                </div>
            </aside>
        </>
    );
}
