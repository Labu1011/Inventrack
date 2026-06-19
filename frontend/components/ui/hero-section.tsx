import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="flex min-h-125 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-[var(--muted-foreground)]">
          <Sparkles className="h-4 w-4" />
          New Features Available
        </span>
      </div>

      <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
        Simplify Inventory,
        <br />
        <span className="text-primary">Accelerate Operations.</span>
      </h1>

      <p className="mb-8 max-w-2xl text-lg text-(--foreground)/70">
        Manage your inventory with clarity and speed. Track products, monitor
        stock changes, and handle orders from a single dashboard built for
        growing operations.
      </p>

      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  )
}
