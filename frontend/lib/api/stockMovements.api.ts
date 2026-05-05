import { fetchWithAuth } from "./auth.api"

export type StockMovementType = "IN" | "OUT" | "ADJUST"

export type CreateStockMovementInput = {
  productId: string
  type: StockMovementType
  quantity: number
  note?: string
}

export async function getStockHistory({
  page = 1,
  limit = 10,
  type,
  startDate,
  endDate,
}: {
  page?: number
  limit?: number
  type?: StockMovementType
  startDate?: string
  endDate?: string
} = {}) {
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("limit", String(limit))

  if (type) params.set("type", type)
  if (startDate) params.set("startDate", startDate)
  if (endDate) params.set("endDate", endDate)

  const query = params.toString()

  return fetchWithAuth(`/stock/history${query ? `?${query}` : ""}`, {
    method: "GET",
  })
}

export async function createStockMovement(data: CreateStockMovementInput) {
  return fetchWithAuth(`/stock/move`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}
