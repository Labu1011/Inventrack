import type { OrderStatus } from "@/lib/api/orders.api"

export const orderStatusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
}

export const orderStatusStylesWithHover: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  CONFIRMED: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  SHIPPED: "bg-violet-100 text-violet-700 hover:bg-violet-100",
  DELIVERED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
}
