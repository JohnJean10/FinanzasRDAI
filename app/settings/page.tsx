"use client";

import { useFinancial } from "@/lib/context/financial-context";
import { useState } from "react";
import { User, Settings as SettingsIcon, Bell, Database, Save, Trash2 } from "lucide-react";

export default function SettingsPage() {
    const { user, updateUser } = useFinancial();
    const [name, setName] = useState(user.name);
    const [income, setIncome] = useState(user.monthlyIncome.toString());

    const handleSaveProfile = () => {
        updateUser({
            name,
            monthlyIncome: parseFloat(income)
        });
        // Could authorize a toast here
        alert("Perfil actualizado correctamente");
    };

    const handleResetData = () => {
        if (confirm("¿Estás seguro? Esto borrará TODA tu información y no se puede deshacer.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <SettingsIcon className="text-slate-500" />
                    Configuración
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Gestiona tu cuenta y preferencias.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation (Visual only for now) */}
                <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-lg">
                        General
                    </button>
                    <button disabled className="w-full text-left px-4 py-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg opacity-50 cursor-not-allowed">
                        Suscripción (Premium)
                    </button>
                    <button disabled className="w-full text-left px-4 py-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg opacity-50 cursor-not-allowed">
                        Seguridad
                    </button>
                </div>

                <div className="md:col-span-2 space-y-8">
                    {/* Profile Section */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <User size={20} className="text-blue-500" /> Perfil Financiero
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ingreso Mensual (RD$)</label>
                                <input
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100"
                                >
                                    <Save size={16} /> Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Bell size={20} className="text-amber-500" /> Preferencias
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Alertas de Presupuesto</p>
                                    <p className="text-xs text-slate-500">Notificar cuando exceda el 100% de una categoría.</p>
                                </div>
                                <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Moneda Principal</p>
                                    <p className="text-xs text-slate-500">Se aplica a todos los reportes.</p>
                                </div>
                                <select
                                    value={user.currency}
                                    onChange={(e) => updateUser({ currency: e.target.value as any })}
                                    className="bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-sm border-none outline-none"
                                >
                                    <option value="DOP">DOP (RD$)</option>
                                    <option value="USD">USD ($)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
                        <h3 className="font-bold text-lg mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                            <Database size={20} /> Zona de Peligro
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Estas acciones son destructivas y no se pueden deshacer.
                        </p>
                        <button
                            onClick={handleResetData}
                            className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                            <Trash2 size={16} /> Reiniciar Cuenta
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
