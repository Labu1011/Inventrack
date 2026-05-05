import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createStockMovement,
  type CreateStockMovementInput,
} from "@/lib/api/stockMovements.api"
import { toast } from "sonner"

export function useCreateStockMovement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStockMovementInput) => createStockMovement(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["stock-history"] })
      queryClient.invalidateQueries({ queryKey: ["low-stock-products"] })
      toast.success(res?.message ?? "Stock movement created successfully")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create stock movement")
    },
  })
}
