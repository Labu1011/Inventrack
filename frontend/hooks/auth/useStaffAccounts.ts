import { useQuery } from "@tanstack/react-query"
import { getStaffAccounts } from "@/lib/api/auth.api"

export function useStaffAccounts() {
  return useQuery({
    queryKey: ["staff-accounts"],
    queryFn: () => getStaffAccounts(),
  })
}
