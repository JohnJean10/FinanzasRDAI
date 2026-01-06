"use client";

import { useState } from "react";
import { TransactionTable } from "@/components/features/transactions/TransactionTable";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { Transaction } from "@/lib/types";
import { Plus, ArrowRightLeft } from "lucide-react";

export default function TransactionsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ArrowRightLeft className="text-blue-600 dark:text-blue-400" />
                        Gestión de Transacciones
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Historial completo de tus ingresos y gastos.
                    </p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/10 font-medium"
                >
                    <Plus size={18} />
                    Nueva Transacción
                </button>
            </div>

            {/* Main Content */}
            <TransactionTable onEdit={handleEdit} />

            {/* Modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={handleClose}
                editingTransaction={editingTransaction}
            />
        </div>
    );
}
