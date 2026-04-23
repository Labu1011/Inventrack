import { fetchWithAuth } from "@/lib/api/auth.api"
import { useQuery } from "@tanstack/react-query"

export function useCategories(options?: { includeInactive?: boolean }) {
  const includeInactive = options?.includeInactive ?? false

  return useQuery({
    queryKey: ["categories", { includeInactive }],
    queryFn: () =>
      fetchWithAuth(`/categories?includeInactive=${includeInactive}`, {
        method: "GET",
      }),
  })
}
