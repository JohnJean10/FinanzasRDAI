"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { FileDown, FileSpreadsheet } from "lucide-react";

export function ExportPanel() {
    const { transactions } = useFinancial();

    const handleExportCSV = () => {
        // Defines CSV headers
        const headers = ["ID", "Fecha", "Tipo", "Categoría", "Descripción", "Monto", "Cuenta"];

        // Maps data to CSV rows
        const rows = transactions.map(t => [
            t.id,
            t.date,
            t.type,
            t.category,
            `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
            t.amount,
            t.account
        ]);

        // Combines headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        // Creates a Blob and triggers download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `finanzasrd_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-slate-900 dark:bg-blue-900/20 p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h3 className="font-bold text-lg mb-1">Exportar Datos</h3>
                <p className="text-slate-300 text-sm">Descarga tu historial completo para usar en Excel o compartir con tu contador.</p>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm"
                >
                    <FileSpreadsheet size={18} /> Excel / CSV
                </button>
                <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/40 rounded-lg font-medium text-sm cursor-not-allowed"
                >
                    <FileDown size={18} /> PDF (Proximamente)
                </button>
            </div>
        </div>
    );
}
