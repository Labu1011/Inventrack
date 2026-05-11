"use client"

import { useState } from "react"
import Link from "next/link"
import { useOrders } from "@/hooks/orders/useOrders"
import { useUpdateOrderStatus } from "@/hooks/orders/useUpdateOrderStatus"
import { useMe } from "@/hooks/auth/useMe"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import type { OrderStatus } from "@/lib/api/orders.api"

type Order = {
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
}

type OrdersMeta = {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type OrdersResponse = {
  data?: {
    orders?: Order[]
    meta?: OrdersMeta
  }
}

const statusOptions: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

function isValidStatusTransition(from: OrderStatus, to: OrderStatus) {
  const allowed: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  }

  return allowed[from]?.includes(to) || false
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

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  CONFIRMED: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  SHIPPED: "bg-violet-100 text-violet-700 hover:bg-violet-100",
  DELIVERED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
}

export default function Page() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState({
    status: "all" as OrderStatus | "all",
    startDate: "",
    endDate: "",
  })

  const [appliedFilters, setAppliedFilters] = useState(filters)

  const { data: me } = useMe()
  const role = me?.data?.user?.role
  const canManageOrders = role === "ADMIN" || role === "MANAGER"

  const { data, isLoading, isError } = useOrders({
    page,
    limit,
    status: appliedFilters.status === "all" ? undefined : appliedFilters.status,
    startDate: appliedFilters.startDate
      ? new Date(appliedFilters.startDate).toISOString()
      : undefined,
    endDate: appliedFilters.endDate
      ? new Date(appliedFilters.endDate).toISOString()
      : undefined,
  })

  const orders = (data as OrdersResponse)?.data?.orders ?? []
  const meta = (data as OrdersResponse)?.data?.meta
  const updateStatusMutation = useUpdateOrderStatus()

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const handleClearFilters = () => {
    const cleared = { status: "all" as const, startDate: "", endDate: "" }

    setFilters(cleared)
    setAppliedFilters(cleared)
    setPage(1)
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Orders</h2>
        <p className="text-sm text-muted-foreground">
          Review recent orders, filter by status or date, and manage order
          progress.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            Filter by status or date range and navigate pages.
          </CardDescription>
          <div className="flex flex-wrap items-end justify-end gap-3 pt-2">
            <div className="ml-auto flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="order-status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: value as OrderStatus | "all",
                    }))
                  }
                  disabled={!canManageOrders}
                >
                  <SelectTrigger id="order-status" size="sm" className="w-40">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All statuses</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="start-date">Start date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  disabled={!canManageOrders}
                  className="w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="end-date">End date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  disabled={!canManageOrders}
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleApplyFilters}
                  disabled={!canManageOrders}
                >
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  disabled={!canManageOrders}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              Unable to load orders. Please try again.
            </p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders found.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.orderNumber}</TableCell>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        <Link
                          href="/dashboard/profile"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {order?.user?.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => {
                            const nextStatus = value as OrderStatus

                            if (
                              !isValidStatusTransition(order.status, nextStatus)
                            ) {
                              return
                            }

                            updateStatusMutation.mutate({
                              id: order.id,
                              status: nextStatus,
                            })
                          }}
                          disabled={
                            !canManageOrders ||
                            updateStatusMutation.status === "pending"
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className={`h-8 w-fit gap-2 border-transparent px-2 text-xs font-semibold ${statusStyles[order.status]}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {statusOptions.map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  disabled={
                                    !isValidStatusTransition(
                                      order.status,
                                      status,
                                    )
                                  }
                                >
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{formatDate(order.updatedAt)}</TableCell>
                      <TableCell>
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
              {meta
                ? `${meta.totalCount} total order${meta.totalCount === 1 ? "" : "s"}`
                : ""}
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${limit}`}
                  onValueChange={(value) => {
                    setLimit(Number(value))
                    setPage(1)
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue placeholder={limit} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectGroup>
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {meta?.currentPage ?? 1} of {meta?.totalPages ?? 1}
              </div>

              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setPage(1)}
                  disabled={!meta?.hasPrevPage}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={!meta?.hasPrevPage}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!meta?.hasNextPage}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => setPage(meta?.totalPages ?? 1)}
                  disabled={!meta?.hasNextPage}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
