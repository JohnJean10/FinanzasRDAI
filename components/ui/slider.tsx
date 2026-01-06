
import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified Slider without Radix UI
// Supports single value range via value={[val]}
const Slider = React.forwardRef<HTMLInputElement, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & { onValueChange?: (value: number[]) => void, max?: number, min?: number, step?: number, value?: number[] }>(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onValueChange) {
            onValueChange([parseFloat(e.target.value)])
        }
    }

    return (
        <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
            <input
                type="range"
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                min={min}
                max={max}
                step={step}
                value={value ? value[0] : min}
                onChange={handleChange}
                ref={ref}
                {...props}
            />
        </div>
    )
})
Slider.displayName = "Slider"

export { Slider }
