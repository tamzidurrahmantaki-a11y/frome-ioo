import { createClient } from '@/lib/supabase/server'

export async function getDashboardData(startDate?: Date, endDate?: Date) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Determine range
    const end = endDate || new Date()
    const start = startDate || new Date(new Date().setDate(end.getDate() - 6))

    // Set boundaries to cover full days in UTC/Local as per storage
    const startBound = new Date(start)
    startBound.setHours(0, 0, 0, 0)

    const endBound = new Date(end)
    endBound.setHours(23, 59, 59, 999)

    // 0. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const displayName = profile?.full_name || user.user_metadata?.first_name || user.email?.split('@')[0] || 'User'

    // 1. Fetch Links
    const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (!links || links.length === 0) {
        return {
            user: { ...user, displayName, profile },
            links: [],
            chartData: [],
            stats: { total: 0, lastHour: 0 },
            demographics: { country: [], device: [], os: [], browser: [] }
        }
    }

    const linkIds = links.map(l => l.id)

    // 2. Fetch Clicks for these links within range
    const { data: clicks } = await supabase
        .from('clicks')
        .select('*')
        .in('link_id', linkIds)
        .gte('created_at', startBound.toISOString())
        .lte('created_at', endBound.toISOString())

    const clickData = clicks || []

    // 3. Process Chart Data
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const chartData = []

    let current = new Date(startBound)
    while (current <= endBound) {
        const d = new Date(current)
        const dayLabel = days[d.getDay()]

        const count = clickData.filter(c => {
            const clickDate = new Date(c.created_at)
            return clickDate.getDate() === d.getDate() &&
                clickDate.getMonth() === d.getMonth() &&
                clickDate.getFullYear() === d.getFullYear()
        }).length

        chartData.push({
            day: dayLabel,
            fullDate: d.toLocaleDateString(),
            clicks: count
        })

        current.setDate(current.getDate() + 1)
    }

    // Demographics Helper
    const getTop = (field: string) => {
        const map = new Map<string, number>()
        clickData.forEach((c: any) => {
            // Check multiple possible field names (e.g. device vs device_type)
            const val = c[field] || (field === 'device_type' ? c.device : null) || 'Unknown'
            map.set(val, (map.get(val) || 0) + 1)
        })
        const total = clickData.length || 1
        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({
                name,
                count,
                pct: Math.round((count / total) * 100) + '%'
            }))
    }

    // Stats calculation
    const totalClicks = clickData.length
    const uniqueIPs = new Set(clickData.map(c => c.ip_address || c.id)).size // Fallback if ip_address is missing
    const daysInRange = Math.max(1, Math.ceil((endBound.getTime() - startBound.getTime()) / (1000 * 60 * 60 * 24)))
    const avgDaily = Math.round((totalClicks / daysInRange) * 10) / 10

    const referrersMap = new Map<string, number>()
    clickData.forEach(c => {
        let ref = (c as any).referrer || 'Direct'
        if (ref.includes('facebook.com')) ref = 'Facebook'
        else if (ref.includes('t.co') || ref.includes('twitter.com')) ref = 'Twitter'
        else if (ref.includes('instagram.com')) ref = 'Instagram'
        else if (ref.includes('linkedin.com')) ref = 'LinkedIn'
        else if (ref.includes('google.com')) ref = 'Google'
        referrersMap.set(ref, (referrersMap.get(ref) || 0) + 1)
    })
    const topReferrer = Array.from(referrersMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Direct'

    const linksWithClicks = links.map(l => {
        return {
            ...l,
            clicks: (l as any).total_clicks || (clickData.filter(c => c.link_id === l.id).length) || 0,
            last_clicked_at: (l as any).last_clicked_at || null
        }
    }).sort((a, b) => (b as any).clicks - (a as any).clicks)

    const topPerformingLink = linksWithClicks[0]?.title || linksWithClicks[0]?.short_slug || 'None'

    return {
        user: { ...user, displayName, profile },
        links: linksWithClicks,
        chartData,
        stats: {
            total: totalClicks,
            uniqueVisitors: uniqueIPs,
            avgDailyClicks: avgDaily,
            topReferrer: topReferrer,
            topPerformingLink: topPerformingLink,
            lastHour: clickData.filter(c => {
                const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
                return new Date(c.created_at) > hourAgo
            }).length
        },
        demographics: {
            country: getTop('country'),
            city: getTop('city'),
            device: getTop('device_type'),
            os: getTop('os'),
            browser: getTop('browser'),
            referrers: getTop('referrer')
        }
    }
}
