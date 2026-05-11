"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useOrderDetails } from "@/hooks/orders/useOrderDetails"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { OrderStatus } from "@/lib/api/orders.api"
import { ArrowLeftIcon } from "lucide-react"

type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: string
  product?: {
    id: string
    name: string
  }
}

type OrderDetails = {
  id: string
  orderNumber: number
  user: {
    id: string
    name: string
  }
  status: OrderStatus
  totalAmount: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  CONFIRMED: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  SHIPPED: "bg-violet-100 text-violet-700 hover:bg-violet-100",
  DELIVERED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
}

function formatCurrency(value: string | number) {
  const parsed = typeof value === "string" ? Number(value) : value

  if (Number.isNaN(parsed)) return "-"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(parsed)
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function Page() {
  const params = useParams()
  const orderId = params?.id as string | undefined

  const { data, isLoading, isError } = useOrderDetails(orderId)
  const orderPayload = data?.data?.order ?? data?.data
  const order = orderPayload as OrderDetails | undefined

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Order Details{order ? ` — #${order.orderNumber}` : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            Review order summary, customer, and items.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to orders
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              Unable to load order details. Please try again.
            </p>
          ) : !order ? (
            <p className="text-sm text-muted-foreground">Order not found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">
                  Status
                </p>
                <Badge className={statusStyles[order.status]}>
                  {order.status}
                </Badge>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">
                  Customer
                </p>
                <Link
                  href="/dashboard/profile"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {order.user?.name}
                </Link>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">
                  Created
                </p>
                <p className="text-sm font-medium">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">
                  Last updated
                </p>
                <p className="text-sm font-medium">
                  {formatDate(order.updatedAt)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Items</p>
                <p className="text-sm font-medium">{order.orderItems.length}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !order ? (
            <p className="text-sm text-muted-foreground">No items available.</p>
          ) : order.orderItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This order has no items.
            </p>
          ) : (
            <div className="space-y-3">
              {order.orderItems.map((item) => {
                const lineTotal = Number(item.unitPrice) * item.quantity

                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3"
                  >
                    <div>
                      {item.product?.id ? (
                        <Link
                          href={`/dashboard/products/${item.product.id}`}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          {item.product?.name ?? "Unnamed product"}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold">
                          {item.product?.name ?? "Unnamed product"}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Product ID: {item.productId}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="px-2">
                        {item.quantity}x
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.unitPrice)} each
                        </p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
