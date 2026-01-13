"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Coins } from "lucide-react";

// Mini sparkline chart component
function MiniChart({ trend }: { trend: "up" | "down" }) {
    const points = trend === "up"
        ? "M0,20 L10,18 L20,15 L30,12 L40,10 L50,8 L60,5"
        : "M0,5 L10,8 L20,10 L30,12 L40,15 L50,18 L60,20";

    return (
        <svg width="60" height="24" viewBox="0 0 60 24" className="ml-auto">
            <path
                d={points}
                fill="none"
                stroke={trend === "up" ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function CryptoFiatSection() {
    const { accounts } = useFinancial();

    // Get investment/savings accounts for display
    const investmentAccounts = accounts.filter(a => a.type === "investment" || a.type === "cash");

    // Mock crypto data (can be replaced with real API)
    const cryptoData = [
        { symbol: "USDT", name: "Tether", balance: 2356.11, change: 0.01, trend: "up" as const },
    ];

    const fiatBalance = accounts
        .filter(a => a.type === "bank" || a.type === "cash")
        .reduce((acc, a) => acc + a.balance, 0);

    return (
        <div className="bg-white dark:bg-[#1a1f2e] rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {/* Crypto Icons Row */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">₿</div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-white flex items-center justify-center text-white text-xs font-bold">X</div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">T</div>
                    </div>
                    <span className="text-xs text-slate-400 ml-1">+16</span>
                </div>

                {/* Tether Card */}
                <div className="flex-1 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Tether</p>
                        <p className="text-xs text-slate-400">USDT</p>
                    </div>
                    <MiniChart trend="up" />
                </div>
            </div>

            {/* Fiat Wallets */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                    <Coins size={16} className="text-emerald-500" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Fiat Wallets</span>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(fiatBalance)}
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                        <TrendingUp size={10} className="text-emerald-500" />
                        <span className="text-xs text-emerald-500">0.01%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
