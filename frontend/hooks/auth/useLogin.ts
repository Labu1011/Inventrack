import { login } from "@/lib/api/auth.api"
import { setAccessToken } from "@/lib/tokenStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response?.data.accessToken)
      queryClient.removeQueries({ queryKey: ["me"] })
      toast.success(response.message ?? "User logged in")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
