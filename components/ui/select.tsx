
import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified Select using native select for robustness without Radix
// This adapts the Shadcn API to a native select element

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (val: string) => void;
} | null>(null);

const Select = ({ value, onValueChange, children }: { value: string, onValueChange: (val: string) => void, children: React.ReactNode }) => {
    return (
        <SelectContext.Provider value={{ value, onValueChange }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    )
}

// Trigger renders a button that looks like a select, but we'll cheat and make it a real select for this "lite" version
// Actually, to support the API cleanly: <Select> <SelectTrigger>...</SelectTrigger> <SelectContent>...</SelectContent> </Select>
// Implementing a custom dropdown is hard without Radix/Popper.
// PLAN B: Make a simplified version that renders a NATIVE select but tries to style it, 
// OR just render the children.
// For this MVP file fix, let's create a functional fake that uses native select under the hood if possible, or just build a simple custom one.

// Let's go with a simple custom open/close state.
const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => {
    // In a real simplified version, we might just show the current value
    // But we need to toggle the content.
    // Let's actually use a native select because implementing a custom dropdown from scratch is error prone for z-index/focus.
    // BUT the usage code expects:
    // <Select> <SelectTrigger> <SelectValue /> </SelectTrigger> <SelectContent> <SelectItem /> </SelectContent> </Select>

    // We will implement a "Hack" where SelectContent renders relatively below.

    return (
        <button ref={ref} className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>
            {children}
        </button>
    )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => {
    // This usually displays the selected label.
    // We would need the context to find the label for the value.
    const context = React.useContext(SelectContext);
    return <span ref={ref} className={className} {...props}>{context?.value}</span>
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    // Simplest approach: Render inline (expanded) or try absolute.
    // We'll trust the user clicks the trigger to toggle visibility in a real app.
    // But here we didn't implement the toggle logic in root.
    // Let's upgrade the Root to have state.
    return (
        <div ref={ref} className={cn("absolute top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80", className)} {...props}>
            <div className="p-1">{children}</div>
        </div>
    )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(({ className, children, value, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    return (
        <div
            ref={ref}
            className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
            onClick={() => context?.onValueChange(value)}
            {...props}
        >
            {children}
        </div>
    )
})
SelectItem.displayName = "SelectItem"

// Redefine Select to hold open state for the trigger/content interaction
const SelectWithState = ({ value, onValueChange, children }: { value: string, onValueChange: (val: string) => void, children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);

    // We need to pass setOpen to Trigger and Content to handle clicks.
    // This requires cloning children or a more complex context.

    // simplified: just wrap context. The components above are separate exports.
    // Use a context that includes open/setOpen

    return (
        <SelectContext.Provider value={{ value, onValueChange }}>
            <StateContext.Provider value={{ open, setOpen }}>
                <div className="relative group">
                    {children}
                </div>
            </StateContext.Provider>
        </SelectContext.Provider>
    )
}

const StateContext = React.createContext<{ open: boolean, setOpen: (v: boolean) => void } | null>(null);

// Re-implement Trigger to use StateContext
const Trigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => {
    const state = React.useContext(StateContext);
    return (
        <button
            ref={ref}
            type="button"
            onClick={() => state?.setOpen(!state.open)}
            className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
            {...props}
        >
            {children}
        </button>
    )
})
Trigger.displayName = "SelectTrigger"

const Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const state = React.useContext(StateContext);
    if (!state?.open) return null;

    return (
        <div
            ref={ref}
            className={cn("absolute top-full mt-1 z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-card text-popover-foreground shadow-md animate-in fade-in-80", className)}
            {...props}
        >
            <div className="p-1" onClick={() => state.setOpen(false)}>{children}</div>
        </div>
    )
})
Content.displayName = "SelectContent"


export { SelectWithState as Select, Trigger as SelectTrigger, SelectValue, Content as SelectContent, SelectItem }
