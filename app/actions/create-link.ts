'use server'

import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function createLink(formData: FormData) {
    const supabase = await createClient()

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Please log in to track and save links.' }
    }

    const originalUrl = formData.get('url') as string
    if (!originalUrl) {
        return { error: 'URL is required' }
    }

    // Basic URL validation
    let validUrl = originalUrl
    if (!validUrl.startsWith('http')) {
        validUrl = 'https://' + validUrl
    }

    // Generate unique 6-character slug
    const slug = nanoid(6)

    // Insert into DB
    const { data, error } = await supabase
        .from('links')
        .insert({
            original_url: validUrl,
            short_slug: slug,
            user_id: user.id,
            title: new URL(validUrl).hostname || 'New Link'
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating link:', error)
        return { error: 'Failed to create link. Please try again.' }
    }

    revalidatePath('/dashboard')
    return { success: true, slug: slug, originalUrl: validUrl }
}
