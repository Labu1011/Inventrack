import { fetchWithAuth } from "./auth.api"

export type LowStockProduct = {
  id: string
  name: string
  sku: string
  categoryId: string
  unit: string
  costPrice: string
  sellingPrice: string
  reorderLevel: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: {
    name: string
    id: string
  }
  currentStock: number
}

export async function getProducts({
  page = 1,
  limit = 10,
  search = "",
  status = "active",
} = {}) {
  return fetchWithAuth(
    `/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}`,
    {
      method: "GET",
    },
  )
}

export async function deleteProduct(id: string) {
  return fetchWithAuth(`/products/${id}/delete`, { method: "PATCH" })
}

export async function restoreProduct(id: string) {
  return fetchWithAuth(`/products/${id}/restore`, { method: "PATCH" })
}

export async function updateProduct(id: string, data: any) {
  return fetchWithAuth(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function createProduct(data: any) {
  return fetchWithAuth(`/products`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getLowStockProducts({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number
  limit?: number
  search?: string
} = {}) {
  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("limit", String(limit))

  if (search) params.set("search", search)

  const query = params.toString()

  return fetchWithAuth(`/stock/low-stock${query ? `?${query}` : ""}`, {
    method: "GET",
  })
}
