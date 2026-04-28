import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProduct } from "@/lib/api/products.api"
import { toast } from "sonner"

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(res?.message ?? "Product deleted")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete product")
    },
  })
}
