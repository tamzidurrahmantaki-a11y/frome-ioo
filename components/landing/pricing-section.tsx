"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Plan {
    id: string
    name: string
    price_monthly: number
    features: string[]
    payment_link?: string
    is_popular: boolean
}

export function PricingSection() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchPlans = async () => {
            const { data } = await supabase
                .from('plans')
                .select('*')
                .order('price_monthly', { ascending: true })

            if (data?.length) {
                setPlans(data as any[])
            } else {
                // Fallback only if no DB data
                setPlans([
                    {
                        id: 'free', name: 'Free', price_monthly: 0, features: ['Up to 10 tracked links', 'Basic analytics'], is_popular: false
                    },
                    {
                        id: 'pro', name: 'Pro', price_monthly: 19, features: ['Unlimited links', 'Real-time analytics', 'Custom domains'], is_popular: true
                    }
                ])
            }
            setLoading(false)
        }
        fetchPlans()
    }, [supabase])

    return (
        <section id="pricing" className="py-24 scroll-mt-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        SIMPLE, TRANSPARENT
                        <span className="text-[#00C975]"> PRICING</span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        CHOOSE THE PLAN THAT FITS YOUR NEEDS. UPGRADE OR DOWNGRADE ANYTIME.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#00C975]" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, idx) => {
                            const isPro = plan.price_monthly > 0

                            return (
                                <div
                                    key={idx}
                                    className={`relative p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 ${plan.is_popular
                                        ? "bg-white/10 border-2 border-[#00C975] shadow-2xl shadow-[#00C975]/20 scale-105 z-10"
                                        : "bg-white/5 border border-white/10 hover:bg-white/[0.07]"
                                        }`}
                                >
                                    {plan.is_popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00C975] text-black text-xs font-bold rounded-full tracking-wider">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6">
                                        {isPro ? "For professionals" : "Get started for free"}
                                    </p>

                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-white">${plan.price_monthly}</span>
                                            <span className="text-gray-400 text-sm">/ month</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {Array.isArray(plan.features) && plan.features.map((feature: string, featureIdx: number) => (
                                            <li key={featureIdx} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-[#00C975] shrink-0 mt-0.5" strokeWidth={3} />
                                                <span className="text-gray-300 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href={isPro ? (plan.payment_link || "/login") : "/login"} className="block">
                                        <Button
                                            className={`w-full h-12 font-semibold rounded-xl transition-all ${plan.is_popular
                                                ? "bg-[#00C975] hover:bg-[#00C975]/90 text-black shadow-lg shadow-[#00C975]/30"
                                                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                                }`}
                                        >
                                            {isPro ? "Subscribe Now" : "Get Started"}
                                        </Button>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
