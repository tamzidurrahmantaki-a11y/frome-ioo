import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/dashboard-layout'

export default async function SharedDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('users')
        .select('subscription_status, country')
        .eq('id', user.id)
        .single()

    // Auto-detect country if missing
    if (!profile?.country || profile.country === 'Unknown') {
        const { updateCountry } = await import('@/app/actions/user/update-country')
        // Fire and forget - don't await to avoid blocking render
        updateCountry()
    }

    const { count } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    return (
        <DashboardSidebar
            user={user}
            subscriptionStatus={profile?.subscription_status || 'free'}
            linksCount={count || 0}
        >
            {children}
        </DashboardSidebar>
    )
}
