import { UserProfile } from "@/components/user-profile"

export default function Page() {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">
          View your account information.
        </p>
      </div>
      <UserProfile />
    </div>
  )
}
