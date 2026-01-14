'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function getSupportCards() {
    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('support_cards')
            .select('*')
            .order('order_index', { ascending: true })

        // If table doesn't exist, this returns error, we should handle gracefully or ensure table exists
        if (error) throw error

        return { success: true, data }
    } catch (error) {
        console.error('Error fetching support cards:', error)
        return { success: false, error: 'Failed to fetch support cards' }
    }
}

export async function createSupportCard(cardData: {
    title: string
    description: string
    icon_name?: string
}) {
    try {
        await requireAdmin()

        const supabase = createAdminClient()

        // Get the highest order_index
        const { data: cards } = await supabase
            .from('support_cards')
            .select('order_index')
            .order('order_index', { ascending: false })
            .limit(1)

        const nextOrder = cards && cards.length > 0 ? cards[0].order_index + 1 : 0

        const { data, error } = await supabase
            .from('support_cards')
            .insert([{ ...cardData, order_index: nextOrder }])
            .select()
            .single()

        if (error) throw error

        revalidatePath('/support')
        revalidatePath('/admin/settings')

        return { success: true, data }
    } catch (error) {
        console.error('Error creating support card:', error)
        return { success: false, error: 'Failed to create support card' }
    }
}

export async function updateSupportCard(id: string, cardData: any) {
    try {
        await requireAdmin()

        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('support_cards')
            .update(cardData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/support')
        revalidatePath('/admin/settings')

        return { success: true, data }
    } catch (error) {
        console.error('Error updating support card:', error)
        return { success: false, error: 'Failed to update support card' }
    }
}

export async function deleteSupportCard(id: string) {
    try {
        await requireAdmin()

        const supabase = createAdminClient()

        const { error } = await supabase
            .from('support_cards')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/support')
        revalidatePath('/admin/settings')

        return { success: true }
    } catch (error) {
        console.error('Error deleting support card:', error)
        return { success: false, error: 'Failed to delete support card' }
    }
}

export async function reorderSupportCards(cardIds: string[]) {
    try {
        await requireAdmin()

        const supabase = createAdminClient()

        // Update order_index for each card
        const updates = cardIds.map((id, index) =>
            supabase
                .from('support_cards')
                .update({ order_index: index })
                .eq('id', id)
        )

        await Promise.all(updates)

        revalidatePath('/support')
        revalidatePath('/admin/settings')

        return { success: true }
    } catch (error) {
        console.error('Error reordering support cards:', error)
        return { success: false, error: 'Failed to reorder support cards' }
    }
}
