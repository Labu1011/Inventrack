import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "@/lib/api/products.api"
import { toast } from "sonner"

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => createProduct(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(res?.message ?? "Product created successfully")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create product")
    },
  })
}
