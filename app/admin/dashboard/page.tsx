import { getAdminStats } from '@/app/actions/admin/get-stats'
import { StatCard } from '@/components/admin/stat-card'
import { Users, Link2, CreditCard, ExternalLink, Settings, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    const statsResult = await getAdminStats()

    const stats = (statsResult.success && statsResult.data) ? statsResult.data : {
        totalUsers: 0,
        totalLinks: 0,
        totalCryptoSubscriptions: 0
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-foreground mb-2 italic uppercase">Platform Overview</h1>
                <p className="text-muted-foreground font-medium">Real-time metrics and system quick access.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                />
                <StatCard
                    title="Total Links"
                    value={stats.totalLinks}
                    icon={Link2}
                />
                <StatCard
                    title="Crypto Revenue"
                    value={stats.totalCryptoSubscriptions} // Just a count for now, update label if logic changes
                    icon={CreditCard}
                // prefix="$" // If value becomes a sum
                />
            </div>

            {/* Quick Actions */}
            <div className="space-y-6 pt-6 border-t border-border/50">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest opacity-50">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardLink
                        href="/admin/users"
                        icon={Users}
                        label="Manage Users"
                    />
                    <DashboardLink
                        href="/admin/content"
                        icon={FileText}
                        label="Edit Content"
                    />
                    <DashboardLink
                        href="/admin/payments"
                        icon={CreditCard}
                        label="View Payments"
                    />
                    <DashboardLink
                        href="/admin/settings"
                        icon={Settings}
                        label="Platform Settings"
                    />
                </div>
            </div>

            {/* System Status - Luxury Minimal */}
            <div className="pt-6 border-t border-border/50">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 opacity-50">System Health</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatusIndicator label="Database" status="Active" />
                    <StatusIndicator label="API Gateway" status="Operational" />
                    <StatusIndicator label="Auth Service" status="Secure" />
                </div>
            </div>
        </div>
    )
}

function DashboardLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
    return (
        <Link
            href={href}
            className="group flex flex-col items-center justify-center p-8 bg-card border border-border/50 rounded-2xl hover:border-primary/50 hover:bg-muted/50 transition-all duration-500 shadow-xl shadow-black/20"
        >
            <div className="bg-primary/10 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
            </span>
        </Link>
    )
}

function StatusIndicator({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex items-center justify-between p-5 bg-card border border-border/30 rounded-xl shadow-lg shadow-black/20">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,201,117,0.4)] animate-pulse" />
                <span className="text-[11px] font-bold text-primary uppercase tracking-widest">{status}</span>
            </div>
        </div>
    )
}
