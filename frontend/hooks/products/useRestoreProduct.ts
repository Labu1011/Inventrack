import { useMutation, useQueryClient } from "@tanstack/react-query"
import { restoreProduct } from "@/lib/api/products.api"
import { toast } from "sonner"

export function useRestoreProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => restoreProduct(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(res?.message ?? "Product restored")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to restore product")
    },
  })
}
