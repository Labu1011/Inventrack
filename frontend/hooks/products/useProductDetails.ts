import { useQuery } from "@tanstack/react-query"
import { getProductDetails } from "@/lib/api/products.api"

export function useProductDetails(id: string) {
  return useQuery({
    queryKey: ["product-details", id],
    queryFn: () => getProductDetails(id),
    enabled: Boolean(id),
  })
}
