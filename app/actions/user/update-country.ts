'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function updateCountry() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const headersList = await headers()
        const countryCode = headersList.get('x-vercel-ip-country') || 'Unknown'

        // Convert code to full name
        let country = countryCode
        if (countryCode !== 'Unknown') {
            try {
                const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
                country = regionNames.of(countryCode) || countryCode
            } catch (e) {
                // fallback to code if conversion fails
                console.warn('Country name conversion failed', e)
            }
        }

        // Only update if we have a valid country and it differs from current or if current is missing
        if (country && country !== 'Unknown') {

            // Optimization: We could check current DB value first, but a direct update is cheap enough if triggered sparingly.
            // We rely on the layout component to only call this if country is missing/unknown.

            const { error } = await supabase
                .from('users')
                .update({ country: country })
                .eq('id', user.id)

            if (error) {
                console.error('Failed to update country:', error)
            }
        }
    } catch (error) {
        console.error('Error in updateCountry:', error)
    }
}
