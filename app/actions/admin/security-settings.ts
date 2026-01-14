'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function updateAdminCredentials(email: string, password?: string) {
    try {
        // Validate session
        const admin = await requireAdmin()
        const supabase = createAdminClient()

        const updates: any = { email }
        if (password && password.trim().length > 0) {
            updates.password = password // Storing plain text as requested by user previously
            // If hash was required: updates.password_hash = hash(password)
        }

        // Update the credentials record
        // Assuming there's only one admin or we update the one matching the session ID?
        // Admin credentials table usually has ID.
        // We'll update the record that matches the current admin's ID (from requireAdmin)

        const { error } = await supabase
            .from('admin_credentials')
            .update(updates)
            .eq('id', admin.id)

        if (error) throw error

        // Also update site_settings display email if it exists
        await supabase
            .from('site_settings')
            .update({ value: email })
            .eq('key', 'admin_email_display')

        revalidatePath('/admin/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating admin credentials:', error)
        return { success: false, error: 'Failed to update credentials' }
    }
}
