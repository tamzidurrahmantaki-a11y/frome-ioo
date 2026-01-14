import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { headers } from 'next/headers'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Check if we are on the login page
    const headersList = await headers()
    const pathname = headersList.get('x-url') || ''

    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    const cookieStore = await headers()
    const adminSessionCookie = cookieStore.get('cookie') // headers() returns a Headers object? No, headers() is standard headers. Helper needed?
    // Actually simpler to use cookies()
    const { cookies } = await import('next/headers')
    const cookieJar = await cookies()
    const sessionCookie = cookieJar.get('admin_session')

    if (!sessionCookie) {
        // Middleware should have caught this, but just in case
        redirect('/admin/login')
    }

    let user = { email: 'Admin' }
    try {
        user = JSON.parse(sessionCookie.value)
    } catch (e) {
        // invalid cookie
    }

    return (
        <AdminSidebar user={user}>
            {children}
        </AdminSidebar>
    )
}
