import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  deleteProduct,
  restoreProduct,
  updateProduct,
} from "@/lib/api/products.api"
import { toast } from "sonner"

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(res?.message ?? "Product deleted")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete product")
    },
  })
}

export function useRestoreProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => restoreProduct(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(res?.message ?? "Product restored")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to restore product")
    },
  })
}

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
