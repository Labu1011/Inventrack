import type { LowStockProduct } from "@/lib/api/products.api"
import type { StockMovementType } from "@/lib/api/stockMovements.api"

export type StockMovement = {
  id: string
  productId: string
  orderId?: string | null
  type: StockMovementType
  quantity: number
  note?: string | null
  createdAt: string
  updatedAt: string
  product: {
    name: string
    sku: string
    category?: {
      name: string
    } | null
  }
}

export type StockMovementsMeta = {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type StockMovementsResponse = {
  data?: {
    stockHistory?: StockMovement[]
    meta?: StockMovementsMeta
  }
}

export type LowStockProductsMeta = {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type LowStockProductsResponse = {
  data?: {
    products?: LowStockProduct[]
    meta?: LowStockProductsMeta
  }
}
