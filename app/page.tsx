import { Navbar } from "@/components/landing/navbar"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { TrackInput } from "@/components/landing/track-input"
import { LogoCloud } from "@/components/landing/logo-cloud"
import { FeaturesSection } from "@/components/landing/features-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Footer } from "@/components/landing/footer"
import { FloatingParticles } from "@/components/landing/floating-particles"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#00C975] selection:text-black">
      <FloatingParticles />
      <div className="mesh-container">
        <div className="mesh-gradient" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <div className="container mx-auto px-4 pt-56 pb-32">
          {/* Hero Section */}
          <div className="text-center max-w-5xl mx-auto mb-32">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-12">
              <span className="w-2 h-2 rounded-full bg-[#00C975] animate-pulse" />
              <span className="luxury-text">Next-Gen Link Tracking</span>
            </div>

            <h1 className="text-4xl md:text-6xl hero-heading mb-8">
              TRACK EXACTLY WHERE <br />
              <span className="text-[#00C975]">YOUR CLICKS COME FROM</span>
            </h1>

            <p className="text-zinc-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium mb-12">
              Frome.io helps you pinpoint exactly which link placement like a banner, signature,
              or bio is driving traffic to your site.
            </p>

            <TrackInput />
          </div>

          {/* Dashboard Preview */}
          <DashboardPreview />
        </div>

        {/* Logo Cloud */}
        <LogoCloud />

        {/* How It Works */}
        <HowItWorks />

        {/* Pricing Section */}
        <div className="py-20">
          <PricingSection />
        </div>

        {/* Features Section */}
        <div className="py-20">
          <FeaturesSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
