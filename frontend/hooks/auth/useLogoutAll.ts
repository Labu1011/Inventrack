import { logoutAll } from "@/lib/api/auth.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useLogoutAll() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutAll,
    onSuccess: (response) => {
      toast.success(response.message ?? "Logged out from all devices")
      queryClient.removeQueries({ queryKey: ["me"] })
      router.replace("/")
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
