"use client"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useMe } from "@/hooks/auth/useMe"
import { CreateProductForm } from "@/components/create-product-form"
import { CreateStockMovementForm } from "@/components/create-stock-movement-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CirclePlusIcon, MoonIcon, SunIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTheme } from "next-themes"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const { data, isLoading } = useMe()
  const pathname = usePathname()
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  const role = data?.data?.user?.role
  const isAdmin = role === "ADMIN"
  const isManager = role === "MANAGER"
  const canQuickCreate = isAdmin || isManager
  const quickCreateTitle = isAdmin
    ? "Create Product"
    : isManager
      ? "Create Stock Movement"
      : "Quick Create"

  const isActiveRoute = (url: string) => {
    if (url === "/dashboard") return pathname === url
    return pathname === url || pathname.startsWith(`${url}/`)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              disabled={!canQuickCreate}
              onClick={() => {
                if (!canQuickCreate) return
                setIsQuickCreateOpen(true)
              }}
            >
              <CirclePlusIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <Dialog open={isQuickCreateOpen} onOpenChange={setIsQuickCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{quickCreateTitle}</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              {isAdmin ? (
                <CreateProductForm
                  onClose={() => setIsQuickCreateOpen(false)}
                />
              ) : isManager ? (
                <CreateStockMovementForm
                  onClose={() => setIsQuickCreateOpen(false)}
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActiveRoute(item.url)}
              >
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
