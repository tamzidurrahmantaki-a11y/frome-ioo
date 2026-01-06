import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingSection() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            description: "Perfect for trying out FROME.IO",
            features: [
                "Up to 10 tracked links",
                "Basic analytics",
                "7-day data retention",
                "Community support",
            ],
            cta: "Get Started",
            highlighted: false,
        },
        {
            name: "Pro",
            price: "$19",
            period: "per month",
            description: "For professionals who need more",
            features: [
                "Unlimited tracked links",
                "Real-time analytics",
                "Unlimited data retention",
                "Advanced metadata insights",
                "Priority support",
                "Custom domains",
            ],
            cta: "Start Free Trial",
            highlighted: true,
            badge: "MOST POPULAR",
        },
        {
            name: "Agency",
            price: "$99",
            period: "per month",
            description: "For teams managing multiple clients",
            features: [
                "Everything in Pro",
                "Team collaboration",
                "White-label reports",
                "API access",
                "Dedicated account manager",
                "Custom integrations",
            ],
            cta: "Contact Sales",
            highlighted: false,
        },
    ]

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

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 ${plan.highlighted
                                    ? "bg-white/10 border-2 border-[#00C975] shadow-2xl shadow-[#00C975]/20 scale-105"
                                    : "bg-white/5 border border-white/10 hover:bg-white/[0.07]"
                                }`}
                        >
                            {/* Badge for highlighted plan */}
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00C975] text-black text-xs font-bold rounded-full tracking-wider">
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan name */}
                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                                {plan.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-400 text-sm">/ {plan.period}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIdx) => (
                                    <li key={featureIdx} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-[#00C975] shrink-0 mt-0.5" strokeWidth={3} />
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Link href="/login" className="block">
                                <Button
                                    className={`w-full h-12 font-semibold rounded-xl transition-all ${plan.highlighted
                                            ? "bg-[#00C975] hover:bg-[#00C975]/90 text-black shadow-lg shadow-[#00C975]/30"
                                            : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
