"use client";

import { useState } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { Account } from "@/lib/types";
import { Plus, Wallet, CreditCard, Building2, PiggyBank, Landmark, MoreVertical, Pencil, Trash2, X, Save, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Icon mapping for account types
const ACCOUNT_ICONS: Record<string, React.ReactNode> = {
    cash: <Wallet className="text-emerald-500" />,
    bank: <Building2 className="text-blue-500" />,
    credit: <CreditCard className="text-red-500" />,
    investment: <PiggyBank className="text-purple-500" />,
    wallet: <Landmark className="text-orange-500" />
};

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
    cash: "Efectivo",
    bank: "Banco",
    credit: "Tarjeta de Crédito",
    investment: "Inversión",
    wallet: "Billetera Digital"
};

export default function AccountsPage() {
    const { accounts, netWorth, addAccount, updateAccount, deleteAccount, getDefaultAccount, setDefaultAccount } = useFinancial();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);

    const handleNew = () => {
        setEditingAccount(null);
        setIsModalOpen(true);
    };

    const handleEdit = (account: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
        setMenuOpen(null);
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta cuenta? Las transacciones se moverán a la cuenta por defecto.")) {
            deleteAccount(id);
        }
        setMenuOpen(null);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
    };

    // Group accounts by type
    const cashAccounts = accounts.filter(a => a.type === 'cash' || a.type === 'wallet');
    const bankAccounts = accounts.filter(a => a.type === 'bank');
    const creditAccounts = accounts.filter(a => a.type === 'credit');
    const investmentAccounts = accounts.filter(a => a.type === 'investment');

    // Totals
    const totalCash = cashAccounts.reduce((sum, a) => sum + a.balance, 0);
    const totalBank = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
    const totalCredit = creditAccounts.reduce((sum, a) => sum + a.balance, 0); // This is debt
    const totalInvestment = investmentAccounts.reduce((sum, a) => sum + a.balance, 0);

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Wallet className="text-blue-600 dark:text-blue-400" />
                        Mis Cuentas
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Gestiona tus cuentas bancarias, efectivo y tarjetas.
                    </p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/10 font-medium"
                >
                    <Plus size={18} />
                    Nueva Cuenta
                </button>
            </div>

            {/* Net Worth Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Patrimonio Neto</p>
                <p className={`text-4xl font-bold mt-1 ${netWorth < 0 ? 'text-red-300' : 'text-white'}`}>
                    {formatCurrency(netWorth)}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-xs text-blue-200">Efectivo</p>
                        <p className="text-lg font-bold">{formatCurrency(totalCash)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-xs text-blue-200">Bancos</p>
                        <p className="text-lg font-bold">{formatCurrency(totalBank)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-xs text-blue-200">Deuda Tarjetas</p>
                        <p className="text-lg font-bold text-red-300">-{formatCurrency(totalCredit)}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-xs text-blue-200">Inversiones</p>
                        <p className="text-lg font-bold">{formatCurrency(totalInvestment)}</p>
                    </div>
                </div>
            </div>

            {/* Account Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map(account => (
                    <div
                        key={account.id}
                        className={`relative bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all hover:shadow-lg group ${account.isDefault
                            ? 'border-blue-300 dark:border-blue-700 ring-2 ring-blue-100 dark:ring-blue-900/50'
                            : 'border-slate-200 dark:border-slate-800'
                            }`}
                    >
                        {/* Default Badge */}
                        {account.isDefault && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Principal
                            </span>
                        )}

                        {/* Menu Button */}
                        <button
                            onClick={() => setMenuOpen(menuOpen === account.id ? null : account.id)}
                            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <MoreVertical size={16} className="text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen === account.id && (
                            <div className="absolute top-10 right-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1 min-w-[180px]">
                                <button
                                    onClick={() => handleEdit(account)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <Pencil size={14} /> Editar
                                </button>
                                {!account.isDefault && (
                                    <button
                                        onClick={() => {
                                            setDefaultAccount(account.id);
                                            setMenuOpen(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    >
                                        <Star size={14} /> Establecer como Principal
                                    </button>
                                )}
                                {!account.isDefault && (
                                    <button
                                        onClick={() => handleDelete(account.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 size={14} /> Eliminar
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Icon & Name */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                                {account.icon || ACCOUNT_ICONS[account.type]}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{account.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                    {ACCOUNT_TYPE_LABELS[account.type]} • {account.currency}
                                </p>
                            </div>
                        </div>

                        {/* Balance */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {account.type === 'credit' ? 'Deuda Consumida' : 'Saldo Disponible'}
                                </span>
                                <span className={`text-2xl font-bold ${account.type === 'credit'
                                    ? (account.balance > 0 ? 'text-red-600' : 'text-emerald-600')
                                    : (account.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600')
                                    }`}>
                                    {account.type === 'credit' && account.balance > 0 && '-'}
                                    {formatCurrency(Math.abs(account.balance))}
                                </span>
                            </div>

                            {/* Credit Limit Progress */}
                            {account.type === 'credit' && account.limit && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Límite: {formatCurrency(account.limit)}</span>
                                        <span>Disponible: {formatCurrency(account.limit - account.balance)}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${(account.balance / account.limit) > 0.8 ? 'bg-red-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${Math.min((account.balance / account.limit) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Empty State / Add Card */}
                {accounts.length === 0 && (
                    <div
                        onClick={handleNew}
                        className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                    >
                        <Plus size={32} className="text-slate-400 mb-2" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Agregar tu primera cuenta</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AccountModal
                isOpen={isModalOpen}
                onClose={handleClose}
                editingAccount={editingAccount}
            />
        </div>
    );
}

// ============ ACCOUNT MODAL ============
interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingAccount: Account | null;
}

function AccountModal({ isOpen, onClose, editingAccount }: AccountModalProps) {
    const { addAccount, updateAccount } = useFinancial();
    const [formData, setFormData] = useState({
        name: "",
        type: "bank" as Account['type'],
        balance: "",
        limit: "",
        currency: "DOP" as "DOP" | "USD",
        icon: "🏦",
        // Investment/Savings fields
        interestRate: "",
        maturityDate: "",
        investmentType: "certificate" as 'certificate' | 'stocks' | 'mutual_fund' | 'other', // Default changed, savings removed
        bankType: "checking" as 'checking' | 'savings', // NEW field
        // Credit Card fields
        minPayment: "",
        paymentFrequency: "monthly" as 'weekly' | 'biweekly' | 'monthly',
        overdraftLimit: "",
        cutoffDay: "",
        paymentDay: ""
    });

    // Populate form when editing
    useState(() => {
        if (editingAccount) {
            setFormData({
                name: editingAccount.name,
                type: editingAccount.type,
                balance: editingAccount.balance.toString(),
                limit: editingAccount.limit?.toString() || "",
                currency: editingAccount.currency,
                icon: editingAccount.icon || "🏦",
                interestRate: editingAccount.interestRate?.toString() || "",
                maturityDate: editingAccount.maturityDate || "",
                investmentType: (editingAccount.investmentType === 'savings' ? 'certificate' : editingAccount.investmentType) || "certificate",
                bankType: editingAccount.bankType || "checking",
                minPayment: editingAccount.minPayment?.toString() || "",
                paymentFrequency: editingAccount.paymentFrequency || "monthly",
                overdraftLimit: editingAccount.overdraftLimit?.toString() || "",
                cutoffDay: editingAccount.cutoffDay?.toString() || "",
                paymentDay: editingAccount.paymentDay?.toString() || ""
            });
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const accountData = {
            name: formData.name,
            type: formData.type,
            balance: parseFloat(formData.balance) || 0,
            limit: formData.type === 'credit' ? parseFloat(formData.limit) || undefined : undefined,
            currency: formData.currency,
            icon: formData.icon,
            // Bank specific
            bankType: formData.type === 'bank' ? formData.bankType : undefined,
            // Investment/Savings fields
            interestRate: (formData.type === 'investment' || (formData.type === 'bank' && formData.bankType === 'savings') || formData.type === 'credit') && formData.interestRate
                ? parseFloat(formData.interestRate) : undefined,
            maturityDate: formData.type === 'investment' && formData.investmentType === 'certificate' && formData.maturityDate
                ? formData.maturityDate : undefined,
            investmentType: formData.type === 'investment' ? formData.investmentType : undefined,
            // Credit Card fields
            minPayment: formData.type === 'credit' ? parseFloat(formData.minPayment) || 0 : undefined,
            paymentFrequency: formData.type === 'credit' ? formData.paymentFrequency : undefined,
            overdraftLimit: formData.type === 'credit' ? parseFloat(formData.overdraftLimit) || 0 : undefined,
            cutoffDay: formData.type === 'credit' ? parseInt(formData.cutoffDay) || undefined : undefined,
            paymentDay: formData.type === 'credit' ? parseInt(formData.paymentDay) || undefined : undefined
        };

        if (editingAccount) {
            updateAccount(editingAccount.id, accountData);
        } else {
            addAccount(accountData);
        }

        onClose();
        // Reset form
        setFormData({ name: "", type: "bank", balance: "", limit: "", currency: "DOP", icon: "🏦", interestRate: "", maturityDate: "", investmentType: "certificate", bankType: "checking", minPayment: "", paymentFrequency: "monthly", overdraftLimit: "", cutoffDay: "", paymentDay: "" });
    };

    const ICONS = ["💵", "🏦", "💳", "📱", "💰", "🏧", "💎", "🪙"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                        {editingAccount ? 'Editar Cuenta' : 'Nueva Cuenta'}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Icon Selector */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Ícono</label>
                        <div className="flex gap-2 flex-wrap">
                            {ICONS.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${formData.icon === icon
                                        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Nombre</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Popular Nómina, Visa BHD"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Tipo de Cuenta</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as Account['type'] })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
                        >
                            <option value="cash">💵 Efectivo</option>
                            <option value="bank">🏦 Banco</option>
                            <option value="credit">💳 Tarjeta de Crédito</option>
                            <option value="investment">📈 Inversión</option>
                            <option value="wallet">📱 Billetera Digital</option>
                        </select>
                    </div>

                    {/* Balance & Currency Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                {formData.type === 'credit' ? 'Deuda Actual' : 'Saldo Actual'}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.balance}
                                onChange={e => setFormData({ ...formData, balance: e.target.value })}
                                placeholder="0.00"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Moneda</label>
                            <select
                                value={formData.currency}
                                onChange={e => setFormData({ ...formData, currency: e.target.value as "DOP" | "USD" })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                            >
                                <option value="DOP">🇩🇴 DOP</option>
                                <option value="USD">🇺🇸 USD</option>
                            </select>
                        </div>
                    </div>

                    {/* Bank Type Selector (only for bank) */}
                    {formData.type === 'bank' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Tipo de Cuenta Bancaria</label>
                            <select
                                value={formData.bankType}
                                onChange={e => setFormData({ ...formData, bankType: e.target.value as any })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
                            >
                                <option value="checking">💳 Cuenta Corriente (Cheques)</option>
                                <option value="savings">💰 Cuenta de Ahorro</option>
                            </select>
                        </div>
                    )}

                    {/* Investment Type Selector (only for investments) */}
                    {formData.type === 'investment' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Tipo de Inversión</label>
                            <select
                                value={formData.investmentType}
                                onChange={e => setFormData({ ...formData, investmentType: e.target.value as any })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
                            >
                                <option value="certificate">📜 Certificado Financiero</option>
                                <option value="stocks">📈 Acciones (Stocks)</option>
                                <option value="mutual_fund">🤝 Fondo Mutuo</option>
                                <option value="other">💎 Otro</option>
                            </select>
                        </div>
                    )}

                    {/* Interest Rate (for investments, bank savings, and CREDIT CARDS) */}
                    {(formData.type === 'investment' || (formData.type === 'bank' && formData.bankType === 'savings') || formData.type === 'credit') && (
                        <div className="animate-in fade-in slide-in-from-top-2 mb-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                {formData.type === 'credit' ? 'Tasa Anual Real (%)' : 'Tasa de Interés Anual (%)'}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.interestRate}
                                onChange={e => setFormData({ ...formData, interestRate: e.target.value })}
                                placeholder={formData.type === 'credit' ? "Ej: 60.00" : "Ej: 5.50"}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
                            />
                        </div>
                    )}

                    {/* Credit Card Specific Fields */}
                    {formData.type === 'credit' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            {/* Min Payment & Frequency */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Pago Mínimo</label>
                                    <input type="number" value={formData.minPayment} onChange={e => setFormData({ ...formData, minPayment: e.target.value })} placeholder="Ej: 1500" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Frecuencia</label>
                                    <select value={formData.paymentFrequency} onChange={e => setFormData({ ...formData, paymentFrequency: e.target.value as any })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white">
                                        <option value="monthly">Mensual</option>
                                        <option value="biweekly">Quincenal</option>
                                        <option value="weekly">Semanal</option>
                                    </select>
                                </div>
                            </div>

                            {/* Credit Limit & Overdraft */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Límite de Crédito</label>
                                    <input type="number" value={formData.limit} onChange={e => setFormData({ ...formData, limit: e.target.value })} placeholder="Ej: 50000" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 text-blue-600 dark:text-blue-400">Límite Sobregiro</label>
                                    <input type="number" value={formData.overdraftLimit} onChange={e => setFormData({ ...formData, overdraftLimit: e.target.value })} placeholder="Ej: 5000" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium" />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Día Corte</label>
                                    <input type="number" min="1" max="31" value={formData.cutoffDay} onChange={e => setFormData({ ...formData, cutoffDay: e.target.value })} placeholder="Ej: 22" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Día Pago</label>
                                    <input type="number" min="1" max="31" value={formData.paymentDay} onChange={e => setFormData({ ...formData, paymentDay: e.target.value })} placeholder="Ej: 16" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium" />
                                </div>
                            </div>
                        </div>
                    )}



                    {/* Maturity Date (only for certificates) */}
                    {formData.type === 'investment' && formData.investmentType === 'certificate' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                Fecha de Vencimiento
                            </label>
                            <input
                                type="date"
                                value={formData.maturityDate}
                                onChange={e => setFormData({ ...formData, maturityDate: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
                            />
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-500 transition-all flex justify-center items-center gap-2 shadow-lg"
                    >
                        <Save size={18} />
                        {editingAccount ? 'Guardar Cambios' : 'Crear Cuenta'}
                    </button>
                </form>
            </div>
        </div>
    );
}
