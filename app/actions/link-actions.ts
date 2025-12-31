'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteLink(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Delete Error:', error)
        return { error: 'Failed to delete link' }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateLink(id: string, updates: { title?: string, original_url?: string, short_slug?: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // If slug is being updated, check if it's taken
    if (updates.short_slug) {
        const { data: existing } = await supabase
            .from('links')
            .select('id')
            .eq('short_slug', updates.short_slug)
            .neq('id', id)
            .single()

        if (existing) {
            return { error: 'This custom link is already taken' }
        }
    }

    // Ensure URL has protocol
    if (updates.original_url && !updates.original_url.startsWith('http')) {
        updates.original_url = 'https://' + updates.original_url
    }

    const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Update Error:', error)
        return { error: 'Failed to update link' }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
