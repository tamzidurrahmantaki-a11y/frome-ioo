import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Check if a user has admin role
 */
export async function isAdmin(userId?: string): Promise<boolean> {
    const supabase = await createClient()

    const uid = userId || (await supabase.auth.getUser()).data.user?.id

    if (!uid) return false

    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', uid)
        .single()

    if (error || !data) return false

    return data.role === 'admin'
}

/**
 * Get current admin user or null
 */
export async function getAdminUser() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const isAdminUser = await isAdmin(user.id)

    if (!isAdminUser) return null

    return user
}

/**
 * Server-side guard that redirects if not admin
 * Use this in admin page components
 */
export async function requireAdmin() {
    const adminUser = await getAdminUser()

    if (!adminUser) {
        redirect('/')
    }

    return adminUser
}

/**
 * Get user profile with role
 */
export async function getUserProfile(userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    return { data, error }
}
