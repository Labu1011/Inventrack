import { useMutation } from "@tanstack/react-query"
import { createStaffUser } from "@/lib/api/auth.api"
import { toast } from "sonner"

export function useCreateStaffUser() {
  return useMutation({
    mutationFn: createStaffUser,
    onSuccess: (response) => {
      toast.success(response?.message ?? "Staff account created successfully.")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create staff account")
    },
  })
}
