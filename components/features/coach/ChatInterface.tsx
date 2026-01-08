"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useFinancial } from "@/lib/context/financial-context";
import { cn, formatCurrency } from "@/lib/utils";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

export function ChatInterface() {
    const { user, transactions, debts, metrics } = useFinancial();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: `👋 ¡Hola ${user.name.split(' ')[0]}! Soy tu Coach Financiero. ¿En qué trabajamos hoy?`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
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

        try {
            // Context Formatting
            const contextSummary = {
                balanceDisponible: formatCurrency(metrics.availableBalance),
                deudas: debts.map(d => `${d.name}: ${formatCurrency(d.currentBalance)} (Tasa: ${d.interestRate}%)`),
                gastosRecientes: transactions.slice(0, 5).map(t => `${t.category}: ${formatCurrency(t.amount)} (${new Date(t.date).toLocaleDateString()})`),
                ingresosMensuales: formatCurrency(user.monthlyIncome)
            };

            // Secure Backend Call
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.text,
                    context: {
                        userProfile: user,
                        financialSnapshot: contextSummary
                    }
                })
            });

            const data = await response.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || "Lo siento, tuve un problema conexión. ¿Intenta de nuevo?",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
                                            table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs" {...props} /></div>,
                                            thead: ({ node, ...props }) => <thead className="bg-slate-50 dark:bg-slate-900/50" {...props} />,
                                            th: ({ node, ...props }) => <th className="px-3 py-2 text-left font-medium text-slate-500 uppercase tracking-wider" {...props} />,
                                            td: ({ node, ...props }) => <td className="px-3 py-2 whitespace-nowrap" {...props} />,
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
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
