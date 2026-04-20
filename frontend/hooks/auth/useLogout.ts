import { logout } from "@/lib/api/auth.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logout,
    onSuccess: (response) => {
      toast.success(response.message ?? "Logged out successfully")
      queryClient.removeQueries({ queryKey: ["me"] })
      router.replace("/")
    },
    onError: (error) => {
      console.log(error)
    },
  })
}
