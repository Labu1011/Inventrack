import { LandingNavbar } from "@/components/landing-navbar"
import { UserProfile } from "@/components/user-profile"

export default function Page() {
  return (
    <div className="min-h-screen bg-muted/20">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
        <div className="flex flex-col items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Review your account details.
            </p>
          </div>
          <div className="w-full max-w-xl">
            <UserProfile />
          </div>
        </div>
      </main>
    </div>
  )
}
