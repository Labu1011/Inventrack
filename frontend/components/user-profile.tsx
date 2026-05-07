"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMe } from "@/hooks/auth/useMe"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/auth/useLogout"
import { useLogoutAll } from "@/hooks/auth/useLogoutAll"

function getInitials(name?: string) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "U"
}

export function UserProfile() {
  const { data, isLoading, isError } = useMe()
  const user = data?.data?.user
  const logoutMutation = useLogout()
  const logoutAllMutation = useLogoutAll()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unable to load your profile details.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar ?? ""} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-lg font-semibold text-foreground">
            {user.name}
          </div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="mt-2 inline-flex rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            {user.role}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              variant="link"
              className="h-auto p-0 text-destructive"
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </Button>
            <Button
              variant="link"
              className="h-auto p-0 text-destructive"
              onClick={() => logoutAllMutation.mutate()}
            >
              Logout from all devices
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
