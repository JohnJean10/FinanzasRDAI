"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useFinancial } from "@/lib/context/financial-context";
import { cn, formatCurrency, detectRecurringTransactions } from "@/lib/utils";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    action?: ActionCommand; // NEW
    actionExecuted?: boolean; // NEW
}

interface ActionCommand {
    type: string;
    payload: any;
}

export function ChatInterface() {
    const { user, transactions, debts, metrics, addTransaction, payDebt } = useFinancial(); // IMPORT payDebt
    const [input, setInput] = useState("");
    // ... (keep state) ...

    // ... (keep handleSend start) ...

    try {
        // Context Formatting
        const recurringExpenses = detectRecurringTransactions(transactions);
        const netWorth = metrics.totalAssets - metrics.totalDebt;
        const savingsRate = user.monthlyIncome > 0 ? ((user.monthlyIncome - metrics.totalExpenses) / user.monthlyIncome) * 100 : 0;

        const contextSummary = {
            balanceDisponible: formatCurrency(metrics.availableBalance),
            patrimonioNeto: formatCurrency(netWorth),
            tasaAhorro: `${savingsRate.toFixed(1)}%`,
            // Send Name AND ID for precision, though AI might prefer names
            deudas: debts.map(d => ({ name: d.name, amount: d.currentBalance, id: d.id, rate: d.interestRate })),
            gastosRecientes: transactions.slice(0, 5).map(t => `${t.category}: ${formatCurrency(t.amount)}`),
            ingresosMensuales: formatCurrency(user.monthlyIncome)
        };

        // 1. Calculations
        const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
        const income = user.monthlyIncome;
        const available = metrics.availableBalance;
        const worstDebt = debts.sort((a, b) => b.interestRate - a.interestRate)[0];

        // 2. Dynamic System Prompt
        const generateSystemPrompt = () => `
ERES: FinanzasRD AI, coach financiero dominicano.
OBJETIVO: Ayudar al usuario a progresar.

CONTEXTO CLAVE:
- Deuda Total: ${formatCurrency(totalDebt)}
- Disponible: ${formatCurrency(available)}

REGLAS:
1. **BREVEDAD**: Máximo 2-3 oraciones.
2. **REACTIVIDAD**: Si pide pagar deuda, verifica si tiene saldo.

PROTOCOLO DE ACCIÓN:
Usa uno de estos formatos JSON al final:

1. GASTO/AHORRO:
[ACTION: {"type": "ADD_TRANSACTION", "payload": {"amount":NUMBER, "category":"CATEGORY", "type":"expense"|"income", "description":"TEXT", "date":"ISO_DATE"}}]
* Si es AHORRO: category='ahorro'.

2. PAGO DE DEUDA (Importantísimo):
[ACTION: {"type": "PAY_DEBT", "payload": {"amount":NUMBER, "debtName":"EXACT_NAME_FROM_CONTEXT"}}]
`;

        // ... (keep fetch) ...

        // ... (keep match parsing logic) ...

        // --- ACTION HANDLERS ---
        const handleExecuteAction = (msgId: string, action: ActionCommand) => {
            try {
                if (action.type === 'ADD_TRANSACTION') {
                    addTransaction({
                        ...action.payload,
                        date: new Date().toISOString()
                    });
                } else if (action.type === 'PAY_DEBT') {
                    // 1. Find Debt
                    const targetDebt = debts.find(d => d.name.toLowerCase().includes(action.payload.debtName.toLowerCase()));
                    if (targetDebt) {
                        // 2. Reduce Debt Balance
                        payDebt(targetDebt.id, action.payload.amount);
                        // 3. Record the outflow transaction
                        addTransaction({
                            amount: action.payload.amount,
                            category: 'deudas',
                            type: 'expense',
                            description: `Pago a ${targetDebt.name}`,
                            date: new Date().toISOString()
                        });
                    } else {
                        // Fallback if debt not found: Just record expense
                        addTransaction({
                            amount: action.payload.amount,
                            category: 'deudas',
                            type: 'expense',
                            description: `Pago Deuda: ${action.payload.debtName}`,
                            date: new Date().toISOString()
                        });
                    }
                }
                // Update message state
                setMessages(prev => prev.map(m => m.id === msgId ? { ...m, actionExecuted: true } : m));
            } catch (e) {
                console.error("Action Execution Failed", e);
            }
        };

        // ... (keep handleCancelAction) ...

        // ... (Render Loop) ...
        {/* Action Confirmation Card with SAFE ACCESS */ }
        {
            msg.action && !msg.actionExecuted && (
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                        Acción Sugerida
                    </p>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white">
                                {/* Dynamic Title based on Type */}
                                {msg.action.type === 'PAY_DEBT' ? 'Pago de Deuda' :
                                    msg.action.payload?.category === 'ahorro' ? 'Ahorro/Inversión' :
                                        msg.action.payload?.category === 'income' ? 'Ingreso' : 'Gasto'}
                                {' '}de {formatCurrency(msg.action.payload?.amount || 0)}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">
                                {msg.action.type === 'PAY_DEBT'
                                    ? `Destino: ${msg.action.payload?.debtName}`
                                    : `${msg.action.payload?.description || 'Sin descripción'} • ${msg.action.payload?.category || 'General'}`
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExecuteAction(msg.id, msg.action!)}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                            ✅ Confirmar
                        </button>
                        <button
                            onClick={() => handleCancelAction(msg.id)}
                            className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors"
                        >
                            ❌ Cancelar
                        </button>
                    </div>
                </div>
            )
        }

        {/* Action Result Feedback */ }
        {
            msg.actionExecuted && (
                <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg flex items-center gap-2">
                    <span>✅ Acción realizada con éxito</span>
                </div>
            )
        }
                                </div >
                            </div >
                        </div >
            <span className="text-[10px] text-slate-400 mt-1 px-9 opacity-0 group-hover:opacity-100 transition-opacity">
                {msg.timestamp}
            </span>
                    </div >
                ))
    }

                {
        isLoading && (
            <div className="self-start flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 mb-1">
                    <Bot size={12} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium animate-pulse">Analizando tus finanzas...</span>
                    </div>
                </div>
            </div>
        )
    }
    <div ref={messagesEndRef} />
            </div >

        {/* Input Area */ }
        < div className = "p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-20" >
                <QuickActions />
                <div className="relative flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-inner">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escribe tu consulta financiera..."
                        className="flex-1 py-2.5 px-4 bg-transparent border-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm text-slate-900 dark:text-white"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div >
        </div >
    );
}
