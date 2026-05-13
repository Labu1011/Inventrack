"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMe } from "@/hooks/auth/useMe"
import { useLogout } from "@/hooks/auth/useLogout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/components/providers/cart-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ShoppingCartIcon } from "lucide-react"

function getInitials(name?: string) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "U"
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function LandingNavbar() {
  const { data, isLoading, isError } = useMe()
  const { mutate } = useLogout()
  const user = data?.data?.user
  const { items, itemCount, subtotal, updateQuantity, removeFromCart } =
    useCart()

  return (
    <nav className="border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <span className="text-lg font-semibold text-primary">
              Inventrack
            </span>
          </Link>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            {user?.role ?? "Guest"}
          </span>
        </div>

        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a
            href="/#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="/#workflow"
            className="transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <Link
            href="/products"
            className="transition-colors hover:text-foreground"
          >
            Products
          </Link>
          {user ? (
            <Link
              href="/my-orders"
              className="transition-colors hover:text-foreground"
            >
              My Orders
            </Link>
          ) : null}
          <a href="/#about" className="transition-colors hover:text-foreground">
            About
          </a>
          <a href="/#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCartIcon />
                {itemCount > 0 ? (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 min-w-5 px-1 text-[10px]"
                  >
                    {itemCount}
                  </Badge>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-64">
              <DropdownMenuLabel>Cart</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.length === 0 ? (
                <DropdownMenuItem className="text-muted-foreground">
                  Your cart is empty.
                </DropdownMenuItem>
              ) : (
                <div className="space-y-2 px-2 py-1">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium text-foreground">
                          {item.product.name}
                        </div>
                        <div className="text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          disabled={
                            item.quantity >=
                            (item.product.currentStock ?? item.quantity)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          x
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <Link href="/checkout" className="block">
                    <Button className="w-full" size="sm">
                      Go to checkout
                    </Button>
                  </Link>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {!isLoading && !isError && user ? (
            <>
              {user.role === "USER" ? null : (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              )}
              <Link href="/profile" className="rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar ?? ""} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => mutate()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Create account</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
