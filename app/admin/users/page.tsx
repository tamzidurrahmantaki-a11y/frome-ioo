"use client"

import { useEffect, useState } from 'react'
import { getUsers } from '@/app/actions/admin/get-users'
import { Input } from '@/components/ui/input'
import { Search, Mail, Calendar, Link2 } from 'lucide-react'

interface User {
    id: string
    email: string
    full_name: string | null
    subscription_plan: string
    created_at: string
    linkCount: number
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [planFilter, setPlanFilter] = useState<string>('')

    useEffect(() => {
        loadUsers()
    }, [search, planFilter])

    const loadUsers = async () => {
        setLoading(true)
        const result = await getUsers({ search, plan: planFilter || undefined })
        if (result.success && result.data) {
            setUsers(result.data as User[])
        }
        setLoading(false)
    }

    const filteredUsers = users

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">User Management</h1>
                <p className="text-gray-500">View and manage all platform users</p>
            </div>

            {/* Filters */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by email or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-white border-gray-200"
                        />
                    </div>
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C975]"
                    >
                        <option value="">All Plans</option>
                        <option value="free">Free</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Links</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#00C975]/10 flex items-center justify-center">
                                                    <span className="text-[#00C975] font-semibold text-sm">
                                                        {(user.full_name?.[0] || user.email[0]).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-black">
                                                        {user.full_name || 'No Name'}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.subscription_plan === 'Pro'
                                                    ? 'bg-[#00C975]/10 text-[#00C975]'
                                                    : user.subscription_plan === 'Enterprise'
                                                        ? 'bg-purple-50 text-purple-600'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.subscription_plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <Link2 className="w-4 h-4 text-gray-400" />
                                                {user.linkCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-black">{users.length}</p>
                </div>
                <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Pro Users</p>
                    <p className="text-2xl font-bold text-black">
                        {users.filter(u => u.subscription_plan === 'Pro').length}
                    </p>
                </div>
                <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Free Users</p>
                    <p className="text-2xl font-bold text-black">
                        {users.filter(u => u.subscription_plan === 'free').length}
                    </p>
                </div>
            </div>
        </div>
    )
}
