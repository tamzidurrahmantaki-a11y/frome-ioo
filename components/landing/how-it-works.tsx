import { MousePointer2, BarChart4, Filter } from "lucide-react"

export function HowItWorks() {
    const steps = [
        {
            icon: MousePointer2,
            title: "Create Smarter Links",
            description: "Paste your destination URL and we'll generate a unique, tracked smart link instantly.",
            step: "01"
        },
        {
            icon: Filter,
            title: "Distribute Everywhere",
            description: "Use different tags for your banners, bio, threads, or ads to keep traffic sources isolated.",
            step: "02"
        },
        {
            icon: BarChart4,
            title: "Watch the Data Flow",
            description: "Access your dashboard to see exactly which placements are converting better than others.",
            step: "03"
        }
    ]

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="luxury-text text-[#00C975] mb-4">The Process</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6">
                        HOW IT <span className="text-[#00C975]">WORKS</span>
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto">
                        Data-driven decisions shouldn't be hard. We've simplified the entire tracking workflow into three elegant steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="group relative">
                            <div className="glass p-10 rounded-[2rem] hover:bg-zinc-900 transition-all duration-500">
                                <div className="absolute top-10 right-10 text-4xl font-black text-white/5 group-hover:text-[#00C975]/10 transition-colors">
                                    {step.step}
                                </div>

                                <div className="w-16 h-16 rounded-2xl bg-[#00C975]/5 flex items-center justify-center mb-8 border border-[#00C975]/10 group-hover:bg-[#00C975] transition-all duration-500 overflow-hidden">
                                    <step.icon className="w-8 h-8 text-[#00C975] group-hover:text-black transition-colors" />
                                </div>

                                <h4 className="text-xl font-bold text-white mb-4 tracking-tight">
                                    {step.title}
                                </h4>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
