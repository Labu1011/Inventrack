import { UserProfile } from "@/components/user-profile"

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 lg:px-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">
          View your account information.
        </p>
      </div>
      <div className="w-full max-w-xl">
        <UserProfile />
      </div>
    </div>
  )
}
