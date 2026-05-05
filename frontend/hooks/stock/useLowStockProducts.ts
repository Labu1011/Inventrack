import { useQuery } from "@tanstack/react-query"
import {
  getLowStockProducts,
  type LowStockProduct,
} from "@/lib/api/products.api"

export function useLowStockProducts({
  page,
  limit,
  search,
}: {
  page: number
  limit: number
  search?: string
}) {
  return useQuery({
    queryKey: ["low-stock-products", { page, limit, search }],
    queryFn: () => getLowStockProducts({ page, limit, search }),
  })
}
