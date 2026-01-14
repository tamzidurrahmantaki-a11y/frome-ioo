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
            "bg-[#fcfcfc] border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300",
            className
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#00C975]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#00C975]" strokeWidth={2} />
                </div>
                {trend && (
                    <div className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-md",
                        trend.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                        {trend.isPositive ? "+" : ""}{trend.value}%
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-black">{value.toLocaleString()}</p>
            </div>
        </div>
    )
}
