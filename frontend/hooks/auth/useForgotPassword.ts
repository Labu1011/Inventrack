import { forgotPassword } from "@/lib/api/auth.api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response?.message ?? "Reset link sent.")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
