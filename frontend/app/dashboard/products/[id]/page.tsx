"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductDetails } from "@/hooks/products/useProductDetails"
import { ArrowLeftIcon } from "lucide-react"

function formatCurrency(value: string) {
  const parsed = Number(value)

  if (Number.isNaN(parsed)) return "-"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(parsed)
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

type ProductDetails = {
  id: string
  name: string
  sku: string
  category: {
    id: string
    name: string
  }
  unit: string
  costPrice: string
  sellingPrice: string
  reorderLevel: number
  currentStock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type ProductDetailsResponse = {
  data?: {
    product?: ProductDetails
  }
}

export default function Page() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const { data, isLoading, isError } = useProductDetails(String(id))
  const product = (data as ProductDetailsResponse)?.data?.product

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Product Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Review product information and current stock level.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/products">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to products
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{product?.name ?? "Product"}</CardTitle>
          <CardDescription>
            SKU: {product?.sku ?? "-"} · Category:{" "}
            {product?.category?.name ?? "-"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError || !product ? (
            <p className="text-sm text-destructive">
              Unable to load product details. Please try again.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                {product.isActive ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                    Deleted
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Unit</p>
                <p className="text-sm font-medium">{product.unit}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cost Price</p>
                <p className="text-sm font-medium">
                  {formatCurrency(product.costPrice)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Selling Price</p>
                <p className="text-sm font-medium">
                  {formatCurrency(product.sellingPrice)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reorder Level</p>
                <p className="text-sm font-medium">{product.reorderLevel}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-sm font-semibold">{product.currentStock}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="text-sm font-medium">
                  {formatDateTime(product.createdAt)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Updated At</p>
                <p className="text-sm font-medium">
                  {formatDateTime(product.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
