import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
    // 1. Verify Request: Must be authenticated as an Admin via Supabase Session
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile || profile.is_admin !== true) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Parse Body
    const body = await req.json()
    const { targetUserId, newPassword } = body

    if (!targetUserId || !newPassword) {
        return NextResponse.json({ error: 'Missing userId or password' }, { status: 400 })
    }

    if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password too short' }, { status: 400 })
    }

    // 3. Perform Update via Service Role
    const adminClient = createAdminClient()

    const { data, error } = await adminClient.auth.admin.updateUserById(
        targetUserId,
        { password: newPassword }
    )

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data.user })
}
