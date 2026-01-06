"use client"

export function LogoCloud() {
    const logos = [
        { name: "Vercel", width: "w-24" },
        { name: "Next.js", width: "w-20" },
        { name: "Stripe", width: "w-20" },
        { name: "GitHub", width: "w-24" },
        { name: "Supabase", width: "w-28" },
        { name: "Tailwind", width: "w-28" },
    ]

    return (
        <section className="py-16 border-t border-white/5">
            <div className="container mx-auto px-4">
                <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest mb-12">
                    TRUSTED BY TEAMS AT
                </p>

                <div className="relative overflow-hidden">
                    {/* Gradient overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />

                    {/* Scrolling container */}
                    <div className="flex gap-16 animate-scroll">
                        {/* First set */}
                        {logos.map((logo, idx) => (
                            <div
                                key={`logo-1-${idx}`}
                                className={`${logo.width} h-12 flex items-center justify-center shrink-0`}
                            >
                                <div className="text-gray-600 hover:text-gray-400 transition-colors duration-300 font-bold text-xl tracking-tight">
                                    {logo.name}
                                </div>
                            </div>
                        ))}
                        {/* Duplicate set for seamless loop */}
                        {logos.map((logo, idx) => (
                            <div
                                key={`logo-2-${idx}`}
                                className={`${logo.width} h-12 flex items-center justify-center shrink-0`}
                            >
                                <div className="text-gray-600 hover:text-gray-400 transition-colors duration-300 font-bold text-xl tracking-tight">
                                    {logo.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    )
}
