"use client"

import { useState } from "react"
import Link from "next/link"
import { useMe } from "@/hooks/auth/useMe"
import { CreateStockMovementForm } from "@/components/create-stock-movement-form"
import { useLowStockProducts } from "@/hooks/stock/useLowStockProducts"
import { useStockMovements } from "@/hooks/stock/useStockMovements"
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
import type { LowStockProduct } from "@/lib/api/products.api"
import type { StockMovementType } from "@/lib/api/stockMovements.api"

type StockMovement = {
  id: string
  productId: string
  orderId?: string | null
  type: StockMovementType
  quantity: number
  note?: string | null
  createdAt: string
  updatedAt: string
  product: {
    name: string
    sku: string
    category?: {
      name: string
    } | null
  }
}

type StockMovementsMeta = {
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type StockMovementsResponse = {
  data?: {
    stockHistory?: StockMovement[]
    meta?: StockMovementsMeta
  }
}

type LowStockProductsResponse = {
  data?: {
    products?: LowStockProduct[]
    meta?: {
      totalCount: number
      totalPages: number
      currentPage: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

const typeOptions: StockMovementType[] = ["IN", "OUT", "ADJUST"]

const typeStyles: Record<StockMovementType, string> = {
  IN: "bg-emerald-100 text-emerald-700",
  OUT: "bg-red-100 text-red-700",
  ADJUST: "bg-amber-100 text-amber-700",
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

function formatQuantity(type: StockMovementType, quantity: number) {
  const normalized = type === "OUT" ? -Math.abs(quantity) : quantity
  const sign = normalized > 0 ? "+" : ""
  return `${sign}${normalized}`
}

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

export default function Page() {
  const { data: me } = useMe()
  const role = me?.data?.user?.role
  const canViewHistory = role === "ADMIN" || role === "MANAGER"
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedLowStockProduct, setSelectedLowStockProduct] = useState<{
    id: string
    name: string
    sku: string
  } | null>(null)

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState({
    type: "all" as StockMovementType | "all",
    startDate: "",
    endDate: "",
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)

  const { data, isLoading, isError } = useStockMovements({
    page,
    limit,
    type: appliedFilters.type === "all" ? undefined : appliedFilters.type,
    startDate: appliedFilters.startDate
      ? new Date(appliedFilters.startDate).toISOString()
      : undefined,
    endDate: appliedFilters.endDate
      ? new Date(appliedFilters.endDate).toISOString()
      : undefined,
  })

  const history = (data as StockMovementsResponse)?.data?.stockHistory ?? []
  const meta = (data as StockMovementsResponse)?.data?.meta

  const [lowStockPage, setLowStockPage] = useState(1)
  const [lowStockLimit, setLowStockLimit] = useState(10)
  const [lowStockSearchInput, setLowStockSearchInput] = useState("")
  const [lowStockSearch, setLowStockSearch] = useState("")

  const {
    data: lowStockData,
    isLoading: isLowStockLoading,
    isError: isLowStockError,
  } = useLowStockProducts({
    page: lowStockPage,
    limit: lowStockLimit,
    search: lowStockSearch || undefined,
  })

  const lowStockProducts =
    (lowStockData as LowStockProductsResponse)?.data?.products ?? []
  const lowStockMeta = (lowStockData as LowStockProductsResponse)?.data?.meta

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
    setPage(1)
  }

  const handleClearFilters = () => {
    const cleared = { type: "all" as const, startDate: "", endDate: "" }

    setFilters(cleared)
    setAppliedFilters(cleared)
    setPage(1)
  }

  const handleLowStockSearch = () => {
    setLowStockSearch(lowStockSearchInput.trim())
    setLowStockPage(1)
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Stock Movements
          </h2>
          <p className="text-sm text-muted-foreground">
            Track inventory changes by type, date, and product details.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedLowStockProduct(null)
            setIsCreateModalOpen(true)
          }}
          disabled={!canViewHistory}
        >
          Create Movement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Movement History</CardTitle>
          <CardDescription>
            Filter by movement type or date range and review adjustments.
          </CardDescription>
          <div className="flex flex-wrap items-end justify-end gap-3 pt-2">
            <div className="ml-auto flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="movement-type">Type</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: value as StockMovementType | "all",
                    }))
                  }
                  disabled={!canViewHistory}
                >
                  <SelectTrigger id="movement-type" size="sm" className="w-40">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All types</SelectItem>
                      {typeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="movement-start-date">Start date</Label>
                <Input
                  id="movement-start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  disabled={!canViewHistory}
                  className="w-40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="movement-end-date">End date</Label>
                <Input
                  id="movement-end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  disabled={!canViewHistory}
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleApplyFilters}
                  disabled={!canViewHistory}
                >
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClearFilters}
                  disabled={!canViewHistory}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!canViewHistory ? (
            <p className="text-sm text-muted-foreground">
              You do not have permission to view stock history.
            </p>
          ) : isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              Unable to load stock movements. Please try again.
            </p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No stock movements found.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {formatDateTime(movement.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {movement.product?.name}
                      </TableCell>
                      <TableCell>{movement.product?.sku ?? "-"}</TableCell>
                      <TableCell>
                        {movement.product?.category?.name ?? "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${typeStyles[movement.type]}`}
                        >
                          {movement.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatQuantity(movement.type, movement.quantity)}
                      </TableCell>
                      <TableCell>{movement.note ?? "-"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {movement.orderId ? (
                          <Link
                            href={`/dashboard/orders/${movement.orderId}`}
                            className="text-primary hover:underline"
                          >
                            {movement.orderId}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {canViewHistory && (
            <div className="flex items-center justify-between px-1">
              <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                {meta
                  ? `${meta.totalCount} total movement${meta.totalCount === 1 ? "" : "s"}`
                  : ""}
              </div>
              <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                  <Label
                    htmlFor="stock-rows-per-page"
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
                      id="stock-rows-per-page"
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>⚠️ Low Stock Products</CardTitle>
          <CardDescription>
            Review products that have fallen below their reorder level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex w-full flex-wrap items-center gap-2">
              <Input
                value={lowStockSearchInput}
                onChange={(e) => setLowStockSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleLowStockSearch()
                  }
                }}
                placeholder="Search products..."
                className="w-full max-w-sm"
              />
              <Button variant="outline" onClick={handleLowStockSearch}>
                Search
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setLowStockSearchInput("")
                  setLowStockSearch("")
                  setLowStockPage(1)
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          {isLowStockLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isLowStockError ? (
            <p className="text-sm text-destructive">
              Unable to load low stock products. Please try again.
            </p>
          ) : lowStockProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No low stock products found.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Selling Price</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category?.name ?? "-"}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.sellingPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.reorderLevel}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                            product.currentStock === 0
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {product.currentStock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!canViewHistory}
                          onClick={() => {
                            setSelectedLowStockProduct({
                              id: product.id,
                              name: product.name,
                              sku: product.sku,
                            })
                            setIsCreateModalOpen(true)
                          }}
                        >
                          Add stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {lowStockMeta && (
            <div className="flex items-center justify-between px-1">
              <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                {`${lowStockMeta.totalCount} low stock product${lowStockMeta.totalCount === 1 ? "" : "s"}`}
              </div>
              <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                  <Label
                    htmlFor="low-stock-rows-per-page"
                    className="text-sm font-medium"
                  >
                    Rows per page
                  </Label>
                  <Select
                    value={`${lowStockLimit}`}
                    onValueChange={(value) => {
                      setLowStockLimit(Number(value))
                      setLowStockPage(1)
                    }}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-20"
                      id="low-stock-rows-per-page"
                    >
                      <SelectValue placeholder={lowStockLimit} />
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
                  Page {lowStockMeta.currentPage} of {lowStockMeta.totalPages}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => setLowStockPage(1)}
                    disabled={!lowStockMeta.hasPrevPage}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeftIcon />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() =>
                      setLowStockPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={!lowStockMeta.hasPrevPage}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => setLowStockPage((prev) => prev + 1)}
                    disabled={!lowStockMeta.hasNextPage}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRightIcon />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden size-8 lg:flex"
                    size="icon"
                    onClick={() => setLowStockPage(lowStockMeta.totalPages)}
                    disabled={!lowStockMeta.hasNextPage}
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

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Stock Movement</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <CreateStockMovementForm
              onClose={() => {
                setIsCreateModalOpen(false)
                setSelectedLowStockProduct(null)
              }}
              initialProduct={selectedLowStockProduct}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
