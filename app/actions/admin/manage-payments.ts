'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function getPayments(filters?: {
    status?: string
    search?: string
}) {
    try {
        await requireAdmin()

        const supabase = createAdminClient()

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
        const admin = await requireAdmin()

        const supabase = createAdminClient()

        // 1. Verify and get the payment details
        const { data: payment, error: updateError } = await supabase
            .from('crypto_payments')
            .update({
                status: 'verified',
                verified_at: new Date().toISOString(),
                verified_by: admin.id
            })
            .eq('id', paymentId)
            .select()
            .single()

        if (updateError) throw updateError

        // 2. If payment has a user_id, upgrade them
        if (payment && payment.user_id) {
            const { error: userError } = await supabase
                .from('users')
                .update({ subscription_plan: 'Pro' }) // Default upgrade, or logic based on amount
                .eq('id', payment.user_id)

            if (userError) {
                console.error('Failed to upgrade user after payment:', userError)
                // We don't throw here to avoid rolling back the verification, but we log it
            }
        }

        revalidatePath('/admin/payments')
        revalidatePath('/admin/users')

        return { success: true, data: payment }
    } catch (error) {
        console.error('Error verifying payment:', error)
        return { success: false, error: 'Failed to verify payment' }
    }
}

export async function updateUserSubscription(userId: string, plan: string) {
    try {
        await requireAdmin()

        const supabase = createAdminClient()

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
