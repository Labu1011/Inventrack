"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchWithAuth } from "@/lib/api/auth.api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
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
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import { useState } from "react"

type Product = {
  id: string
  name: string
  sku: string
  unit: string
  sellingPrice: string
  reorderLevel: number
  isActive: boolean
  createdAt: string
}

type ProductsMeta = {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value
  if (Number.isNaN(num)) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num)
}

export default function Page() {
  const params = useParams()
  const categoryId = params?.id as string | undefined
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const {
    data: categoryResp,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () =>
      fetchWithAuth(`/categories/${categoryId}`, { method: "GET" }),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  })

  const {
    data: productsResp,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery({
    queryKey: ["category-products", { categoryId, page, limit }],
    queryFn: () =>
      fetchWithAuth(`/products/${categoryId}?page=${page}&limit=${limit}`, {
        method: "GET",
      }),
    enabled: !!categoryId,
  })

  const category = categoryResp?.data?.category
  const products = (productsResp?.data?.products ?? []) as Product[]
  const meta = productsResp?.data?.meta as ProductsMeta | undefined

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Products{category ? ` — ${category.name}` : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            Read-only list of products for this category.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/categories">
            <Button variant="outline">Back to categories</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingCategory || isLoadingProducts ? (
            <div className="grid gap-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          ) : isErrorCategory || isErrorProducts ? (
            <div className="text-sm text-red-500">
              Unable to load products for this category.
            </div>
          ) : products.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No products found for this category.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Reorder</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.sku}</TableCell>
                      <TableCell>{p.unit}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(p.sellingPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {p.reorderLevel}
                      </TableCell>
                      <TableCell>{p.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </TableCell>
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
                <Label
                  htmlFor="category-products-rows-per-page"
                  className="text-sm font-medium"
                >
                  Rows per page
                </Label>
                <Select
                  value={`${limit}`}
                  onValueChange={(value) => {
                    setLimit(Number(value))
                    setPage(1)
                  }}
                >
                  <SelectTrigger
                    size="sm"
                    className="w-20"
                    id="category-products-rows-per-page"
                  >
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
    </div>
  )
}
