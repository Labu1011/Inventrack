export type ProductCategoryRef = {
  id: string
  name: string
}

export type ProductListItem = {
  id: string
  name: string
  sku: string
  category: ProductCategoryRef
  unit: string
  sellingPrice: string
  currentStock?: number
}

export type ProductStoreItem = ProductListItem & {
  reorderLevel: number
}

export type ProductAdminListItem = ProductListItem & {
  costPrice: string
  reorderLevel: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ProductDetails = {
  id: string
  name: string
  sku: string
  category: ProductCategoryRef
  unit: string
  costPrice: string
  sellingPrice: string
  reorderLevel: number
  currentStock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CategoryProductItem = {
  id: string
  name: string
  sku: string
  unit: string
  sellingPrice: string
  reorderLevel: number
  isActive: boolean
  createdAt: string
}

export type ProductsMeta = {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type ProductsListResponse<T> = {
  data?: {
    products?: T[]
    meta?: ProductsMeta
  }
}

export type ProductDetailsResponse = {
  data?: {
    product?: ProductDetails
  }
}
