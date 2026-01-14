"use client"

import { useState, useEffect } from "react"
import { Tag, Clock, Navigation2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { formatRelativeTime } from "@/lib/utils"
import { LinkDisplay } from "@/components/dashboard/smart-link"
import { LinkActions } from "@/components/dashboard/link-actions"
import { createClient } from "@/lib/supabase/client"

interface Link {
    id: string
    title: string
    short_slug: string
    original_url: string
    clicks: number
    last_clicked_at: string | null
    created_at: string
}

interface RealtimeLinkListProps {
    initialLinks: Link[]
}

export function RealtimeLinkList({ initialLinks }: RealtimeLinkListProps) {
    const [links, setLinks] = useState(initialLinks)
    const [mounted, setMounted] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const channel = supabase
            .channel('realtime-links-list')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'links'
                },
                (payload) => {
                    console.log('Real-time Update Payload:', payload)
                    const updatedLink = payload.new as any
                    setLinks(prev => prev.map(link => {
                        if (link.id === updatedLink.id) {
                            return {
                                ...link,
                                clicks: updatedLink.total_clicks || 0,
                                last_clicked_at: updatedLink.last_clicked_at || null
                            }
                        }
                        return link
                    }))
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'links'
                },
                (payload) => {
                    const newLink = payload.new as any
                    // Ensure the new link has the flat 'clicks' and 'last_clicked_at' keys our UI expects
                    const formattedLink = {
                        ...newLink,
                        clicks: newLink.total_clicks || 0,
                        last_clicked_at: newLink.last_clicked_at || null
                    }
                    setLinks(prev => [formattedLink, ...prev])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    // Sync state if server data changes (e.g. from a separate refresh)
    useEffect(() => {
        setLinks(initialLinks)
    }, [initialLinks])

    if (!mounted) return null

    if (links.length === 0) {
        return (
            <div className="bg-card p-12 rounded-xl text-center border-2 border-dashed border-border/50">
                <p className="text-muted-foreground font-medium tracking-tight font-outfit uppercase tracking-widest text-[10px]">No links generated yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {links.map((link) => (
                <div key={link.id} className="group bg-card p-1 md:p-2 rounded-2xl items-center grid grid-cols-12 gap-2 md:gap-4 border border-transparent hover:border-border transition-all">
                    <div className="col-span-12 bg-background rounded-xl p-4 md:p-4 grid grid-cols-12 items-center gap-4 md:gap-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                        {/* Link Icon & Details */}
                        <div className="col-span-12 md:col-span-3 flex items-center gap-3 md:gap-4 overflow-hidden">
                            <div className="bg-foreground/5 p-2.5 md:p-3 rounded-xl shrink-0 text-foreground shadow-lg shadow-black/10">
                                <Tag className="w-4 h-4 transform rotate-90" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-black text-foreground text-sm truncate uppercase tracking-tight leading-none mb-1 md:mb-1.5">
                                    {link.title || link.short_slug}
                                </p>
                                <div className="flex items-center gap-1 overflow-hidden">
                                    <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium truncate italic opacity-60">
                                        {typeof window !== 'undefined' ?
                                            window.location.host.replace('www.', '') :
                                            'frome.io'}/{link.short_slug}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Destination URL */}
                        <div className="hidden md:flex col-span-1 items-center text-[11px] font-medium text-muted-foreground truncate pr-4 italic">
                            {link.original_url}
                        </div>

                        {/* Last Click Timing - Real-time Reactive */}
                        <div className="hidden lg:flex col-span-2 items-center gap-2 text-[11px] font-bold text-foreground min-w-[100px]">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span className="tabular-nums">{formatRelativeTime(link.last_clicked_at || '')}</span>
                        </div>

                        {/* Total Click Counter */}
                        <div className="hidden lg:flex col-span-1 items-center gap-2 text-[11px] font-bold text-foreground/80">
                            <Navigation2 className="w-3 h-3 fill-primary text-primary" />
                            <span className="tabular-nums">{link.clicks}</span>
                        </div>

                        {/* Created Date Metadata - Subtle Gray */}
                        <div className="hidden xl:flex col-span-1 items-center gap-2 text-[11px] font-bold text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/50" />
                            <span>{format(new Date(link.created_at), 'MMM d')}</span>
                        </div>

                        {/* Interactive Actions - Reset layout for clean separation */}
                        <div className="col-span-12 lg:col-span-4 flex flex-row flex-wrap lg:flex-nowrap items-center justify-between lg:justify-end gap-6 md:gap-6 mt-2 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/10 overflow-hidden">
                            {/* Link Text: Ensures it stays on the left and truncates */}
                            <div className="flex-1 min-w-0 truncate">
                                <LinkDisplay slug={link.short_slug} className="w-full" />
                            </div>

                            {/* Action Group + Edit: Maintain size and space */}
                            <div className="shrink-0 flex items-center">
                                <LinkActions link={link} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
