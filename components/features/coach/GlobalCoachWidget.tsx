"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bot, X } from "lucide-react";
import { ChatInterface } from "./ChatInterface";
import { cn } from "@/lib/utils";

export function GlobalCoachWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Logic to exclude this widget if we are already on the dedicated Coach page
    if (!isMounted || pathname === '/coach') return null;

    return (
        <>
            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-24 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group",
                    isOpen ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100",
                    "bg-gradient-to-br from-emerald-500 to-cyan-600 text-white"
                )}
                aria-label="Abrir Coach Financiero"
            >
                <div className="relative">
                    <Bot size={28} className="animate-pulse-slow" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-600"></span>
                </div>
                {/* Tooltip on Hover */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Hablar con Coach
                </div>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Side Sheet Container */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10">
                    <div className="flex items-center gap-2">
                        <Bot className="text-emerald-600 dark:text-emerald-400" />
                        <h2 className="font-bold text-slate-800 dark:text-white">Coach IA</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Chat content wrapper */}
                <div className="h-[calc(100%-60px)]">
                    {/* Reuse existing Chat Interface but possibly simpler styling or just render properly */}
                    {isOpen && <ChatInterface />}
                </div>
            </div>
        </>
    );
}

// Custom CSS for pulse-slow if not tailwind default, though animate-pulse works.
// We'll stick to standard tailwind classes.
