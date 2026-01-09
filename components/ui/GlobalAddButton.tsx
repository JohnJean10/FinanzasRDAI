"use client";

import { Plus } from "lucide-react";
import { useFinancial } from "@/lib/context/financial-context";
import { usePathname } from "next/navigation";

export function GlobalAddButton() {
    const { openTransactionModal } = useFinancial();
    const pathname = usePathname();

    // Hide on specific pages where context/coach handles actions
    if (pathname?.startsWith('/coach') || pathname?.startsWith('/onboarding')) {
        return null;
    }

    return (
        <button
            onClick={openTransactionModal}
            className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 md:bottom-8 md:right-8"
            aria-label="Agregar Transacción"
        >
            <Plus size={24} strokeWidth={2.5} />
        </button>
    );
}
