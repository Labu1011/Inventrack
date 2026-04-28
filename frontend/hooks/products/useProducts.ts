import { useQuery } from "@tanstack/react-query"
import { getProducts } from "@/lib/api/products.api"

export function useProducts({
  page,
  limit,
  search,
  status = "active",
}: {
  page: number
  limit: number
  search: string
  status?: "active" | "deleted" | "all"
}) {
  return useQuery({
    queryKey: ["products", { page, limit, search, status }],
    queryFn: () => getProducts({ page, limit, search, status }),
  })
}
