"use client"

import * as React from "react"
import { BarChart3, Home, Link2, CreditCard, User, LogOut, LucideIcon, HelpCircle, Menu, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn, toSentenceCase } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ModalProvider, useModal } from "@/lib/context/modal-context"
import { UserProvider, useUser } from "@/lib/context/user-context"
import { CreateLinkModal } from "@/components/dashboard/create-link-button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProModal } from "@/components/pro-modal"
import { ModeToggle } from "@/components/mode-toggle"

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Links",
        url: "/links-trigger",
        icon: Link2,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Profile",
        url: "/profile",
        icon: User,
    },
    {
        title: "Plans",
        url: "/plans",
        icon: CreditCard,
    },
    {
        title: "Support",
        url: "/support",
        icon: HelpCircle,
    },
]

function DashboardSidebarInternal({ children, user: initialUser }: { children: React.ReactNode, user?: any }) {
    const pathname = usePathname()
    const [mounted, setMounted] = React.useState(false)
    const supabase = createClient()
    const router = useRouter()
    const { isCreateModalOpen, openCreateModal, isProModalOpen, closeProModal } = useModal()
    const { profile, isLoading: isUserLoading } = useUser()
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    if (!mounted) {
        return (
            <div className="flex min-h-screen w-full bg-background md:p-6 gap-8">
                <main className="flex-1 flex flex-col min-w-0 p-4 md:p-0">
                    <div className="flex-1">
                        {children}
                    </div>
                </main>
            </div>
        )
    }

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <aside className={cn(
            "bg-[#1A1A1A] border-r border-white/5 rounded-xl flex flex-col items-center py-10 shrink-0 shadow-2xl shadow-black/20",
            isMobile ? "w-24 h-full" : "w-20 h-[calc(100vh-3rem)] sticky top-6"
        )}>
            {/* Logo */}
            <div className="text-white font-semibold text-3xl mb-14 tracking-tighter select-none cursor-pointer" onClick={() => router.push('/dashboard')}>F.</div>

            {/* Nav items */}
            <nav className="flex-1 flex-col gap-8 items-center w-full flex">
                {items.map((item) => {
                    const isLinks = item.title === "Links"
                    const isHome = item.title === "Home"
                    const isAnalytics = item.title === "Analytics"

                    let isActive = pathname === item.url
                    if (isLinks) isActive = isCreateModalOpen
                    if (isHome) isActive = (pathname === "/dashboard" || pathname === "/dashboard/") && !isCreateModalOpen
                    if (isAnalytics) isActive = pathname.startsWith("/analytics")
                    if (item.title === "Plans") isActive = pathname.startsWith("/plans")
                    if (item.title === "Profile") isActive = pathname.startsWith("/profile")
                    if (item.title === "Support") isActive = pathname.startsWith("/support")

                    return (
                        <button
                            key={item.title}
                            onClick={() => {
                                if (isLinks) openCreateModal()
                                else router.push(item.url)
                                setIsMobileOpen(false)
                            }}
                            className={cn(
                                "p-3.5 rounded-xl transition-all duration-300 relative group flex items-center justify-center",
                                isActive ? "bg-[#00C975] text-black shadow-lg shadow-[#00C975]/40" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />

                            {/* Tooltip on hover - only on desktop */}
                            {!isMobile && (
                                <div className="absolute left-[75px] px-3 py-1.5 bg-black text-white text-[10px] font-semibold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-r-black">
                                    {item.title}
                                </div>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="p-4 text-gray-500 hover:text-red-500 transition-all duration-200 mt-auto hover:scale-110 active:scale-95 flex items-center justify-center"
            >
                <LogOut className="w-6 h-6 stroke-2" />
            </button>
        </aside>
    )

    return (
        <div className="flex min-h-screen w-full bg-background md:p-6 gap-0 lg:gap-8">
            {/* Desktop Sidebar (Sticky) */}
            <div className="hidden lg:block relative">
                <SidebarContent />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-0">
                {/* Header */}
                <header className="h-20 flex items-center justify-between mb-2 md:mb-8">
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <button className="lg:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-xl transition-colors">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-4 bg-transparent border-none w-fit shadow-none outline-none">
                                <SidebarContent isMobile />
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight leading-none truncate max-w-[150px] sm:max-w-none">
                            Hello, {toSentenceCase(profile?.full_name || initialUser?.email?.split('@')[0]) || 'User'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Sticky Plan Badge - Luxury Tag Style (Emerald Glow) */}
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse-subtle">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                {profile?.subscription_plan || 'Free'} Plan
                            </span>
                        </div>

                        <ModeToggle />

                        <Link
                            href="/profile"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Profile
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="w-10 h-10 md:w-12 md:h-12 cursor-pointer border border-border hover:border-foreground/20 transition-all shadow-sm">
                                    <AvatarImage src={initialUser?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-muted text-foreground font-semibold text-lg">
                                        {(profile?.full_name?.[0] || initialUser?.email?.[0] || 'U').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-2xl border-border bg-card">
                                <DropdownMenuLabel className="px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">My Account</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-xl h-12 px-4 font-medium text-sm cursor-pointer hover:bg-muted">Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/plans')} className="rounded-xl h-12 px-4 font-medium text-sm cursor-pointer hover:bg-muted flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    Plans
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2 bg-border" />
                                <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-12 px-4 font-medium text-sm text-red-500 cursor-pointer hover:bg-red-500/10">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <div className="flex-1 pr-4 -mr-4 custom-scrollbar">
                    {children}
                </div>
            </main>

            <CreateLinkModal />
            <ProModal isOpen={isProModalOpen} onClose={closeProModal} />
        </div>
    )
}

interface DashboardSidebarProps {
    children: React.ReactNode
    user?: any
    subscriptionStatus?: string
    linksCount?: number
}

export function DashboardSidebar({ children, user, subscriptionStatus, linksCount }: DashboardSidebarProps) {
    return (
        <UserProvider initialUser={user}>
            <ModalProvider subscriptionStatus={subscriptionStatus} linksCount={linksCount}>
                <SidebarProvider>
                    <DashboardSidebarInternal user={user}>
                        {children}
                    </DashboardSidebarInternal>
                </SidebarProvider>
            </ModalProvider>
        </UserProvider>
    )
}
