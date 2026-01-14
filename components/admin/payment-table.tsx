"use client"

import { useState } from "react"
import { verifyPayment, updateUserSubscription } from "@/app/actions/admin/manage-payments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Payment {
    id: string
    user_email: string
    transaction_hash: string
    plan_type: string
    amount: number
    status: 'pending' | 'verified' | 'failed'
    created_at: string
    user_id: string
}

export function PaymentTable({ payments: initialPayments }: { payments: Payment[] }) {
    const [payments, setPayments] = useState(initialPayments)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [verifyingId, setVerifyingId] = useState<string | null>(null)
    const [selectedUserForUpgrade, setSelectedUserForUpgrade] = useState<{ id: string, email: string, currentPlan: string } | null>(null)

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.user_email.toLowerCase().includes(search.toLowerCase()) ||
            payment.transaction_hash.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleVerify = async (id: string, userId: string, planType: string) => {
        if (!confirm("Confirm this payment and upgrade user?")) return

        setVerifyingId(id)
        try {
            // Verify payment
            const res = await verifyPayment(id)
            if (!res.success) throw new Error("Payment verification failed")

            // Upgrade user
            const upgradeRes = await updateUserSubscription(userId, planType)
            if (!upgradeRes.success) throw new Error("User upgrade failed")

            toast.success("Payment verified & user upgraded")

            // Update local state
            setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'verified' } : p))
        } catch (error) {
            toast.error("Operation failed")
        } finally {
            setVerifyingId(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search email or transaction hash..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-white border-gray-200"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C975]"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No payments found
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-sm text-black">{payment.user_email}</p>
                                            <p className="text-xs text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded">
                                                    {payment.plan_type}
                                                </span>
                                                <span className="text-sm font-medium">
                                                    ${payment.amount || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-[150px]">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate block w-full" title={payment.transaction_hash}>
                                                    {payment.transaction_hash}
                                                </code>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleVerify(payment.id, payment.user_id, payment.plan_type)}
                                                    disabled={verifyingId === payment.id}
                                                    className="bg-black text-white hover:bg-[#00C975] hover:text-black transition-colors"
                                                >
                                                    {verifyingId === payment.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        "Verify & Upgrade"
                                                    )}
                                                </Button>
                                            )}
                                            {payment.status === 'verified' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setSelectedUserForUpgrade({
                                                        id: payment.user_id,
                                                        email: payment.user_email,
                                                        currentPlan: payment.plan_type
                                                    })}
                                                >
                                                    Modify Plan
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserPlanDialog
                user={selectedUserForUpgrade}
                onClose={() => setSelectedUserForUpgrade(null)}
            />
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'verified') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified
            </span>
        )
    }
    if (status === 'failed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                <XCircle className="w-3.5 h-3.5" />
                Failed
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
            <AlertCircle className="w-3.5 h-3.5" />
            Pending
        </span>
    )
}

function UserPlanDialog({ user, onClose }: { user: any, onClose: () => void }) {
    const [plan, setPlan] = useState(user?.currentPlan || "free")
    const [loading, setLoading] = useState(false)

    if (!user) return null

    const handleUpdate = async () => {
        setLoading(true)
        const res = await updateUserSubscription(user.id, plan)
        setLoading(false)

        if (res.success) {
            toast.success("User plan updated")
            onClose()
        } else {
            toast.error("Update failed")
        }
    }

    return (
        <Dialog open={!!user} onOpenChange={open => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modify User Plan</DialogTitle>
                    <DialogDescription>
                        Manually update subscription for {user.email}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Select value={plan} onValueChange={setPlan}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="free">Free Plan</SelectItem>
                            <SelectItem value="Pro">Pro Plan</SelectItem>
                            <SelectItem value="Enterprise">Enterprise Plan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={loading} className="bg-black text-white">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Update Plan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
