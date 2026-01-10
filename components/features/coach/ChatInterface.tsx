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
    const { user, transactions, debts, metrics, addTransaction, payDebt, learnFact, addGoal } = useFinancial(); // IMPORT payDebt, learnFact, addGoal
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: `👋 ¡Hola ${user.name.split(' ')[0]}! Soy tu Coach Financiero. ¿En qué trabajamos hoy?`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    // ...

    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Prepare context for AI
        const contextSummary = {
            totalDebt,
            availableBalance: available, // Use the new available calculation
            ...metrics
        };

        const learnedFactsBlock = user.aiLearnedFacts?.length
            ? `\nLO QUE SÉ DE TI:\n${user.aiLearnedFacts.map(f => `- ${f}`).join('\n')}`
            : "";

        const generateSystemPrompt = () => `
ERES: FinanzasRD AI, coach financiero dominicano proactivo.
OBJETIVO: Ayudar al usuario a progresar y aprender de él.

CONTEXTO CLAVE:
- Deuda Total: ${formatCurrency(totalDebt)}
- Disponible: ${formatCurrency(available)}
${learnedFactsBlock}

REGLAS:
1. **BREVEDAD**: Máximo 2-3 oraciones.
2. **REACTIVIDAD**: Si pide pagar deuda, verifica si tiene saldo.
3. **MEMORIA**: Si detectas una preferencia clara (ej: "No me gustan los riesgos"), guárdala con command learn_fact.

PROTOCOLO DE ACCIÓN (ESTRICTO):
Usa [ACTION: JSON] para realizar cambios.

1. GASTO/AHORRO/INGRESO:
[ACTION: {"type": "ADD_TRANSACTION", "payload": {"amount":NUMBER, "category":"CATEGORY", "type":"expense"|"income"|"saving", "description":"TEXT", "date":"ISO_DATE", "goalId":OPTIONAL_NUMBER}}]

2. PAGO DE DEUDA:
[ACTION: {"type": "PAY_DEBT", "payload": {"amount":NUMBER, "debtName":"EXACT_NAME"}}]

3. APRENDER DATO:
[ACTION: {"type": "LEARN_FACT", "payload": {"fact":"TEXTO DE LA PREFERENCIA"}}]

4. CREAR META:
[ACTION: {"type": "CREATE_GOAL", "payload": {"name":"TEXT", "target":NUMBER, "deadline":"ISO_DATE", "icon":"EMOJI"}}]
`;

        try {

            // Secure Backend Call
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Send full history (excluding welcome message if it's just a greeting, 
                    // but for simplicity we can send valid user/ai turns)
                    history: [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
                        role: m.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    })),
                    // Also send current message for redundancy if needed, though history handles it
                    message: userMsg.text,
                    systemInstruction: generateSystemPrompt(),
                    context: {
                        userProfile: user,
                        financialSnapshot: contextSummary
                    }
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
            };

            // Parse for Actions
            let actionData: ActionCommand | undefined;

            // 1. Try Standard Protocol
            const actionMatch = data.response.match(/\[ACTION: ([\s\S]*)\]/);
            if (actionMatch) {
                try {
                    actionData = JSON.parse(actionMatch[1]);
                } catch (e) { console.error("Standard Parse Failed", e); }
            }

            // 2. Fallback: Try extracting Raw JSON
            if (!actionData) {
                const jsonMatch = data.response.match(/\{[\s\S]*"type":[\s\S]*\}/) || data.response.match(/```json([\s\S]*)```/);
                if (jsonMatch) {
                    try {
                        const raw = jsonMatch[1] || jsonMatch[0];
                        const parsed = JSON.parse(raw);
                        // Map hallucinated 'updateDebt' to 'PAY_DEBT'
                        if (parsed.action === 'updateDebt' || parsed.type === 'updateDebt') {
                            actionData = {
                                type: 'PAY_DEBT',
                                payload: {
                                    amount: parsed.amount || 0,
                                    debtName: parsed.debt || parsed.debtName || 'Deuda General'
                                }
                            };
                        } else if (parsed.type) {
                            actionData = parsed;
                        }
                    } catch (e) { console.error("Fallback Parse Failed", e); }
                }
            }

            if (actionData) aiMsg.action = actionData;
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `⚠️ Error: ${error.message || "No pude conectar con el servidor."}`,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- ACTION HANDLERS ---
    const handleExecuteAction = (msgId: string, action: ActionCommand) => {
        try {
            if (action.type === 'ADD_TRANSACTION') {
                addTransaction({
                    ...action.payload,
                    date: new Date().toISOString()
                });
            } else if (action.type === 'PAY_DEBT') {
                // ... (Existing PayDebt Logic)
                const targetDebt = debts.find(d => d.name.toLowerCase().includes(action.payload.debtName.toLowerCase()));
                if (targetDebt) {
                    payDebt(targetDebt.id, action.payload.amount);
                    addTransaction({
                        amount: action.payload.amount,
                        category: 'deudas',
                        type: 'expense',
                        description: `Pago a ${targetDebt.name}`,
                        date: new Date().toISOString(),
                        account: 'payment'
                    });
                } else {
                    addTransaction({
                        amount: action.payload.amount,
                        category: 'deudas',
                        type: 'expense',
                        description: `Pago Deuda: ${action.payload.debtName}`,
                        date: new Date().toISOString(),
                        account: 'payment'
                    });
                }
            } else if (action.type === 'LEARN_FACT') {
                learnFact(action.payload.fact);
            } else if (action.type === 'CREATE_GOAL') {
                addGoal({
                    name: action.payload.name,
                    target: action.payload.target,
                    current: 0,
                    deadline: action.payload.deadline,
                    icon: action.payload.icon || '🎯',
                    isNative: false
                });
            }

            // Update message state
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, actionExecuted: true } : m));
        } catch (e) {
            console.error("Action Execution Failed", e);
        }
    };

    const handleCancelAction = (msgId: string) => {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, action: undefined } : m));
    };

    // Generate dynamic suggestions based on data
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const calculateSuggestions = () => {
            const chips = ['💰 Balance General']; // Always present

            // 1. Check for negative balance
            const currentMonth = new Date().getMonth();
            const income = transactions
                .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
                .reduce((sum, t) => sum + t.amount, 0);
            const expenses = transactions
                .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
                .reduce((sum, t) => sum + t.amount, 0);

            if (expenses > income && income > 0) {
                chips.push('⚠️ Gasto más de lo que gano');
            }

            // 2. Check for high spending categories
            const categoryTotals = transactions
                .filter(t => t.type === 'expense')
                .reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + t.amount;
                    return acc;
                }, {} as Record<string, number>);

            const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
            if (topCategory && topCategory[1] > (income * 0.3) && income > 0) {
                chips.push(`🍔 Reducir gastos en ${topCategory[0]}`);
            }

            // 3. New user check
            if (transactions.length === 0) {
                chips.push('👋 ¿Cómo empiezo a organizarme?');
            }

            // 4. Savings Goal check
            if (user.monthlyIncome > 0 && (income - expenses) > (user.monthlyIncome * 0.2)) {
                chips.push('📈 ¿Dónde invierto mis ahorros?');
            }

            // Fallback
            if (chips.length < 3) {
                chips.push('🎯 Establecer Metas', '📉 Analizar mis gastos');
            }

            setSuggestions(chips.slice(0, 4));
        };

        calculateSuggestions();
    }, [transactions, user]);

    const QuickActions = () => (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
            {suggestions.map((action) => (
                <button
                    key={action}
                    onClick={() => setInput(action)}
                    className="whitespace-nowrap px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                >
                    {action}
                </button>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden ring-1 ring-slate-900/5 transition-all">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Bot size={20} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900"></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white leading-tight">Coach FinanzasRD</h3>
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            AI Powered
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 dark:bg-black/20 scroll-smooth">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex flex-col max-w-[85%] group",
                            msg.sender === 'user' ? "self-end items-end" : "self-start items-start"
                        )}
                    >
                        <div className={cn(
                            "flex items-end gap-2",
                            msg.sender === 'user' ? "flex-row-reverse" : "flex-row"
                        )}>
                            {msg.sender === 'ai' && (
                                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 mb-1">
                                    <Bot size={12} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                            )}

                            <div
                                className={cn(
                                    "p-4 rounded-2xl shadow-sm text-sm leading-relaxed transition-all",
                                    msg.sender === 'user'
                                        ? "bg-gradient-to-br from-slate-800 to-slate-900 dark:from-blue-600 dark:to-blue-700 text-white rounded-tr-sm shadow-slate-300 dark:shadow-none"
                                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-700/50 shadow-sm"
                                )}
                            >
                                <div className="markdown-content">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-3" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-emerald-600 dark:text-emerald-400" {...props} />,
                                        }}
                                    >
                                        {msg.text.replace(/\[ACTION:[\s\S]*\]/, '') /* Hide raw JSON from view */}
                                    </ReactMarkdown>

                                    {/* Action Confirmation Card with SAFE ACCESS */}
                                    {msg.action && !msg.actionExecuted && (
                                        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                                                Acción Sugerida
                                            </p>
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">
                                                        {msg.action.type === 'PAY_DEBT' ? 'Pago de Deuda' :
                                                            msg.action.payload?.category === 'ahorro' ? 'Ahorro/Inversión' :
                                                                msg.action.payload?.type === 'income' ? 'Ingreso' : 'Gasto'}
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
                                    )}

                                    {/* Action Result Feedback */}
                                    {msg.actionExecuted && (
                                        <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg flex items-center gap-2">
                                            <span>✅ Acción realizada con éxito</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-9 opacity-0 group-hover:opacity-100 transition-opacity">
                            {msg.timestamp}
                        </span>
                    </div>
                ))}

                {isLoading && (
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
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-20">
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
            </div>
        </div>
    );
}
