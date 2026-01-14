'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function getContacts() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('support_contacts')
            .select('*')
            .order('contact_type', { ascending: true })

        if (error) throw error

        return { success: true, data }
    } catch (error) {
        console.error('Error fetching contacts:', error)
        return { success: false, error: 'Failed to fetch contacts' }
    }
}

export async function updateContact(contactType: string, contactValue: string, label?: string) {
    try {
        await requireAdmin()

        const supabase = await createClient()

        const updateData: any = { contact_value: contactValue }
        if (label) updateData.label = label

        const { data, error } = await supabase
            .from('support_contacts')
            .update(updateData)
            .eq('contact_type', contactType)
            .select()
            .single()

        if (error) throw error

        revalidatePath('/support')
        revalidatePath('/admin/content')

        return { success: true, data }
    } catch (error) {
        console.error('Error updating contact:', error)
        return { success: false, error: 'Failed to update contact' }
    }
}
