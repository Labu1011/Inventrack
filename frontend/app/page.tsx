import { HeroSection } from "@/components/ui/hero-section"
import { LandingNavbar } from "@/components/landing-navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="flex items-center justify-center px-8 py-12">
        <HeroSection />
      </main>
    </div>
  )
}
