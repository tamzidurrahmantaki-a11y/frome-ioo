import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

export default async function TrackingPage({
    params,
}: {
    params: Promise<{ slug: string[] }>
}) {
    const { slug } = await params
    // Join the array segments into a single path (e.g. ['campaign', 'abc123'] -> 'campaign/abc123')
    const fullSlug = slug.join('/')

    const supabase = await createClient()
    const headerList = await headers()

    // 1. Fetch the original URL using the full slug path
    const { data: link, error: linkError } = await supabase
        .from('links')
        .select('id, original_url')
        .eq('short_slug', fullSlug)
        .single()

    if (linkError || !link) {
        console.error('Tracking: Link not found for path', fullSlug)
        return redirect('/')
    }

    // 2. Extract Metadata with robust fallbacks
    let country = 'Unknown'
    let browser = 'Unknown'
    let os = 'Unknown'
    let device = 'Desktop'
    let ip = '8.8.8.8'
    const referrer = headerList.get('referer') || 'Direct'

    try {
        const uaString = headerList.get('user-agent') || ''
        const parser = new UAParser(uaString)
        const ua = parser.getResult()

        browser = ua.browser.name || 'Unknown'
        os = ua.os.name || 'Unknown'
        device = ua.device.type ? (ua.device.type.charAt(0).toUpperCase() + ua.device.type.slice(1)) : 'Desktop'

        const xForwardedFor = headerList.get('x-forwarded-for')
        ip = xForwardedFor ? xForwardedFor.split(',')[0] : '8.8.8.8'

        if (ip === '::1' || ip === '127.0.0.1') {
            ip = '103.147.218.242'
        }

        country = headerList.get('x-vercel-ip-country') || 'Unknown'
        if (country === 'Unknown') {
            try {
                const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country`)
                const geoData = await geoRes.json()
                if (geoData && geoData.status === 'success') {
                    country = geoData.country || 'Unknown'
                }
            } catch (e) {
                console.error('IP-API Fallback Failed')
            }
        }
    } catch (e) {
        console.error('Metadata parsing error:', e)
    }

    // 3. SECURE DATABASE RECORDING
    try {
        const { error: insertError } = await supabase.from('clicks').insert({
            link_id: link.id,
            country: country,
            ip_address: ip,
            browser: browser,
            os: os,
            device: device,
            referrer: referrer
        })

        if (insertError) {
            console.error('Click Insert Error:', insertError.message)
        }

        const { error: rpcError } = await supabase.rpc('increment_link_clicks', {
            link_id: link.id
        })

        if (rpcError) {
            console.error('Counter Sync Failed, trying manual update:', rpcError.message)
            await supabase
                .from('links')
                .update({ last_clicked_at: new Date().toISOString() })
                .eq('id', link.id)
        }
    } catch (e) {
        console.error('Fatal database tracking failure:', e)
    }

    // 4. FINAL STEP: Redirect user
    return redirect(link.original_url)
}
