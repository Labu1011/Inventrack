"use client"

import { useState } from "react"
import Link from "next/link"
import { useProducts } from "@/hooks/products/useProducts"
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct"
import { useRestoreProduct } from "@/hooks/products/useRestoreProduct"
import { useMe } from "@/hooks/auth/useMe"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeftIcon,
  PencilIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateProductForm } from "@/components/create-product-form"
import { UpdateProductForm } from "@/components/update-product-form"
import { toast } from "sonner"
import { formatCurrency, formatDate } from "@/lib/formatters"
import type {
  ProductAdminListItem,
  ProductsListResponse,
} from "@/lib/types/products"

export default function Page() {
  const { data: me } = useMe()
  const role = me?.data?.user?.role
  const canManageProducts = role === "ADMIN"
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [productFilter, setProductFilter] = useState<
    "active" | "deleted" | "all"
  >("active")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string
    name: string
    sku: string
    categoryId: string
    unit: string
    costPrice: string
    sellingPrice: string
    reorderLevel: number
  } | null>(null)

  const { data, isLoading, isError } = useProducts({
    page,
    limit,
    search,
    status: productFilter,
  })

  const products =
    (data as ProductsListResponse<ProductAdminListItem>)?.data?.products ?? []
  const meta = (data as ProductsListResponse<ProductAdminListItem>)?.data?.meta

  const deleteMutation = useDeleteProduct()
  const restoreMutation = useRestoreProduct()

  const handleSearch = () => {
    setPage(1)
    setSearch(searchInput.trim())
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            Browse all active products with search and pagination.
          </p>
        </div>
        {canManageProducts ? (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create Product
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Search by product name and navigate through pages.
          </CardDescription>
          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="flex flex-wrap w-full items-center gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSearch()
                  }
                }}
                placeholder="Search products..."
                className="w-full max-w-sm"
              />
              <Button variant="outline" onClick={handleSearch}>
                Search
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchInput("")
                  setSearch("")
                  setPage(1)
                }}
              >
                Clear
              </Button>
            </div>
            <Select
              value={productFilter}
              onValueChange={(value) => {
                setProductFilter(value as "active" | "deleted" | "all")
                setPage(1)
              }}
            >
              <SelectTrigger id="product-filter" size="sm" className="w-36">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">Active only</SelectItem>
                  <SelectItem value="deleted">Deleted only</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              Unable to load products. Please try again.
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products found.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Cost Price</TableHead>
                    <TableHead className="text-right">Selling Price</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    {canManageProducts && (
                      <TableHead className="text-right">Action</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.costPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.sellingPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.currentStock ?? 0}
                      </TableCell>
                      <TableCell>
                        {product.isActive ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            Deleted
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(product.createdAt)}</TableCell>
                      {canManageProducts && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={!product.isActive}
                              onClick={() => {
                                setSelectedProduct({
                                  id: product.id,
                                  name: product.name,
                                  sku: product.sku,
                                  categoryId: product.category.id,
                                  unit: product.unit,
                                  costPrice: product.costPrice,
                                  sellingPrice: product.sellingPrice,
                                  reorderLevel: product.reorderLevel,
                                })
                                setIsEditModalOpen(true)
                              }}
                            >
                              <PencilIcon className="mr-1 h-4 w-4" />
                              Edit
                            </Button>

                            {product.isActive ? (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                disabled={
                                  deleteMutation.status === "pending" ||
                                  restoreMutation.status === "pending"
                                }
                                onClick={() =>
                                  deleteMutation.mutate(product.id)
                                }
                              >
                                Delete
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={
                                  deleteMutation.status === "pending" ||
                                  restoreMutation.status === "pending"
                                }
                                onClick={() =>
                                  restoreMutation.mutate(product.id)
                                }
                              >
                                Restore
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
              {meta
                ? `${meta.totalCount} total product${meta.totalCount === 1 ? "" : "s"}`
                : ""}
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${limit}`}
                  onValueChange={(value) => {
                    setLimit(Number(value))
                    setPage(1)
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue placeholder={limit} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectGroup>
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {meta?.currentPage ?? 1} of {meta?.totalPages ?? 1}
              </div>

              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setPage(1)}
                  disabled={!meta?.hasPrevPage}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={!meta?.hasPrevPage}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!meta?.hasNextPage}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => setPage(meta?.totalPages ?? 1)}
                  disabled={!meta?.hasNextPage}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {canManageProducts && (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <CreateProductForm onClose={() => setIsCreateModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {canManageProducts && (
        <Dialog
          open={isEditModalOpen}
          onOpenChange={(open) => {
            setIsEditModalOpen(open)
            if (!open) setSelectedProduct(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              {selectedProduct && (
                <UpdateProductForm
                  product={selectedProduct}
                  onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedProduct(null)
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
