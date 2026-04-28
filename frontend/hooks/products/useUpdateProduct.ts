import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProduct } from "@/lib/api/products.api"
import { toast } from "sonner"

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateProduct(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(res?.message ?? "Product updated")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update product")
    },
  })
}
