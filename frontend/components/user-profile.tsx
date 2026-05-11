"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMe } from "@/hooks/auth/useMe"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/auth/useLogout"
import { useLogoutAll } from "@/hooks/auth/useLogoutAll"
import { useUserById } from "@/hooks/auth/useUserById"
import { useSearchParams } from "next/navigation"

function getInitials(name?: string) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "U"
}

export function UserProfile() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId") ?? undefined
  const isExternal = Boolean(userId)

  const {
    data: externalData,
    isLoading: isExternalLoading,
    isError: isExternalError,
  } = useUserById(userId)
  const {
    data: meData,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useMe({
    enabled: !isExternal,
  })

  const user = isExternal ? externalData?.data?.user : meData?.data?.user
  const isLoading = isExternal ? isExternalLoading : isMeLoading
  const isError = isExternal ? isExternalError : isMeError
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
            Unable to load profile details.
          </p>
        </CardContent>
      </Card>
    )
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar ?? ""} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="text-xl font-semibold text-foreground">
            {user.name}
          </div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {user.role}
          </span>
          <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            Member since {memberSince}
          </span>
        </div>
        {!isExternal && (
          <div className="flex flex-wrap items-center justify-center gap-3">
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
        )}
      </CardContent>
    </Card>
  )
}
