"use client"

import * as React from "react"
import { LayoutDashboard, Users, FileText, CreditCard, Settings, LogOut, ArrowLeft, Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

const adminItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Content",
        url: "/admin/content",
        icon: FileText,
    },
    {
        title: "Payments",
        url: "/admin/payments",
        icon: CreditCard,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

interface AdminSidebarProps {
    children: React.ReactNode
    user?: any
}

function AdminSidebarInternal({ children, user }: AdminSidebarProps) {
    const pathname = usePathname()
    const [mounted, setMounted] = React.useState(false)
    const router = useRouter()
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = async () => {
        const { adminLogout } = await import('@/app/admin/login/actions')
        await adminLogout()
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

    const SidebarContent = () => (
        <aside className="w-20 bg-[#1A1A1A] border-r border-white/5 rounded-xl flex flex-col items-center py-10 shrink-0 shadow-2xl shadow-black/20 h-[calc(100vh-3rem)] sticky top-6">
            {/* Logo */}
            <div className="text-white font-semibold text-3xl mb-14 tracking-tighter select-none cursor-pointer" onClick={() => router.push('/admin')}>A.</div>

            {/* Nav items */}
            <nav className="flex-1 flex flex-col gap-8 items-center w-full">
                {adminItems.map((item) => {
                    const isActive = pathname === item.url || (item.url !== "/admin" && pathname.startsWith(item.url))

                    return (
                        <button
                            key={item.title}
                            onClick={() => {
                                router.push(item.url)
                                setIsMobileOpen(false)
                            }}
                            className={cn(
                                "p-3.5 rounded-xl transition-all duration-300 relative group flex items-center justify-center",
                                isActive ? "bg-[#00C975] text-black shadow-lg shadow-[#00C975]/40" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />

                            {/* Tooltip on hover */}
                            <div className="absolute left-[75px] px-3 py-1.5 bg-black text-white text-[10px] font-semibold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-r-black">
                                {item.title}
                            </div>
                        </button>
                    )
                })}

                {/* Back to User Dashboard */}
                <div className="w-full border-t border-gray-800 my-4"></div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="p-3.5 rounded-xl transition-all duration-300 relative group flex items-center justify-center text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5 stroke-2" />

                    {/* Tooltip on hover */}
                    <div className="absolute left-[75px] px-3 py-1.5 bg-black text-white text-[10px] font-semibold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none after:content-[''] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-r-black">
                        User Dashboard
                    </div>
                </button>
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
        <div className="flex min-h-screen w-full bg-background md:p-6 gap-8">
            {/* Desktop Sidebar (Sticky) */}
            <div className="hidden lg:block relative">
                <SidebarContent />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 p-4 md:p-0">
                {/* Header */}
                <header className="h-20 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <button className="lg:hidden p-2 text-foreground hover:bg-muted rounded-xl transition-colors">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-6 bg-transparent border-none w-fit shadow-none">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                        <div>
                            <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight leading-none">
                                Admin Portal
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">Manage your platform</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <ModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="w-10 h-10 md:w-12 md:h-12 cursor-pointer border border-border hover:border-foreground/20 transition-all shadow-sm">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-muted text-foreground font-semibold text-lg">
                                        {(user?.email?.[0] || 'A').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-2xl border-border bg-card">
                                <DropdownMenuLabel className="px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Admin Account</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push('/dashboard')} className="rounded-xl h-12 px-4 font-medium text-sm cursor-pointer hover:bg-muted">
                                    User Dashboard
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
        </div>
    )
}

export function AdminSidebar(props: AdminSidebarProps) {
    return <AdminSidebarInternal {...props} />
}
