'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .order('key', { ascending: true })

        if (error) {
            // Fallback if table doesn't exist yet (during transition)
            return { success: true, data: [] }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error fetching settings:', error)
        return { success: false, error: 'Failed to fetch settings' }
    }
}

export async function updateSetting(key: string, value: string) {
    try {
        await requireAdmin()
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('site_settings')
            .update({ value, updated_at: new Date().toISOString() })
            .eq('key', key)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/', 'layout') // Revalidate everything for theme changes
        revalidatePath('/admin/settings')

        return { success: true, data }
    } catch (error) {
        console.error('Error updating setting:', error)
        return { success: false, error: 'Failed to update setting' }
    }
}
