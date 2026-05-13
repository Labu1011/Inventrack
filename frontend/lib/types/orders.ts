import type { OrderStatus } from "@/lib/api/orders.api"

export type OrdersMeta = {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type OrderProductRef = {
  id: string
  name: string
  sku?: string
}

export type OrderItem = {
  id: string
  orderId?: string
  productId?: string
  quantity: number
  unitPrice: string
  product?: OrderProductRef
}

export type OrderBase = {
  id: string
  orderNumber: number
  status: OrderStatus
  totalAmount: string
  createdAt: string
  updatedAt: string
}

export type OrderWithItems = OrderBase & {
  orderItems: OrderItem[]
}

export type OrderWithUser = OrderBase & {
  user: {
    id: string
    name: string
  }
}

export type OrderDetails = OrderWithItems & {
  user: {
    id: string
    name: string
  }
}

export type OrdersListResponse = {
  data?: {
    orders?: OrderWithUser[]
    meta?: OrdersMeta
  }
}

export type OrdersMyResponse = {
  data?: {
    orders?: OrderWithItems[]
  }
}

export type OrderDetailsResponse = {
  data?: {
    order?: OrderDetails
  }
}
