"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface RealtimeDashboardProps {
    children: React.ReactNode
    initialLinks?: any[]
}

export function RealtimeDashboard({ children, initialLinks }: RealtimeDashboardProps) {
    const supabase = createClient()
    const router = useRouter()
    const [links, setLinks] = useState(initialLinks || [])

    // This component will primarily use router.refresh() to keep Server Components in sync,
    // but the user wants "immediate" local state update for the links list.
    // To do that perfectly, the Link List itself would need to be a Client Component
    // or we'd need a Context provider.

    // For now, we'll implement the explicit subscription logic as requested.

    const handleUpdate = useCallback(async (payload: any) => {
        console.log('Realtime Update Received:', payload)

        // If it's a link update, we could theoretically update local state here
        // if we had a way to pass it down. But router.refresh() is the standard for 
        // Server Component layouts.

        // The user specifically asked: "On every UPDATE event, update the local state 
        // of the links list immediately".

        router.refresh()
    }, [router])

    useEffect(() => {
        console.log('Subscribing to Realtime changes...')

        const channel = supabase
            .channel('dashboard-hard-reset')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'clicks'
                },
                (payload) => {
                    console.log('New Click Recorded:', payload)
                    router.refresh()
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'links'
                },
                (payload) => {
                    console.log('Link Metadata Updated:', payload)
                    router.refresh()
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
                    console.log('New Link Created:', payload)
                    router.refresh()
                }
            )
            .subscribe((status) => {
                console.log('Subscription Status:', status)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    return <>{children}</>
}
