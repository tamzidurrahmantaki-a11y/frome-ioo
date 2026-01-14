'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function getPayments(filters?: {
    status?: string
    search?: string
}) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        let query = supabase
            .from('crypto_payments')
            .select('*')
            .order('created_at', { ascending: false })

        if (filters?.status) {
            query = query.eq('status', filters.status)
        }

        if (filters?.search) {
            query = query.or(`user_email.ilike.%${filters.search}%,transaction_hash.ilike.%${filters.search}%`)
        }

        const { data, error } = await query

        if (error) throw error

        return { success: true, data }
    } catch (error) {
        console.error('Error fetching payments:', error)
        return { success: false, error: 'Failed to fetch payments' }
    }
}

export async function verifyPayment(paymentId: string) {
    try {
        await requireAdmin()

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('crypto_payments')
            .update({
                status: 'verified',
                verified_at: new Date().toISOString(),
                verified_by: user.id
            })
            .eq('id', paymentId)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/admin/payments')

        return { success: true, data }
    } catch (error) {
        console.error('Error verifying payment:', error)
        return { success: false, error: 'Failed to verify payment' }
    }
}

export async function updateUserSubscription(userId: string, plan: string) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('users')
            .update({ subscription_plan: plan })
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/admin/payments')
        revalidatePath('/admin/users')

        return { success: true, data }
    } catch (error) {
        console.error('Error updating user subscription:', error)
        return { success: false, error: 'Failed to update user subscription' }
    }
}
