"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchWithAuth } from "@/lib/api/auth.api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

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
    queryKey: ["products", { categoryId }],
    queryFn: () =>
      fetchWithAuth(`/products/${categoryId}?limit=50`, { method: "GET" }),
    enabled: !!categoryId,
  })

  const category = categoryResp?.data?.category
  const products = productsResp?.data?.products ?? []

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
        <CardContent>
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
                  {products.map((p: any) => (
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
        </CardContent>
      </Card>
    </div>
  )
}
