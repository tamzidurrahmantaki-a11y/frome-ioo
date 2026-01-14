import { BarChart3, Globe, Sparkles, Shield, Zap, Target } from "lucide-react"

export function FeaturesSection() {
    const features = [
        {
            icon: BarChart3,
            color: "text-[#00C975]",
            glow: "bg-[#00C975]/20",
            title: "Precision Analytics",
            description: "Get hyper-accurate data on every click, referral, and conversion in real-time.",
        },
        {
            icon: Target,
            color: "text-blue-400",
            glow: "bg-blue-400/20",
            title: "Source Isolation",
            description: "Separate your banner traffic from your organic social clicks with granular tagging.",
        },
        {
            icon: Shield,
            color: "text-purple-400",
            glow: "bg-purple-400/20",
            title: "Privacy First",
            description: "We respect user privacy while providing the deep insights you need to grow.",
        },
        {
            icon: Zap,
            color: "text-yellow-400",
            glow: "bg-yellow-400/20",
            title: "Instant Setup",
            description: "Generate and deploy smart links in seconds without any complex configuration.",
        },
        {
            icon: Globe,
            color: "text-emerald-400",
            glow: "bg-emerald-400/20",
            title: "Global Reach",
            description: "Track performance across continents with detailed geographic and device maps.",
        },
        {
            icon: Sparkles,
            color: "text-pink-400",
            glow: "bg-pink-400/20",
            title: "Premium Experience",
            description: "A luxury interface designed for precision, speed, and absolute clarity.",
        },
    ]

    return (
        <section id="features" className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="luxury-text text-[#00C975] mb-4">Core Capabilities</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">
                        EVERYTHING YOU NEED TO
                        <span className="text-[#00C975]"> SCALE SMARTER</span>
                    </h3>
                    <p className="text-zinc-500 text-sm md:text-base font-medium">
                        POWERFUL FEATURES BUILT FOR MODERN MARKETING TEAMS WHO DEMAND ABSOLUTE PRECISION.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-[2rem] glass hover:bg-zinc-900/40 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.glow} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
