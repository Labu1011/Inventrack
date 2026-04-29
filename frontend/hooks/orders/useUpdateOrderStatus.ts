import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOrderStatus, type OrderStatus } from "@/lib/api/orders.api"
import { toast } from "sonner"

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success(res?.message ?? "Order status updated")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update order status")
    },
  })
}
