'use server'

import { createClient } from '@/lib/supabase/server'
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

export async function createFaq(faqData: {
    question: string
    answer: string
}) {
    try {
        await requireAdmin()

        const supabase = await createClient()

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

        revalidatePath('/support')
        revalidatePath('/admin/content')

        return { success: true, data }
    } catch (error) {
        console.error('Error creating FAQ:', error)
        return { success: false, error: 'Failed to create FAQ' }
    }
}

export async function updateFaq(id: string, faqData: {
    question?: string
    answer?: string
    is_active?: boolean
}) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('faqs')
            .update(faqData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/support')
        revalidatePath('/admin/content')

        return { success: true, data }
    } catch (error) {
        console.error('Error updating FAQ:', error)
        return { success: false, error: 'Failed to update FAQ' }
    }
}

export async function deleteFaq(id: string) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        const { error } = await supabase
            .from('faqs')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/support')
        revalidatePath('/admin/content')

        return { success: true }
    } catch (error) {
        console.error('Error deleting FAQ:', error)
        return { success: false, error: 'Failed to delete FAQ' }
    }
}

export async function toggleFaqActive(id: string, isActive: boolean) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('faqs')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/support')
        revalidatePath('/admin/content')

        return { success: true, data }
    } catch (error) {
        console.error('Error toggling FAQ active:', error)
        return { success: false, error: 'Failed to toggle FAQ active' }
    }
}

export async function reorderFaqs(faqIds: string[]) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        // Update order_index for each FAQ
        const updates = faqIds.map((id, index) =>
            supabase
                .from('faqs')
                .update({ order_index: index })
                .eq('id', id)
        )

        await Promise.all(updates)

        revalidatePath('/support')
        revalidatePath('/admin/content')

        return { success: true }
    } catch (error) {
        console.error('Error reordering FAQs:', error)
        return { success: false, error: 'Failed to reorder FAQs' }
    }
}
