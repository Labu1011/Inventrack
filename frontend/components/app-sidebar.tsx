"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useMe } from "@/hooks/auth/useMe"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ListIcon,
  PackageIcon,
  ShoppingCartIcon,
  ArrowLeftRightIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  CommandIcon,
} from "lucide-react"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: <ListIcon />,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: <PackageIcon />,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Stock Movements",
      url: "/dashboard/stock-movements",
      icon: <ArrowLeftRightIcon />,
    },
  ],
  users: [
    {
      name: "Create Staff Account",
      url: "/dashboard/create-staff-account",
      icon: <UserPlusIcon />,
    },
    {
      name: "Manage Roles",
      url: "/dashboard/manage-roles",
      icon: <ShieldCheckIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: me } = useMe()
  const role = me?.data?.user?.role
  const canManageStaff = role === "ADMIN"

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Inventrack</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {canManageStaff ? <NavDocuments items={data.users} /> : null}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
