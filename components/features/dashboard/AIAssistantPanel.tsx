"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, TrendingUp, Receipt, Wallet, PieChart, MoreHorizontal, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function AIAssistantPanel() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useI18n();
    const { metrics, transactions, accounts, budgetConfigs } = useFinancial();

    const QUICK_PROMPTS = [
        { icon: TrendingUp, label: t.ai.showCashflow, prompt: "Muéstrame mi flujo de caja de este mes. ¿Cómo van mis ingresos y gastos?" },
        { icon: PieChart, label: t.ai.planBudget, prompt: "Ayúdame a planificar mi presupuesto. ¿Cómo puedo mejorar mis finanzas?" },
        { icon: Receipt, label: t.ai.detectUnusual, prompt: "¿Hay gastos inusuales o patrones de gastos que debería revisar?" },
        { icon: Wallet, label: t.ai.revealBalance, prompt: "Muéstrame un resumen de mi situación financiera actual." },
    ];

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const buildFinancialContext = () => {
        const recentTx = (transactions || []).slice(0, 10);
        return `
Contexto financiero del usuario:
- Balance actual: ${formatCurrency(metrics.balance)}
- Ahorros totales: ${formatCurrency(metrics.totalSavings)}
- Ingresos este mes: ${formatCurrency(metrics.totalIncome)}
- Gastos este mes: ${formatCurrency(metrics.totalExpenses)}
- Tasa de ahorro: ${metrics.savingsRate.toFixed(1)}%
- Número de cuentas: ${(accounts || []).length}
- Número de presupuestos: ${(budgetConfigs || []).length}
- Transacciones recientes: ${recentTx.map(tx => `${tx.description}: ${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}`).join(', ')}
        `.trim();
    };

    const sendMessage = async (promptText: string) => {
        if (!promptText.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: promptText };
        setMessages(prev => [...prev, userMessage]);
        setMessage("");
        setIsLoading(true);

        try {
            const financialContext = buildFinancialContext();

            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "user", content: `${financialContext}\n\nPregunta del usuario: ${promptText}` }
                    ],
                    systemPrompt: "Eres un asistente financiero experto para usuarios en República Dominicana. Responde de forma concisa y útil en español. Usa los datos financieros proporcionados para dar consejos personalizados. Mantén las respuestas cortas (máximo 3-4 oraciones)."
                }),
            });

            if (!response.ok) throw new Error("Error en la respuesta");

            const data = await response.json();
            const assistantMessage: Message = {
                role: "assistant",
                content: data.response || "Lo siento, hubo un error. Intenta de nuevo."
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Lo siento, no pude procesar tu mensaje. Verifica tu conexión e intenta de nuevo."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(message);
    };

    const handleQuickPrompt = (prompt: string) => {
        sendMessage(prompt);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(message);
        }
    };

    return (
        <aside className="fixed right-0 top-0 h-screen w-[340px] bg-white dark:bg-[#1a1f2e] border-l border-slate-100 dark:border-slate-800/50 flex flex-col p-6 z-40">
            {/* Header with menu */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {t.ai.title}
                </span>
                <button
                    onClick={() => setMessages([])}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    title="Limpiar chat"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Messages or Initial State */}
            {messages.length === 0 ? (
                <>
                    {/* Green Orb Animation */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
                            <div className="absolute inset-2 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-full shadow-2xl shadow-emerald-300/50">
                                <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full blur-sm" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="text-white/80" size={28} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-5">
                        {t.ai.whatCanIHelp}
                    </h3>

                    {/* Quick Prompts */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {QUICK_PROMPTS.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickPrompt(prompt.prompt)}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-3 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all text-left group disabled:opacity-50"
                            >
                                <prompt.icon size={14} className="text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="truncate">{prompt.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                /* Chat Messages */
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-2xl text-sm ${msg.role === "user"
                                ? "bg-emerald-500 text-white ml-8"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 mr-4"
                                }`}
                        >
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-3 rounded-2xl mr-4 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            <span className="text-sm">Pensando...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.ai.askAnything}
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg shadow-emerald-200/50"
                    >
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                    </button>
                </div>

                <div className="flex items-center justify-center">
                    <span className="text-[10px] text-slate-400">
                        Powered by Gemini AI • Finanzas RD
                    </span>
                </div>
            </form>
        </aside>
    );
}
