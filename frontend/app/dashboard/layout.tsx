"use client"

import { useMe } from "@/hooks/auth/useMe"
import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isError } = useMe()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isError) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [isError, pathname, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  if (isError) return null

  return <>{children}</>
}
