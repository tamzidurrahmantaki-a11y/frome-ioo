import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
    return (
        <div className={cn(
            "bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300",
            className
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-500" strokeWidth={2} />
                </div>
                {trend && (
                    <div className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-md",
                        trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    )}>
                        {trend.isPositive ? "+" : ""}{trend.value}%
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
            </div>
        </div>
    )
}
