import { fetchWithAuth } from "./auth.api"

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
