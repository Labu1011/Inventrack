import { fetchWithAuth } from "./auth.api"

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

export async function getOrders({
  page = 1,
  limit = 10,
  status,
  startDate,
  endDate,
}: {
  page?: number
  limit?: number
  status?: OrderStatus
  startDate?: string
  endDate?: string
} = {}) {
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("limit", String(limit))

  if (status) params.set("status", status)
  if (startDate) params.set("startDate", startDate)
  if (endDate) params.set("endDate", endDate)

  const query = params.toString()

  return fetchWithAuth(`/orders${query ? `?${query}` : ""}`, {
    method: "GET",
  })
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return fetchWithAuth(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export async function getOrderById(id: string) {
  return fetchWithAuth(`/orders/${id}`, {
    method: "GET",
  })
}
