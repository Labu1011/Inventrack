import { useMutation, useQueryClient } from "@tanstack/react-query"
import { placeOrder } from "@/lib/api/orders.api"
import { toast } from "sonner"

export function usePlaceOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items: { productId: string; quantity: number }[]) =>
      placeOrder(items),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success(res?.message ?? "Order placed successfully")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to place order")
    },
  })
}
