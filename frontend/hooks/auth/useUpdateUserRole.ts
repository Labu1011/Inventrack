import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUserRole } from "@/lib/api/auth.api"
import { toast } from "sonner"

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["staff-accounts"] })
      toast.success(response?.message ?? "User role updated")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update user role")
    },
  })
}
