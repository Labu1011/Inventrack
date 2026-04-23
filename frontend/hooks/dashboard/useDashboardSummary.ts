import { fetchWithAuth } from "@/lib/api/auth.api"
import { useQuery } from "@tanstack/react-query"

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["summary"],
    queryFn: () =>
      fetchWithAuth("/dashboard/summary", {
        method: "GET",
        credentials: "include",
      }),
  })
}
