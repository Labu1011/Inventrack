import { fetchWithAuth } from "@/lib/api/auth.api"
import { useQuery } from "@tanstack/react-query"

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => fetchWithAuth("/auth/me"),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  })
}
