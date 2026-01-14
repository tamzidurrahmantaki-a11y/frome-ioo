import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
    try {
        const text = await req.text()
        const signature = req.headers.get('x-sellix-unescaped-signature')

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 401 })
        }

        // Verify Signature
        const secret = process.env.SELLIX_WEBHOOK_SECRET
        if (!secret) {
            console.error('SELLIX_WEBHOOK_SECRET is not set')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const hmac = crypto.createHmac('sha512', secret)
        const digest = hmac.update(text).digest('hex')

        // Timing safe comparison to prevent timing attacks
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const payload = JSON.parse(text)
        const event = payload.event
        const data = payload.data

        if (event === 'order:paid') {
            const userEmail = data.email
            // Use product title or a custom field for plan mapping. 
            // Defaulting to "Pro" if not specified, or parsing from title if needed.
            // For now, we upgrade to 'Pro' for any paid order as per request.
            const planToAssign = 'Pro'

            const supabase = createAdminClient()

            // 1. Find User by Email
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', userEmail)
                .single()

            if (userError || !user) {
                console.warn(`Sellix Webhook: User not found for email ${userEmail}`)
                // We still record the payment, but verified_by logic might differ or be null
            } else {
                // 2. Upgrade User
                await supabase
                    .from('users')
                    .update({
                        subscription_plan: planToAssign,
                        // You might want to update a 'subscription_status' too if you have it
                    })
                    .eq('id', user.id)
            }

            // 3. Record verified payment in crypto_payments
            await supabase.from('crypto_payments').insert({
                user_id: user?.id || null,
                user_email: userEmail,
                transaction_hash: data.uniqid, // Sellix unique ID
                amount: data.total,
                currency: data.currency,
                status: 'verified',
                verified_at: new Date().toISOString(),
                // verified_by: 'sellix-bot' or null. Leaving null or you can add a system UUID.
            })

            console.log(`Successfully processed Sellix order ${data.uniqid} for ${userEmail}`)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Sellix Webhook Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
