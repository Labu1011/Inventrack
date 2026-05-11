import { resetPassword } from "@/lib/api/auth.api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response?.message ?? "Password reset successful.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
