"use client"

import { useState, useEffect } from "react"
import { Tag, Clock, Navigation2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { formatRelativeTime } from "@/lib/utils"
import { SmartLink } from "@/components/dashboard/smart-link"
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
    const supabase = createClient()

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

    if (links.length === 0) {
        return (
            <div className="bg-[#F8F9FA] p-12 rounded-xl text-center border-2 border-dashed border-[#F1F3F5]">
                <p className="text-gray-400 font-medium tracking-tight font-outfit uppercase tracking-widest text-[10px]">No links generated yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {links.map((link) => (
                <div key={link.id} className="group bg-[#F8F9FA] p-2 rounded-2xl items-center grid grid-cols-12 gap-4 border border-transparent hover:border-[#F1F3F5] transition-all">
                    <div className="col-span-12 bg-white rounded-xl p-4 grid grid-cols-12 items-center gap-6 shadow-sm border border-[#F1F3F5]/50 hover:shadow-md transition-shadow">
                        {/* Link Icon & Details */}
                        <div className="col-span-12 md:col-span-3 flex items-center gap-4">
                            <div className="bg-black p-3 rounded-xl shrink-0 text-white shadow-lg shadow-black/10">
                                <Tag className="w-4 h-4 transform rotate-90" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-black text-sm truncate uppercase tracking-tight leading-none mb-1.5">
                                    {link.title || link.short_slug}
                                </p>
                                <div className="flex items-center gap-1">
                                    <p className="text-[11px] text-gray-400 font-medium truncate">https://{link.short_slug}.net</p>
                                </div>
                            </div>
                        </div>

                        {/* Destination URL */}
                        <div className="hidden md:flex col-span-1 items-center text-[11px] font-medium text-gray-400 truncate pr-4 italic">
                            {link.original_url}
                        </div>

                        {/* Last Click Timing - Real-time Reactive */}
                        <div className="hidden lg:flex col-span-2 items-center gap-2 text-[11px] font-bold text-black min-w-[120px]">
                            <Clock className="w-3.5 h-3.5 text-[#00C975]" />
                            <span className="tabular-nums">{formatRelativeTime(link.last_clicked_at || '')}</span>
                        </div>

                        {/* Total Click Counter */}
                        <div className="hidden lg:flex col-span-1 items-center gap-2 text-[11px] font-bold text-black/80">
                            <Navigation2 className="w-3 h-3 fill-[#00C975] text-[#00C975]" />
                            <span className="tabular-nums">{link.clicks}</span>
                        </div>

                        {/* Created Date Metadata - Subtle Gray */}
                        <div className="hidden xl:flex col-span-2 items-center gap-2 text-[11px] font-bold text-black/30">
                            <Calendar className="w-3.5 h-3.5 text-gray-300" />
                            <span>{format(new Date(link.created_at), 'MMM d, yyyy')}</span>
                        </div>

                        {/* Interactive Actions - Increased Spacing to avoid overlap */}
                        <div className="col-span-12 lg:col-span-3 flex items-center justify-between lg:justify-end gap-6 pl-4">
                            <SmartLink slug={link.short_slug} className="w-full xl:w-[180px]" />
                            <div className="shrink-0">
                                <LinkActions link={link} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
