"use client"

import { LandingNavbar } from "@/components/landing-navbar"
import { useMyOrders } from "@/hooks/orders/useMyOrders"
import { useCancelOrder } from "@/hooks/orders/useCancelOrder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { OrderStatus } from "@/lib/api/orders.api"

type OrderItem = {
  id: string
  quantity: number
  unitPrice: string
  product: {
    id: string
    name: string
    sku: string
  }
}

type Order = {
  id: string
  orderNumber: number
  status: OrderStatus
  totalAmount: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
}

type OrdersResponse = {
  data?: {
    orders?: Order[]
  }
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
}

function formatCurrency(value: string) {
  const parsed = Number(value)

  if (Number.isNaN(parsed)) return "-"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(parsed)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function Page() {
  const { data, isLoading, isError } = useMyOrders()
  const cancelMutation = useCancelOrder()

  const orders = (data as OrdersResponse)?.data?.orders ?? []

  return (
    <div className="min-h-screen bg-muted/20">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
            <p className="text-sm text-muted-foreground">
              Track your purchases, view item details, and manage cancellations.
            </p>
          </div>

          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ) : isError ? (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive">
                  Unable to load your orders. Please try again.
                </p>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You have not placed any orders yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const canCancel =
                  order.status === "PENDING" || order.status === "CONFIRMED"

                return (
                  <Card key={order.id}>
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.orderNumber}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelMutation.mutate(order.id)}
                          disabled={!canCancel || cancelMutation.isPending}
                        >
                          Cancel Order
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-2">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-1 rounded-md border border-border/60 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <div className="font-medium text-foreground">
                                {item.product.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                SKU: {item.product.sku}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Unit: {formatCurrency(item.unitPrice)}
                            </div>
                            <div className="text-sm font-semibold">
                              {formatCurrency(
                                String(Number(item.unitPrice) * item.quantity),
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
