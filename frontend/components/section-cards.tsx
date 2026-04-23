"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDashboardSummary } from "@/hooks/dashboard/useDashboardSummary"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

export function SectionCards() {
  const { data, isLoading } = useDashboardSummary()

  const summary = data?.data

  const orderCount = summary?.orderCount ?? 0
  const deliveredOrders = summary?.deliveredOrders ?? 0
  const cancelledOrders = summary?.cancelledOrders ?? 0
  const pendingOrders = summary?.pendingOrders ?? 0
  const lowStockCount = summary?.lowStockCount ?? 0
  const grossSale = summary?.grossSale ?? 0
  const netSale = summary?.netSale ?? 0
  const cancelledValue = summary?.cancelledValue ?? 0
  const realizedRevenue = summary?.realizedRevenue ?? 0

  const cancellationRate =
    orderCount > 0 ? Math.round((cancelledOrders / orderCount) * 100) : 0
  const completedOrders = deliveredOrders + cancelledOrders
  const fulfillmentRate =
    completedOrders > 0
      ? Math.round((deliveredOrders / completedOrders) * 100)
      : 0

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Net Sales</CardDescription>
          <CardTitle className="text-2xl flex items-center gap-1.5 font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              currency.format(netSale)
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {cancellationRate > 30 ? (
                <TrendingDownIcon />
              ) : (
                <TrendingUpIcon />
              )}
              {cancellationRate}% cancelled
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Gross {currency.format(grossSale)} • Cancelled{" "}
            {currency.format(cancelledValue)}
          </div>
          <div className="text-muted-foreground">
            Realized revenue: {currency.format(realizedRevenue)}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="h-6 w-16" /> : orderCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {pendingOrders > 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
              {pendingOrders} pending
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {deliveredOrders} delivered • {cancelledOrders} cancelled
          </div>
          <div className="text-muted-foreground">
            Track order pipeline health in real-time
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Fulfillment Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              `${fulfillmentRate}%`
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {fulfillmentRate >= 50 ? (
                <TrendingUpIcon />
              ) : (
                <TrendingDownIcon />
              )}
              {deliveredOrders}/{completedOrders} delivered
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {completedOrders > 0
              ? `${completedOrders} completed • ${pendingOrders} in progress`
              : `${pendingOrders} in progress • no completed orders yet`}
          </div>
          <div className="text-muted-foreground">
            Completion quality: delivered vs cancelled
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Low Stock Alerts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? <Skeleton className="h-6 w-14" /> : lowStockCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {lowStockCount > 0 ? "Needs reorder" : "In control"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {lowStockCount > 0
              ? "Products are at or below reorder level"
              : "No low stock items right now"}
          </div>
          <div className="text-muted-foreground">
            Monitor inventory risk to avoid stockouts
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
