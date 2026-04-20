import { fetchWithAuth } from "@/lib/api/auth.api"
import { useQuery } from "@tanstack/react-query"

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => fetchWithAuth("/auth/me"),
    retry: false,
    refetchOnWindowFocus: false,
  })
}
