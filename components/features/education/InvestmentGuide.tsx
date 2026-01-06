"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { investmentEducation } from "@/lib/data/education-templates"
import ReactMarkdown from "react-markdown"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Flag, ShieldCheck, TrendingUp } from "lucide-react"

export function InvestmentGuide() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 border-indigo-100/20 dark:border-indigo-800/20 bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Guía de Inversión RD
                    </CardTitle>
                    <CardDescription>
                        Aprende a multiplicar tus ahorros en el mercado dominicano
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                        <ReactMarkdown>{investmentEducation}</ReactMarkdown>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="border-indigo-100/20 dark:border-indigo-800/20 bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Checklist Pre-Inversión
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                            <AlertTitle className="text-amber-800 dark:text-amber-400">Recordatorio Vital</AlertTitle>
                            <AlertDescription className="text-amber-700 dark:text-amber-300 text-xs">
                                "La inversión es el TECHO, no los CIMIENTOS. Primero tu fondo de emergencia."
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded border-gray-300" disabled />
                                <span>Fondo de Emergencia (3-6 meses)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded border-gray-300" disabled />
                                <span>Sin deudas de consumo (&gt;15%)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded border-gray-300" disabled />
                                <span>Objetivo claro para el dinero</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-indigo-100/20 dark:border-indigo-800/20 bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Flag className="h-5 w-5 text-indigo-500" />
                            Fondos Populares en RD
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex justify-between">
                                <span>AFI Reservas</span>
                                <span className="font-semibold text-foreground">Liquidez / Renta Fija</span>
                            </li>
                            <li className="flex justify-between">
                                <span>AFI Popular</span>
                                <span className="font-semibold text-foreground">Plazo 30 días</span>
                            </li>
                            <li className="flex justify-between">
                                <span>AFI BHD</span>
                                <span className="font-semibold text-foreground">Fondo Mutuo</span>
                            </li>
                            <li className="flex justify-between">
                                <span>AFI Universal</span>
                                <span className="font-semibold text-foreground">Diversificados</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
