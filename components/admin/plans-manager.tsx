'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, Check, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { createPlan, updatePlan, deletePlan } from '@/app/actions/admin/manage-plans'

type Plan = {
    id: string
    name: string
    price_monthly: number
    price_yearly: number
    features: string[]
    payment_link?: string
    is_popular: boolean
}

export function PlansManager({ initialPlans }: { initialPlans: any[] }) {
    const [plans, setPlans] = useState<any[]>(initialPlans)
    const [loading, setLoading] = useState<string | null>(null) // ID of plan loading

    const handleSave = async (plan: any) => {
        setLoading(plan.id || 'new')
        const isNew = !plan.id

        const payload = {
            name: plan.name,
            price_monthly: Number(plan.price_monthly),
            price_yearly: Number(plan.price_yearly),
            features: typeof plan.features === 'string' ? plan.features.split(',').map((f: string) => f.trim()).filter(Boolean) : plan.features,
            payment_link: plan.payment_link,
            is_popular: plan.is_popular
        }

        const res = isNew
            ? await createPlan(payload)
            : await updatePlan(plan.id, payload)

        if (!res.success) {
            toast.error(res.error)
        } else {
            toast.success(isNew ? 'Plan created' : 'Plan saved')
            window.location.reload()
        }
        setLoading(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return
        setLoading(id)
        const res = await deletePlan(id)
        if (!res.success) {
            toast.error(res.error)
        } else {
            toast.success('Plan deleted')
            window.location.reload()
        }
        setLoading(null)
    }

    const handleFeatureChange = (planId: string, featuresStr: string) => {
        setPlans(plans.map(p => p.id === planId ? { ...p, features: featuresStr.split(',').map(f => f.trim()) /* Keep as array in state, logic handles display */ } : p))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tighter italic uppercase">Subscription Plans</h2>
                    <p className="text-muted-foreground font-medium">Manage your pricing tiers dynamically.</p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="border-border/50 hover:bg-muted font-bold text-[10px] uppercase tracking-widest">
                    <RefreshCw className="w-3.5 h-3.5 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.id} className={`relative p-8 rounded-2xl border flex flex-col transition-all duration-300 shadow-xl ${plan.is_popular ? 'border-primary bg-card shadow-primary/5' : 'border-border/50 bg-muted/30 hover:bg-muted/50'}`}>
                        {/* Popular Badge Toggle */}
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => {
                                    const updated = { ...plan, is_popular: !plan.is_popular }
                                    handleSave(updated)
                                }}
                                className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.1em] transition-all ${plan.is_popular ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-background text-muted-foreground hover:bg-muted border border-border/50'}`}
                            >
                                {plan.is_popular ? 'POPULAR' : 'STANDARD'}
                            </button>
                        </div>

                        {/* Plan Name */}
                        <div className="mb-4">
                            <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-2 block">Level</label>
                            <Input
                                value={plan.name}
                                onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, name: e.target.value } : p))}
                                className="font-black text-2xl border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/20 italic tracking-tighter"
                                placeholder="Plan Name"
                            />
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-2 block">Monthly Rate</label>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-foreground opacity-30">$</span>
                                <Input
                                    type="number"
                                    value={plan.price_monthly}
                                    onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, price_monthly: e.target.value } : p))}
                                    className="font-black text-5xl border-none bg-transparent p-0 h-auto w-24 focus-visible:ring-0 text-foreground tracking-tighter"
                                />
                                <span className="text-muted-foreground font-bold text-sm tracking-widest opacity-40 uppercase">/mo</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mb-8 flex-1">
                            <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-3 block">Features List</label>
                            <Textarea
                                value={Array.isArray(plan.features) ? plan.features.join(', ') : plan.features}
                                onChange={(e) => {
                                    // Just update local state as string for editing comfort, parsing happens on save
                                    const val = e.target.value;
                                    setPlans(plans.map(p => p.id === plan.id ? { ...p, features: val.split(',') } : p))
                                }}
                                className="min-h-[120px] bg-background/50 border-border/50 text-sm focus-visible:ring-primary/20 resize-none mb-6 rounded-xl font-medium"
                                placeholder="Feature 1, Feature 2, Feature 3..."
                            />

                            <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-3 block">Gateway Link</label>
                            <Input
                                value={plan.payment_link || ''}
                                onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, payment_link: e.target.value } : p))}
                                className="bg-background/50 border-border/50 focus-visible:ring-primary/20 rounded-xl h-11 text-[13px] font-medium"
                                placeholder="https://buy.stripe.com/..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-auto">
                            <Button
                                onClick={() => handleSave(plan)}
                                disabled={loading === plan.id}
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl shadow-lg shadow-primary/10"
                            >
                                {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Plan'}
                            </Button>
                            <Button
                                onClick={() => handleDelete(plan.id)}
                                disabled={loading === plan.id}
                                variant="destructive"
                                size="icon"
                                className="h-12 w-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Add New Plan Card */}
                <div className="p-8 rounded-2xl border border-dashed border-border/50 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-all duration-500 min-h-[400px] cursor-pointer group shadow-xl shadow-black/20"
                    onClick={() => {
                        handleSave({
                            name: 'New Tier',
                            price_monthly: 0,
                            price_yearly: 0,
                            features: ['Feature 1', 'Feature 2'],
                            payment_link: '',
                            is_popular: false
                        })
                    }}
                >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 border border-border/50">
                        <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-black text-lg text-foreground uppercase tracking-widest italic tracking-tighter">Add Tier</h3>
                    <p className="text-muted-foreground text-sm max-w-[200px] mx-auto mt-3 font-medium opacity-50">Create a new premium pricing model.</p>
                </div>
            </div>
        </div>
    )
}
