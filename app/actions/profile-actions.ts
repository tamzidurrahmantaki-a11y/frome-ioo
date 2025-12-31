'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: {
    fullName: string,
    email: string,
    password?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    // Update profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            full_name: formData.fullName,
            updated_at: new Date().toISOString()
        })

    if (profileError) throw profileError

    // Update Email if changed
    if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: formData.email })
        if (emailError) throw emailError
    }

    // Update Password if provided
    if (formData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password: formData.password })
        if (passwordError) throw passwordError
    }

    revalidatePath('/dashboard/profile')
    return { success: true }
}
