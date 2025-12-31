"use client"

import * as React from "react"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

const presets = [
    { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
    { label: "Last 7 Days", getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
    { label: "Last Month", getValue: () => ({ from: startOfMonth(subDays(new Date(), 30)), to: endOfMonth(subDays(new Date(), 30)) }) },
    { label: "Last Quarter", getValue: () => ({ from: startOfQuarter(subDays(new Date(), 90)), to: endOfQuarter(subDays(new Date(), 90)) }) },
    { label: "Last Year", getValue: () => ({ from: startOfYear(subDays(new Date(), 365)), to: new Date() }) },
    { label: "This Month", getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
    { label: "All Time", getValue: () => ({ from: new Date(2024, 0, 1), to: new Date() }) },
]

export function DateRangePicker({ align = "left" }: { align?: "left" | "right" }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")

    const [range, setRange] = React.useState<{ from: Date | undefined, to: Date | undefined }>(() => {
        if (fromParam && toParam) {
            return { from: new Date(fromParam), to: new Date(toParam) }
        }
        return { from: subDays(new Date(), 6), to: new Date() }
    })

    const handleSelectPreset = (presetRange: { from: Date, to: Date }) => {
        setRange(presetRange)
        applyRange(presetRange)
    }

    const applyRange = (newRange: { from: Date | undefined, to: Date | undefined }) => {
        if (newRange.from && newRange.to) {
            const params = new URLSearchParams(searchParams)
            params.set("from", newRange.from.toISOString())
            params.set("to", newRange.to.toISOString())
            router.push(`${pathname}?${params.toString()}`)
            setIsOpen(false)
        }
    }

    const currentLabel = React.useMemo(() => {
        const match = presets.find(p => {
            const val = p.getValue()
            return val.from.toDateString() === range.from?.toDateString() &&
                val.to.toDateString() === range.to?.toDateString()
        })
        if (match) return match.label
        if (range.from && range.to) return `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd")}`
        return "Select range"
    }, [range])

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="ghost"
                className="bg-[#1A1D21] text-white hover:bg-black gap-3 rounded-md h-9 px-4 font-bold transition-all text-[11px] uppercase tracking-[0.15em] border-none shadow-xl shadow-black/10"
            >
                <CalendarIcon className="w-3.5 h-3.5 text-white" />
                {currentLabel}
                <ChevronDown className={cn("w-3 h-3 transition-transform text-white/60", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className={cn(
                        "absolute top-full mt-3 bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 min-w-[500px]",
                        align === "left" ? "left-0" : "right-0"
                    )}>
                        {/* Presets Sidebar */}
                        <div className="w-[160px] bg-gray-50/50 p-3 border-r border-gray-100 space-y-1">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => handleSelectPreset(preset.getValue())}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium uppercase tracking-widest transition-all",
                                        currentLabel === preset.label ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-white"
                                    )}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        {/* Calendar View */}
                        <div className="p-4">
                            <style>{`
                                .rdp { --rdp-accent-color: #000; --rdp-background-color: #f3f4f6; margin: 0; }
                                .rdp-day_selected { background-color: black !important; color: white !important; font-weight: 600; border-radius: 8px; }
                                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #f3f4f6; border-radius: 8px; }
                                .rdp-head_cell { font-size: 13px; font-weight: 500; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.1em; }
                                .rdp-nav_button { background-color: transparent !important; border: 1px solid #f3f4f6; border-radius: 8px; }
                            `}</style>
                            <DayPicker
                                mode="range"
                                selected={{ from: range.from, to: range.to }}
                                onSelect={(newRange) => {
                                    setRange({ from: newRange?.from, to: newRange?.to })
                                    if (newRange?.from && newRange?.to) {
                                        applyRange({ from: newRange.from, to: newRange.to })
                                    }
                                }}
                                styles={{
                                    caption: { fontWeight: '500', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' },
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
