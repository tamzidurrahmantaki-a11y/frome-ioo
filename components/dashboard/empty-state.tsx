import React from 'react'
import { LucideIcon, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    title: string
    description: string
    icon?: LucideIcon
    className?: string
}

export function EmptyState({
    title,
    description,
    icon: Icon = BarChart3,
    className
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-12 px-4 text-center bg-white/50 rounded-xl border border-dashed border-gray-200 animate-in fade-in duration-700",
            className
        )}>
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Icon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-black mb-2 tracking-tight">{title}</h3>
            <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed">
                {description}
            </p>
        </div>
    )
}
