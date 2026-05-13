"use client"

import { useState } from "react"
import { useProducts } from "@/hooks/products/useProducts"
import { useMe } from "@/hooks/auth/useMe"
import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react"
import { toast } from "sonner"
import { LandingNavbar } from "@/components/landing-navbar"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/formatters"
import type {
  ProductStoreItem,
  ProductsListResponse,
} from "@/lib/types/products"

export default function Page() {
  const { data: me } = useMe()
  const router = useRouter()
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const {
    items,
    itemCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart()

  const { data, isLoading, isError } = useProducts({
    page,
    limit,
    search,
    status: "active",
  })

  const products =
    (data as ProductsListResponse<ProductStoreItem>)?.data?.products ?? []
  const meta = (data as ProductsListResponse<ProductStoreItem>)?.data?.meta

  const handleSearch = () => {
    setPage(1)
    setSearch(searchInput.trim())
  }

  const handleCheckout = () => {
    if (!me?.data?.user) {
      toast.error("Please sign in to place an order")
      return
    }

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <LandingNavbar />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 lg:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Browse Products
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover items, add them to your cart, and checkout securely.
              </p>
            </div>
            <Card className="w-full max-w-xs sm:ml-auto">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cart Summary</CardTitle>
                <CardDescription>
                  {itemCount} items in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(String(subtotal))}
                  </span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      View cart
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Cart</DialogTitle>
                      <DialogDescription>
                        Review items before checkout.
                      </DialogDescription>
                    </DialogHeader>
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Your cart is empty.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center justify-between gap-3 rounded-lg border p-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(item.product.sellingPrice)} ·{" "}
                                {item.product.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(item.product.id, -1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(item.product.id, 1)
                                }
                                disabled={
                                  item.quantity >=
                                  (item.product.currentStock ?? item.quantity)
                                }
                              >
                                <PlusIcon className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <div className="rounded-lg bg-muted/40 p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Items</span>
                            <span className="font-medium">{itemCount}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Subtotal
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(String(subtotal))}
                            </span>
                          </div>
                        </div>
                        <Button className="w-full" onClick={handleCheckout}>
                          Checkout
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex w-full flex-wrap items-center gap-2">
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
          </div>

          <div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Choose items to add to your cart.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} className="p-4">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="mt-3 h-4 w-1/2" />
                        <Skeleton className="mt-6 h-9 w-full" />
                      </Card>
                    ))}
                  </div>
                ) : isError ? (
                  <p className="text-sm text-destructive">
                    Unable to load products. Please try again.
                  </p>
                ) : products.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No products found.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <Card key={product.id} className="flex h-full flex-col">
                        <CardHeader className="pb-2">
                          <CardTitle className="line-clamp-1 text-base">
                            {product.name}
                          </CardTitle>
                          <CardDescription>
                            {product.category?.name ?? "Uncategorized"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">SKU</span>
                            <span className="font-medium">{product.sku}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Unit</span>
                            <span className="font-medium">{product.unit}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-semibold">
                              {formatCurrency(product.sellingPrice)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Stock</span>
                            <span className="font-medium">
                              {product.currentStock ?? 0}
                            </span>
                          </div>
                          {(product.currentStock ?? 0) === 0 ? (
                            <Badge className="w-fit bg-red-100 text-red-700">
                              Out of stock
                            </Badge>
                          ) : (product.currentStock ?? 0) <=
                            product.reorderLevel ? (
                            <Badge className="w-fit bg-amber-100 text-amber-700">
                              Low stock
                            </Badge>
                          ) : null}
                          <Button
                            className="mt-auto"
                            onClick={() => addToCart(product)}
                            disabled={(product.currentStock ?? 0) === 0}
                          >
                            Add to cart
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {meta && (
                  <div className="mt-6 flex items-center justify-between px-1">
                    <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                      {`${meta.totalCount} product${meta.totalCount === 1 ? "" : "s"}`}
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                      <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {meta.currentPage} of {meta.totalPages}
                      </div>
                      <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                          variant="outline"
                          className="hidden h-8 w-8 p-0 lg:flex"
                          onClick={() => setPage(1)}
                          disabled={!meta.hasPrevPage}
                        >
                          <span className="sr-only">Go to first page</span>
                          <ChevronsLeftIcon />
                        </Button>
                        <Button
                          variant="outline"
                          className="size-8"
                          size="icon"
                          onClick={() =>
                            setPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={!meta.hasPrevPage}
                        >
                          <span className="sr-only">Go to previous page</span>
                          <ChevronLeftIcon />
                        </Button>
                        <Button
                          variant="outline"
                          className="size-8"
                          size="icon"
                          onClick={() => setPage((prev) => prev + 1)}
                          disabled={!meta.hasNextPage}
                        >
                          <span className="sr-only">Go to next page</span>
                          <ChevronRightIcon />
                        </Button>
                        <Button
                          variant="outline"
                          className="hidden size-8 lg:flex"
                          size="icon"
                          onClick={() => setPage(meta.totalPages)}
                          disabled={!meta.hasNextPage}
                        >
                          <span className="sr-only">Go to last page</span>
                          <ChevronsRightIcon />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
