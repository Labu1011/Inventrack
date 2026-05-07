import { LandingNavbar } from "@/components/landing-navbar"
import { UserProfile } from "@/components/user-profile"

export default function Page() {
  return (
    <div className="min-h-screen bg-muted/20">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Review your account details.
            </p>
          </div>
          <UserProfile />
        </div>
      </main>
    </div>
  )
}
