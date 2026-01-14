import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // -------------------------------------------------------------------------
    // 0. PREPARE HEADERS (Critical for Layout Detection)
    // -------------------------------------------------------------------------
    // We must pass the URL to the server components via headers
    // so app/admin/layout.tsx knows when to skip sidebar/auth checks
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-url', path)

    // -------------------------------------------------------------------------
    // 1. ASSET & PUBLIC BYPASS
    // -------------------------------------------------------------------------
    const publicPaths = ['/', '/login', '/admin/login', '/auth/callback', '/update-password', '/forgot-password']
    const isPublicPath = publicPaths.includes(path) || path.includes('.')

    if (isPublicPath) {
        return NextResponse.next({
            request: { headers: requestHeaders }
        })
    }

    // -------------------------------------------------------------------------
    // 2. PROTECTED ROUTE DETECTION
    // -------------------------------------------------------------------------
    const protectedPaths = ['/dashboard', '/analytics', '/profile', '/plans', '/support']
    const isUserProtected = protectedPaths.some(p => path.startsWith(p))
    const isAdminPath = path.startsWith('/admin')

    // If it's not a protected path (e.g. it's a short link), allow access immediately
    if (!isUserProtected && !isAdminPath) {
        return NextResponse.next({
            request: { headers: requestHeaders }
        })
    }

    // -------------------------------------------------------------------------
    // 3. AUTHENTICATION (Only for protected routes)
    // -------------------------------------------------------------------------
    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    request.cookies.set(name, value)
                    response.cookies.set(name, value, options)
                })
            },
        },
    })

    const { data: { user } } = await supabase.auth.getUser()

    // A. User Protection
    if (isUserProtected && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('next', path)
        return NextResponse.redirect(url)
    }

    // B. Admin Protection
    if (isAdminPath) {
        const adminSession = request.cookies.get('admin_session')
        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|css|js|woff2?|map)).*)',
    ],
}
