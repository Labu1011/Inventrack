import { fetchWithAuth } from "@/lib/api/auth.api"
import { useQuery } from "@tanstack/react-query"

export function useSalesTrend(groupBy: "month" | "day") {
  return useQuery({
    queryKey: ["sales-trend", groupBy],
    queryFn: () =>
      fetchWithAuth(`/dashboard/sales-trend?groupBy=${groupBy}`, {
        method: "GET",
        credentials: "include",
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
