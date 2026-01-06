import { Navbar } from "@/components/landing/navbar"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrackInput } from "@/components/landing/track-input"
import { LogoCloud } from "@/components/landing/logo-cloud"
import { FeaturesSection } from "@/components/landing/features-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans selection:bg-[#00C975] selection:text-black">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20">

        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-20 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            TRACK EXACTLY WHERE <br />
            <span className="text-[#00C975] opacity-90">YOUR CLICKS COME FROM</span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            FROME.IO HELPS YOU PINPOINT EXACTLY WHICH LINK PLACEMENT LIKE A BANNER, SIGNATURE, THREAD, OR BIO
            IS DRIVING TRAFFIC TO YOUR SITE AND HOW MUCH EACH ONE CONTRIBUTES.
          </p>

          <TrackInput />
        </div>

        {/* Dashboard Preview */}
        <div className="relative z-10">
          {/* Glow effect behind chart */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00C975]/10 blur-[120px] rounded-full pointer-events-none" />

          <DashboardPreview />
        </div>

      </main>

      {/* Logo Cloud */}
      <LogoCloud />

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
