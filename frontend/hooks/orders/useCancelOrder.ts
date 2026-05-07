import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cancelOrder } from "@/lib/api/orders.api"
import { toast } from "sonner"

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["my-orders"] })
      toast.success(res?.message ?? "Order cancelled successfully")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to cancel order")
    },
  })
}
