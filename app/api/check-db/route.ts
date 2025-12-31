import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    return Response.json({ exists: !error, error })
}
