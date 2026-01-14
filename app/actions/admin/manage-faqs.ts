'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function getFaqs() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('order_index', { ascending: true })

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Error fetching FAQs:', error)
        return { success: false, error: 'Failed to fetch FAQs' }
    }
}

export async function createFaq(faqData: { question: string; answer: string }) {
    try {
        await requireAdmin()
        const supabase = createAdminClient()

        // Get the highest order_index
        const { data: faqs } = await supabase
            .from('faqs')
            .select('order_index')
            .order('order_index', { ascending: false })
            .limit(1)

        const nextOrder = faqs && faqs.length > 0 ? faqs[0].order_index + 1 : 0

        const { data, error } = await supabase
            .from('faqs')
            .insert([{ ...faqData, order_index: nextOrder }])
            .select()
            .single()

        if (error) throw error

        revalidatePath('/admin/support')
        revalidatePath('/support')
        return { success: true, data }
    } catch (error) {
        console.error('Error creating FAQ:', error)
        return { success: false, error: 'Failed to create FAQ' }
    }
}

export async function updateFaq(id: string, faqData: any) {
    try {
        await requireAdmin()
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('faqs')
            .update(faqData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/admin/support')
        revalidatePath('/support')
        return { success: true, data }
    } catch (error) {
        console.error('Error updating FAQ:', error)
        return { success: false, error: 'Failed to update FAQ' }
    }
}

export async function deleteFaq(id: string) {
    try {
        await requireAdmin()
        const supabase = createAdminClient()

        const { error } = await supabase
            .from('faqs')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/support')
        revalidatePath('/support')
        return { success: true }
    } catch (error) {
        console.error('Error deleting FAQ:', error)
        return { success: false, error: 'Failed to delete FAQ' }
    }
}

export async function toggleFaqActive(id: string, isActive: boolean) {
    return updateFaq(id, { is_active: isActive })
}
