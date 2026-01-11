import { useFinancial } from "@/lib/context/financial-context";
import { FileDown, FileSpreadsheet } from "lucide-react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { calculateCashFlowPrediction, detectRecurringTransactions } from "@/lib/utils";
import { Transaction } from "@/lib/types";

interface ExportPanelProps {
    data?: Transaction[];
}

export function ExportPanel({ data }: ExportPanelProps) {
    const { transactions: allTransactions } = useFinancial();
    // Use filtered data if provided, otherwise use all
    const transactions = data || allTransactions;

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'FinanzasRD AI';
        workbook.created = new Date();

        // --- HOJA 1: RESUMEN Y CATEGORÍAS ---
        const sheetSummary = workbook.addWorksheet('Resumen General');

        // Totales
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpense;

        sheetSummary.columns = [{ width: 20 }, { width: 20 }, { width: 5 }, { width: 25 }, { width: 20 }];

        // Header Stats
        sheetSummary.addRow(["REPORTE FINANCIERO", new Date().toLocaleDateString()]);
        sheetSummary.addRow([""]);
        sheetSummary.addRow(["BALANCE NETO", balance]);
        sheetSummary.addRow(["TOTAL INGRESOS", totalIncome]);
        sheetSummary.addRow(["TOTAL GASTOS", totalExpense]);

        // Style Stats
        ['C2', 'C4', 'C5', 'C6'].forEach(cell => {
            const c = sheetSummary.getCell(cell.replace('C', 'B'));
            c.numFmt = '"RD$"#,##0.00';
            c.font = { bold: true };
        });

        sheetSummary.getRow(1).font = { bold: true, size: 14 };
        sheetSummary.addRow([""]);
        sheetSummary.addRow([""]);

        // Breakdown by Category
        sheetSummary.addRow(["DISTRIBUCIÓN DE GASTOS"]);
        sheetSummary.getRow(8).font = { bold: true, color: { argb: 'FF3B82F6' } };

        sheetSummary.addRow(["Categoría", "Monto", "% del Total"]);
        const headerCat = sheetSummary.getRow(9);
        headerCat.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerCat.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };

        const expenses = transactions.filter(t => t.type === 'expense');
        const expensesByCat = expenses.reduce((acc, t) => {
            const key = t.budgetId || t.category || 'otros';
            acc[key] = (acc[key] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(expensesByCat)
            .sort(([, a], [, b]) => b - a)
            .forEach(([cat, amount]) => {
                sheetSummary.addRow([
                    cat.replace('_', ' ').toUpperCase(),
                    amount,
                    totalExpense > 0 ? amount / totalExpense : 0
                ]);
            });

        sheetSummary.getColumn(2).numFmt = '"RD$"#,##0.00';
        sheetSummary.getColumn(3).numFmt = '0.0%';


        // --- HOJA 2: PROYECCIÓN DE FLUJO ---
        const sheetFore = workbook.addWorksheet('Proyección de Flujo');
        sheetFore.columns = [{ width: 25 }, { width: 15 }, { width: 15 }, { width: 15 }];

        // Data Prep
        const patterns = detectRecurringTransactions(transactions);
        // Rough calc of current balance for projection base (simplified)
        const projectionWeeks = calculateCashFlowPrediction(balance, patterns);

        sheetFore.addRow(["SEMANA", "BALANCE", "INGRESOS", "GASTOS"]);
        const headFore = sheetFore.getRow(1);
        headFore.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headFore.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } }; // Indigo

        projectionWeeks.forEach(w => {
            sheetFore.addRow([w.range, w.balance, w.income, w.expenses]);
        });
        sheetFore.getColumn(2).numFmt = '"RD$"#,##0.00';
        sheetFore.getColumn(3).numFmt = '"RD$"#,##0.00';
        sheetFore.getColumn(4).numFmt = '"RD$"#,##0.00';


        // --- HOJA 3: SUSCRIPCIONES ---
        const sheetSubs = workbook.addWorksheet('Suscripciones Detectadas');
        sheetSubs.columns = [{ width: 25 }, { width: 15 }, { width: 15 }, { width: 20 }];

        sheetSubs.addRow(["SERVICIO", "COSTO", "FRECUENCIA", "CATEGORÍA"]);
        const headSubs = sheetSubs.getRow(1);
        headSubs.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headSubs.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }; // Emerald

        patterns.forEach(p => {
            sheetSubs.addRow([p.description, p.amount, p.frequency, p.category]);
        });
        sheetSubs.getColumn(2).numFmt = '"RD$"#,##0.00';


        // --- HOJA 4: TRANSACCIONES (Detalle) ---
        const sheetTx = workbook.addWorksheet('Detalle de Transacciones');
        sheetTx.columns = [
            { header: 'Fecha', key: 'date', width: 15 },
            { header: 'Tipo', key: 'type', width: 12 },
            { header: 'Categoría', key: 'category', width: 25 },
            { header: 'Descripción', key: 'description', width: 40 },
            { header: 'Monto', key: 'amount', width: 18 },
        ];

        const headTx = sheetTx.getRow(1);
        headTx.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headTx.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF64748B' } }; // Slate

        transactions.forEach(t => {
            const row = sheetTx.addRow({
                date: new Date(t.date).toLocaleDateString('es-DO'),
                type: t.type === 'income' ? 'Ingreso' : 'Gasto',
                category: t.category,
                description: t.description,
                amount: t.amount
            });
            const amtColor = t.type === 'income' ? 'FF10B981' : 'FFEF4444';
            row.getCell(5).font = { color: { argb: amtColor } };
        });
        sheetTx.getColumn(5).numFmt = '"RD$"#,##0.00';


        // Generar y Descargar
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `FinanzasRD_Reporte_Completo_${new Date().toISOString().split('T')[0]}.xlsx`);
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
                    Exportar Excel Completo
                </button>
            </div>
        </div>
    );
}
