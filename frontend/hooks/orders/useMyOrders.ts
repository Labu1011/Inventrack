import { useQuery } from "@tanstack/react-query"
import { getMyOrders } from "@/lib/api/orders.api"

export function useMyOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders(),
  })
}
