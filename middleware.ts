import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Setup Response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Exit if missing env (avoids crashes)
    if (!supabaseUrl || !supabaseKey) return response

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
                },
            },
        }
    )

    const path = request.nextUrl.pathname

    // --- DEBUGGING LOGS (Check your terminal) ---
    // Exclude static assets from logs to keep terminal clean
    const isStatic = path.startsWith('/_next') || path.startsWith('/static') || path.includes('.')
    if (!isStatic) {
        console.log(`[Middleware] Processing: ${path}`)
    }

    // 2. EXPLICITLY ALLOW ADMIN LOGIN PAGE
    // This MUST be the first check to prevent any loops.
    if (path === '/admin/login') {
        const { data: { user } } = await supabase.auth.getUser()

        // If they are already an admin, be nice and send them to the dashboard
        if (user) {
            const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
            if (profile?.role === 'admin') {
                console.log(`[Middleware] Admin at login page -> Redirecting to Dashboard`)
                return NextResponse.redirect(new URL('/admin', request.url))
            }
        }

        // Otherwise, JUST LET THE PAGE LOAD
        console.log(`[Middleware] Allowing /admin/login`)
        return response
    }

    // 3. PROTECT ADMIN SUB-ROUTES
    // Matches /admin, /admin/users, /admin/settings... but NOT /admin/login (caught above)
    if (path.startsWith('/admin')) {
        const { data: { user } } = await supabase.auth.getUser()

        // Not logged in -> Go to login
        if (!user) {
            console.log(`[Middleware] Protected Admin Route -> Redirecting to Login`)
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Check Role
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        // Not Admin -> Go Home
        if (!profile || profile.role !== 'admin') {
            console.log(`[Middleware] Non-Admin User (${user.email}) -> Access Denied`)
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Is Admin -> Allow
        console.log(`[Middleware] Admin Access Granted to ${path}`)
        return response
    }

    // 5. USER DASHBOARD PROTECTION
    const protectedPaths = ['/dashboard', '/analytics', '/profile', '/plans', '/support']
    if (protectedPaths.some(p => path.startsWith(p))) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
