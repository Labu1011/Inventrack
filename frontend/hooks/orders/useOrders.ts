import { useQuery } from "@tanstack/react-query"
import { getOrders, type OrderStatus } from "@/lib/api/orders.api"

export function useOrders({
  page,
  limit,
  status,
  startDate,
  endDate,
}: {
  page: number
  limit: number
  status?: OrderStatus
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ["orders", { page, limit, status, startDate, endDate }],
    queryFn: () => getOrders({ page, limit, status, startDate, endDate }),
  })
}
