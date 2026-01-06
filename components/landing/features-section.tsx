import { BarChart3, Globe, Sparkles } from "lucide-react"

export function FeaturesSection() {
    const features = [
        {
            icon: BarChart3,
            title: "Real-time Analytics",
            description: "Track every click as it happens with live dashboards and instant insights into your link performance.",
        },
        {
            icon: Globe,
            title: "Metadata Insights",
            description: "Discover where your audience is coming from with detailed browser, OS, device, and location data.",
        },
        {
            icon: Sparkles,
            title: "Premium UX",
            description: "Experience a beautifully crafted interface designed for speed, clarity, and effortless navigation.",
        },
    ]

    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        EVERYTHING YOU NEED TO
                        <span className="text-[#00C975]"> TRACK SMARTER</span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        POWERFUL FEATURES BUILT FOR MODERN TEAMS WHO DEMAND PRECISION AND PERFORMANCE.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00C975]/30 transition-all duration-300 hover:bg-white/[0.04]"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-[#00C975]/10 flex items-center justify-center mb-6 group-hover:bg-[#00C975]/20 transition-colors">
                                <feature.icon className="w-7 h-7 text-[#00C975]" strokeWidth={2} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Subtle glow effect on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-[#00C975]/0 group-hover:bg-[#00C975]/5 transition-all duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
