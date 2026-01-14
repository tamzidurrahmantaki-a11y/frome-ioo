'use server'

import { createClient } from '@/lib/supabase/server' // This will be anon client, but that's fine for public table read, need verify for write
import { createAdminClient } from '@/lib/supabase/admin' // Use admin client for writes to bypass RLS if strict
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePath } from 'next/cache'

export async function getPlans() {
    try {
        // Public read is fine
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .order('price_monthly', { ascending: true })

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        console.error('Fetch Plans Error:', error)
        return { success: false, error: 'Failed to fetch plans' }
    }
}

export async function createPlan(plan: any) {
    try {
        await requireAdmin()

        // Use Admin Client to ensure we can write regardless of RLS (since we are custom admin)
        const supabase = createAdminClient()

        const { error } = await supabase.from('plans').insert([plan])

        if (error) throw error
        revalidatePath('/admin/plans')
        revalidatePath('/') // Landing page
        return { success: true }
    } catch (error: any) {
        console.error('Create Plan Error:', error)
        return { success: false, error: error.message }
    }
}

export async function updatePlan(id: string, plan: any) {
    try {
        await requireAdmin()

        const supabase = createAdminClient()
        const { error } = await supabase.from('plans').update(plan).eq('id', id)

        if (error) throw error
        revalidatePath('/admin/plans')
        revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        console.error('Update Plan Error:', error)
        return { success: false, error: error.message }
    }
}

export async function deletePlan(id: string) {
    try {
        await requireAdmin()

        const supabase = createAdminClient()
        const { error } = await supabase.from('plans').delete().eq('id', id)

        if (error) throw error
        revalidatePath('/admin/plans')
        revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        console.error('Delete Plan Error:', error)
        return { success: false, error: error.message }
    }
}
