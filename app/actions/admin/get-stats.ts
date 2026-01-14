'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function getAdminStats() {
    try {
        await requireAdmin()

        const supabase = createAdminClient()

        // Get total users
        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })

        // Get total links
        const { count: totalLinks } = await supabase
            .from('links')
            .select('*', { count: 'exact', head: true })

        // Get total crypto subscriptions
        const { count: totalCryptoSubs } = await supabase
            .from('crypto_payments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'verified')

        return {
            success: true,
            data: {
                totalUsers: totalUsers || 0,
                totalLinks: totalLinks || 0,
                totalCryptoSubscriptions: totalCryptoSubs || 0,
            }
        }
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return {
            success: false,
            error: 'Failed to fetch stats'
        }
    }
}
