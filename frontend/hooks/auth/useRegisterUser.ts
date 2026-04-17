import { registerUser } from "@/lib/api/auth.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { error } from "console"
import { toast } from "sonner"

export function useRegisterUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      toast.success(response.message ?? "Account created successfully.")
      queryClient.invalidateQueries({ queryKey: ["me"] })
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message)
    },
  })
}
