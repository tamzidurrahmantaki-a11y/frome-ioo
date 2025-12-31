import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { url, title, customSlug } = await request.json()

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        // Basic URL validation
        let validUrl = url
        if (!validUrl.startsWith('http')) {
            validUrl = 'https://' + validUrl
        }

        let slug = customSlug?.trim()

        if (slug) {
            // Check if custom slug is taken
            const { data: existing } = await supabase
                .from('links')
                .select('id')
                .eq('short_slug', slug)
                .single()

            if (existing) {
                return NextResponse.json({ error: 'This custom link is already taken' }, { status: 400 })
            }
        } else {
            slug = nanoid(6)
        }

        const { data, error } = await supabase
            .from('links')
            .insert({
                original_url: validUrl,
                short_slug: slug,
                user_id: user.id,
                title: title || new URL(validUrl).hostname || 'New Link'
            })
            .select()
            .single()

        if (error) {
            console.error('API Error:', error)
            return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 })
        }

        return NextResponse.json({ success: true, slug, originalUrl: validUrl })
    } catch (err) {
        console.error('API Catch:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
