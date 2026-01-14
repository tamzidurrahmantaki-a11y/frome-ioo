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
            <div className="bg-card border border-border/50 rounded-2xl p-8 flex flex-col md:flex-row gap-6 shadow-xl shadow-black/20">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search email or transaction hash..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 bg-background border-border/50 h-12 rounded-xl focus-visible:ring-primary/20"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-6 py-2 bg-background border border-border/50 rounded-xl text-sm font-bold uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/30"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background/80 backdrop-blur-md border-b border-border/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">User</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Items</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No payments found
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-sm text-foreground tracking-tight">{payment.user_email}</p>
                                            <p className="text-[11px] font-medium text-muted-foreground/50">{new Date(payment.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded tracking-widest">
                                                    {payment.plan_type}
                                                </span>
                                                <span className="text-sm font-bold text-foreground">
                                                    ${payment.amount || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 max-w-[150px]">
                                                <code className="text-[11px] font-medium bg-muted/50 text-muted-foreground px-2 py-1 rounded truncate block w-full border border-border/30" title={payment.transaction_hash}>
                                                    {payment.transaction_hash}
                                                </code>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-8 py-6">
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified
            </span>
        )
    }
    if (status === 'failed') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                <XCircle className="w-3.5 h-3.5" />
                Failed
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
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
