"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SmartLinkProps {
    slug: string
    className?: string
}

export function SmartLink({ slug, className }: SmartLinkProps) {
    const [copied, setCopied] = useState(false)
    const getFullUrl = () => {
        if (typeof window === 'undefined') return ''
        const host = window.location.host.replace('www.', '')
        const protocol = window.location.protocol
        return `${protocol}//${host}/${slug}`
    }

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            await navigator.clipboard.writeText(getFullUrl())
            setCopied(true)
            toast.success("Link copied!")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Failed to copy link")
        }
    }

    const handleVisit = (e: React.MouseEvent) => {
        e.stopPropagation()
        const fullUrl = getFullUrl()
        if (fullUrl) window.open(fullUrl, '_blank')
    }

    const [namePart, idPart] = slug.split('/')

    return (
        <div
            className={cn(
                "group flex items-center justify-between gap-3 bg-black hover:bg-black/90 px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-lg shadow-black/5",
                className
            )}
            onClick={handleCopy}
            title="Click to copy"
        >
            <div className="flex items-center gap-1 min-w-0">
                <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
                    {typeof window !== 'undefined' ?
                        window.location.host.replace('www.', '') :
                        'frome.io'}/
                </span>
                <span className="text-[11px] font-bold text-[#00C975] tracking-widest truncate">
                    {namePart}
                </span>
                <span className="text-[11px] font-bold text-white/60 tracking-widest">
                    /{idPart}
                </span>
            </div>

            <div className="flex items-center shrink-0">
                {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#00C975] animate-in zoom-in duration-200" />
                ) : (
                    <Copy className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors" />
                )}
            </div>
        </div>
    )
}
