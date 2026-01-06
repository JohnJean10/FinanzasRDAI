"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TransactionTable } from "@/components/features/transactions/TransactionTable";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { Transaction } from "@/lib/types";

export default function TransactionsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);

    const handleEdit = (t: Transaction) => {
        setEditingTx(t);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingTx(null);
    };

    return (
        <div className="p-6 md:p-8 relative min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transacciones</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Registro detallado de movimientos</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors shadow-lg shadow-slate-900/10 dark:shadow-emerald-600/10"
                >
                    <Plus size={18} /> Nueva
                </button>
            </div>

            <TransactionTable onEdit={handleEdit} />

            {/* Mobile Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-30"
            >
                <Plus size={24} />
            </button>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={handleClose}
                editingTransaction={editingTx}
            />
        </div>
    );
}
