"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useMe } from "@/hooks/auth/useMe"
import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data, isLoading, isError } = useMe()
  const router = useRouter()
  const pathname = usePathname()

  const role = data?.data?.user?.role

  useEffect(() => {
    if (isError) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }

    if (role === "USER") {
      router.replace("/products")
      return
    }

    console.log(data?.data?.user?.role)
  }, [data, isError, pathname, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  if (isError) return null
  if (!role || role === "USER") return null

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
