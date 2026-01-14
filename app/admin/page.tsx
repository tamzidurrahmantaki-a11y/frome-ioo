import { getAdminStats } from '@/app/actions/admin/get-stats'
import { StatCard } from '@/components/admin/stat-card'
import { Users, Link2, CreditCard } from 'lucide-react'

export default async function AdminDashboard() {
    const statsResult = await getAdminStats()

    const stats = statsResult.success ? statsResult.data : {
        totalUsers: 0,
        totalLinks: 0,
        totalCryptoSubscriptions: 0
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">Dashboard Overview</h1>
                <p className="text-gray-500">Monitor your platform's key metrics in real-time</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                />
                <StatCard
                    title="Total Links Created"
                    value={stats.totalLinks}
                    icon={Link2}
                />
                <StatCard
                    title="Crypto Subscriptions"
                    value={stats.totalCryptoSubscriptions}
                    icon={CreditCard}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-8">
                <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a
                        href="/admin/users"
                        className="p-4 bg-white border border-gray-100 rounded-lg hover:border-[#00C975] hover:shadow-md transition-all duration-200 text-center"
                    >
                        <Users className="w-6 h-6 mx-auto mb-2 text-[#00C975]" />
                        <p className="font-semibold text-sm text-black">Manage Users</p>
                    </a>
                    <a
                        href="/admin/content"
                        className="p-4 bg-white border border-gray-100 rounded-lg hover:border-[#00C975] hover:shadow-md transition-all duration-200 text-center"
                    >
                        <svg className="w-6 h-6 mx-auto mb-2 text-[#00C975]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <p className="font-semibold text-sm text-black">Edit Content</p>
                    </a>
                    <a
                        href="/admin/payments"
                        className="p-4 bg-white border border-gray-100 rounded-lg hover:border-[#00C975] hover:shadow-md transition-all duration-200 text-center"
                    >
                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-[#00C975]" />
                        <p className="font-semibold text-sm text-black">View Payments</p>
                    </a>
                    <a
                        href="/admin/settings"
                        className="p-4 bg-white border border-gray-100 rounded-lg hover:border-[#00C975] hover:shadow-md transition-all duration-200 text-center"
                    >
                        <svg className="w-6 h-6 mx-auto mb-2 text-[#00C975]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="font-semibold text-sm text-black">Settings</p>
                    </a>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-8">
                <h2 className="text-xl font-bold text-black mb-4">System Status</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Database Connection</span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium text-gray-700">API Services</span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">Operational</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Authentication</span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">Secure</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
