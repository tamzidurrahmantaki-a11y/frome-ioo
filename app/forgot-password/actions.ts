'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Security: Prevent admin from using public reset flow
    if (email.toLowerCase() === 'strtakey123@gmail.com') {
        redirect(`/forgot-password?error=${encodeURIComponent('Admin password reset is disabled. Please use the secure admin portal.')}`)
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/update-password`,
    })

    if (error) {
        redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/forgot-password?message=Check your email for the password reset link.')
}
