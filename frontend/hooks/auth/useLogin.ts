import { login } from "@/lib/api/auth.api"
import { setAccessToken } from "@/lib/tokenStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      toast.success(response.message ?? "User logged in")
      setAccessToken(response?.data.accessToken)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
