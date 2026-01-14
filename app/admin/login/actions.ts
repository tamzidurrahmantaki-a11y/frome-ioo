'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminLogin(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const supabase = createAdminClient()

    try {
        const { data: admin, error } = await supabase
            .from('admin_credentials')
            .select('*')
            .eq('email', email)
            .single()

        if (error || !admin) {
            console.error('Admin Login Failed:', error)
            return { error: 'Invalid credentials' }
        }

        // DIRECT PASSWORD CHECK (No Hashing as requested)
        if (admin.password !== password) {
            return { error: 'Invalid credentials' }
        }

        // Set Admin Session Cookie
        const cookieStore = await cookies()
        cookieStore.set('admin_session', JSON.stringify({
            id: admin.id,
            email: admin.email,
            role: admin.role,
            timestamp: Date.now()
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        })

        return { success: true }

    } catch (err: any) {
        console.error('Unexpected Admin Login Error:', err)
        return { error: 'An unexpected error occurred' }
    }
}

export async function adminLogout() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/admin/login')
}
