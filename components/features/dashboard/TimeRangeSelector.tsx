"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinancial } from "@/lib/context/financial-context"
import { TimeRange } from "@/lib/types"
import { CalendarDays } from "lucide-react"

export function TimeRangeSelector() {
    const { timeRange, setTimeRange } = useFinancial()

    const labels: Record<TimeRange, string> = {
        thisMonth: "Este Mes",
        lastMonth: "Mes Pasado",
        last3Months: "Últimos 3 Meses (Trimestral)",
        last4Months: "Últimos 4 Meses (Cuatrimestral)",
        last6Months: "Últimos 6 Meses (Semestral)",
        last12Months: "Último Año (Anual)",
        ytd: "Este Año (YTD)",
        all: "Histórico Completo"
    }

    return (
        <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1 shadow-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                <SelectTrigger className="w-[240px] border-0 focus:ring-0 shadow-none h-8 p-0 bg-transparent font-medium">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground opacity-70">
                        Corto Plazo
                    </div>
                    <SelectItem value="thisMonth">{labels.thisMonth}</SelectItem>
                    <SelectItem value="lastMonth">{labels.lastMonth}</SelectItem>

                    <div className="h-px bg-muted my-1" />
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground opacity-70">
                        Mediano Plazo
                    </div>
                    <SelectItem value="last3Months">{labels.last3Months}</SelectItem>
                    <SelectItem value="last4Months">{labels.last4Months}</SelectItem>
                    <SelectItem value="last6Months">{labels.last6Months}</SelectItem>

                    <div className="h-px bg-muted my-1" />
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground opacity-70">
                        Largo Plazo
                    </div>
                    <SelectItem value="last12Months">{labels.last12Months}</SelectItem>
                    <SelectItem value="ytd">{labels.ytd}</SelectItem>
                    <SelectItem value="all">{labels.all}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
