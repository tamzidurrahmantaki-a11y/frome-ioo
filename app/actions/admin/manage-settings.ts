'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('support_settings')
            .select('*')

        if (error) throw error

        return { success: true, data }
    } catch (error) {
        console.error('Error fetching settings:', error)
        return { success: false, error: 'Failed to fetch settings' }
    }
}

export async function updateSetting(settingKey: string, settingValue: string) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('support_settings')
            .update({ setting_value: settingValue })
            .eq('setting_key', settingKey)
            .select()
            .single()

        if (error) {
            // If setting doesn't exist, create it
            const { data: newData, error: insertError } = await supabase
                .from('support_settings')
                .insert([{ setting_key: settingKey, setting_value: settingValue }])
                .select()
                .single()

            if (insertError) throw insertError

            revalidatePath('/support')
            revalidatePath('/admin/content')

            return { success: true, data: newData }
        }

        revalidatePath('/support')
        revalidatePath('/admin/content')

        return { success: true, data }
    } catch (error) {
        console.error('Error updating setting:', error)
        return { success: false, error: 'Failed to update setting' }
    }
}
