"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { FileDown, FileSpreadsheet } from "lucide-react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function ExportPanel() {
    const { transactions } = useFinancial();

    const handleExportExcel = async () => {
        // 1. Inicializar Libro y Hoja
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transacciones FinanzasRD');

        // 2. Definir Columnas y Anchos
        worksheet.columns = [
            { header: 'Fecha', key: 'date', width: 15 },
            { header: 'Tipo', key: 'type', width: 12 },
            { header: 'Categoría', key: 'category', width: 25 },
            { header: 'Descripción', key: 'description', width: 40 },
            { header: 'Cuenta', key: 'account', width: 15 },
            { header: 'Monto (DOP)', key: 'amount', width: 18 },
        ];

        // 3. Estilizar Encabezado (Match con bg-slate-900 y border-primary)
        const headerRow = worksheet.getRow(1);
        headerRow.height = 32;

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0F172A' } // Slate 900
            };
            cell.font = {
                name: 'Segoe UI',
                color: { argb: 'FFFFFFFF' }, // White
                bold: true,
                size: 11
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                bottom: { style: 'medium', color: { argb: 'FF3B82F6' } } // Primary Blue
            };
        });

        // 4. Inyectar Datos con Formato Condicional
        transactions.forEach((t) => {
            const row = worksheet.addRow({
                date: new Date(t.date).toLocaleDateString('es-DO'),
                type: t.type === 'income' ? 'Ingreso' : 'Gasto',
                category: t.category,
                description: t.description,
                account: t.account,
                amount: t.amount
            });

            // Celda de Monto (Columna F / Index 6)
            const amountCell = row.getCell(6);
            amountCell.numFmt = '"RD$"#,##0.00;[Red]-"RD$"#,##0.00';

            // Colores basados en tailwind.config.ts
            if (t.type === 'income') {
                amountCell.font = { color: { argb: 'FF10B981' } }; // Success (Emerald 500)
            } else {
                amountCell.font = { color: { argb: 'FFEF4444' } }; // Danger (Red 500)
            }

            // Alineación general
            row.eachCell((cell, colNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: colNumber === 6 ? 'right' : 'left' };
                // Bordes suaves
                cell.border = {
                    bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } // Slate 200
                };
            });
        });

        // 5. Calcular y Agregar Totales
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        // Fila vacía
        worksheet.addRow([]);

        // Fila de Resumen
        const summaryRow = worksheet.addRow(['', '', '', '', 'BALANCE NETO:', balance]);
        summaryRow.height = 28;

        // Estilo de la celda de etiqueta "BALANCE NETO"
        const labelCell = summaryRow.getCell(5);
        labelCell.font = { bold: true, size: 11 };
        labelCell.alignment = { horizontal: 'right', vertical: 'middle' };

        // Estilo de la celda del valor final
        const totalCell = summaryRow.getCell(6);
        totalCell.numFmt = '"RD$"#,##0.00';
        totalCell.font = { bold: true, size: 12, color: { argb: balance >= 0 ? 'FF10B981' : 'FFEF4444' } };
        totalCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF1F5F9' } // Slate 100
        };
        totalCell.alignment = { horizontal: 'right', vertical: 'middle' };

        // 6. Generar Blob y Descargar
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `FinanzasRD_Reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="bg-slate-900 dark:bg-blue-900/20 p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl border border-slate-800">
            <div>
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                    <FileSpreadsheet className="text-emerald-400" />
                    Centro de Exportación
                </h3>
                <p className="text-slate-300 text-sm">
                    Descarga tus reportes financieros con formato profesional para contabilidad.
                </p>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all font-medium text-sm shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transform hover:-translate-y-0.5"
                >
                    <FileSpreadsheet size={18} />
                    Descargar Excel (.xlsx)
                </button>
                <button
                    disabled
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white/30 rounded-lg font-medium text-sm cursor-not-allowed border border-white/5"
                >
                    <FileDown size={18} />
                    PDF (Próximamente)
                </button>
            </div>
        </div>
    );
}
