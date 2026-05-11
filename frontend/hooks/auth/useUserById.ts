import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/lib/api/auth.api"

export function useUserById(userId?: string) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserById(userId as string),
    enabled: Boolean(userId),
  })
}
