import { useQuery } from "@tanstack/react-query"
import { getOrderById } from "@/lib/api/orders.api"

export function useOrderDetails(orderId?: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId as string),
    enabled: Boolean(orderId),
  })
}
