import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Check if the request has a valid admin session cookie
 */
export async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) return false

    try {
        const session = JSON.parse(sessionCookie.value)
        // Basic validation: check if it has an id and role
        return Boolean(session?.id && session?.role)
    } catch {
        return false
    }
}

/**
 * Get current admin user from cookie
 */
export async function getAdminUser() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) return null

    try {
        return JSON.parse(sessionCookie.value)
    } catch {
        return null
    }
}

/**
 * Server-side guard that redirects if not admin
 * Use this in admin page components and server actions
 */
export async function requireAdmin() {
    const adminUser = await getAdminUser()

    if (!adminUser) {
        redirect('/admin/login')
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
