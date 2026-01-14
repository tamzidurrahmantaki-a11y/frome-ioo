"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SmartLinkProps {
    slug: string
    className?: string
}

export function LinkDisplay({ slug, className }: SmartLinkProps) {
    const [mounted, setMounted] = useState(false)

    useState(() => {
        setMounted(true)
    })

    const [namePart, idPart] = slug.split('/')

    return (
        <div
            className={cn(
                "flex items-center gap-3 bg-black/40 px-5 py-2.5 rounded-full border border-white/5 shadow-lg shadow-black/5 min-w-0",
                className
            )}
        >
            <div className="flex items-center gap-0.5 min-w-0 flex-1 overflow-hidden">
                <span className="text-[9px] font-bold text-white/30 tracking-tight uppercase shrink-0">
                    {mounted ? window.location.host.replace('www.', '') : 'frome.io'}/
                </span>
                <span className="text-[11px] font-black text-[#00C975] tracking-tight truncate flex-1 min-w-0">
                    {namePart}
                </span>
                <span className="text-[10px] font-bold text-white/50 tracking-tight shrink-0">
                    {idPart && `/${idPart.slice(0, 4)}...`}
                </span>
            </div>
        </div>
    )
}
