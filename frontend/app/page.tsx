import { LandingNavbar } from "@/components/landing-navbar"
import { AboutSection } from "@/components/ui/about-section"
import { CTASection } from "@/components/ui/cta-section"
import { FAQSection } from "@/components/ui/faq-section"
import { FeaturesSection } from "@/components/ui/features-section"
import { HeroSection } from "@/components/ui/hero-section"
import { WorkflowSection } from "@/components/ui/workflow-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="flex items-center justify-center px-8 py-12">
        <HeroSection />
      </main>
      <FeaturesSection />
      <WorkflowSection />
      <AboutSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
