import { Button } from "@/components/ui/button"

export function LandingNavbar() {
  return (
    <nav className="border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">Inventrack</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            Guest
          </span>
        </div>

        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="transition-colors hover:text-foreground"
          >
            Pricing
          </a>
          <a href="#about" className="transition-colors hover:text-foreground">
            About
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button size="sm">Create account</Button>
        </div>
      </div>
    </nav>
  )
}
