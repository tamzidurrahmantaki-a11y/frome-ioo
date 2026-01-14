'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'

export async function getUsers(filters?: {
    search?: string
    plan?: string
}) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        let query = supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        if (filters?.search) {
            query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`)
        }

        if (filters?.plan) {
            query = query.eq('subscription_plan', filters.plan)
        }

        const { data, error } = await query

        if (error) throw error

        // Get link count for each user
        const usersWithStats = await Promise.all(
            (data || []).map(async (user) => {
                const { count } = await supabase
                    .from('links')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)

                return {
                    ...user,
                    linkCount: count || 0
                }
            })
        )

        return { success: true, data: usersWithStats }
    } catch (error) {
        console.error('Error fetching users:', error)
        return { success: false, error: 'Failed to fetch users' }
    }
}
