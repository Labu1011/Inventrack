"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useCreateStockMovement } from "@/hooks/stock/useCreateStockMovement"
import { useProducts } from "@/hooks/products/useProducts"
import type { StockMovementType } from "@/lib/api/stockMovements.api"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const createStockMovementSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  type: z.enum(["IN", "OUT", "ADJUST"]),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (value) => Number.isInteger(Number(value)),
      "Quantity must be an integer",
    ),
  note: z.string().optional(),
})

type CreateStockMovementFormData = z.infer<typeof createStockMovementSchema>

type CreateStockMovementFormProps = {
  onClose: () => void
}

const typeOptions: StockMovementType[] = ["IN", "OUT", "ADJUST"]

export function CreateStockMovementForm({
  onClose,
}: CreateStockMovementFormProps) {
  const [productSearchInput, setProductSearchInput] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const form = useForm<CreateStockMovementFormData>({
    resolver: zodResolver(createStockMovementSchema),
    defaultValues: {
      productId: "",
      type: "IN",
      quantity: "1",
      note: "",
    },
  })

  const createMutation = useCreateStockMovement()
  const { data: productsResp, isLoading: isProductsLoading } = useProducts({
    page: 1,
    limit: 50,
    search: productSearch,
    status: "active",
  })

  const products = productsResp?.data?.products ?? []

  function onSubmit(data: CreateStockMovementFormData) {
    const payload = {
      productId: data.productId,
      type: data.type,
      quantity: Number(data.quantity),
      note: data.note?.trim() || undefined,
    }

    createMutation.mutate(payload)
  }

  useEffect(() => {
    if (createMutation.status === "success") {
      form.reset()
      onClose()
    }
  }, [createMutation.status, form, onClose])

  const handleProductSearch = () => {
    setProductSearch(productSearchInput.trim())
  }

  return (
    <form
      id="form-create-stock-movement"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="productId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Product</FieldLabel>
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <Input
                  value={productSearchInput}
                  onChange={(event) =>
                    setProductSearchInput(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      handleProductSearch()
                    }
                  }}
                  placeholder="Search products..."
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleProductSearch}
                  >
                    Search
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setProductSearchInput("")
                      setProductSearch("")
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-background">
                {isProductsLoading ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Loading products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No products found
                  </div>
                ) : (
                  <div className="max-h-52 overflow-y-auto">
                    {products.map(
                      (product: { id: string; name: string; sku: string }) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => field.onChange(product.id)}
                          className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                            field.value === product.id
                              ? "bg-muted"
                              : "bg-transparent"
                          }`}
                        >
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {product.sku}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {typeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="quantity"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
              <Input
                {...field}
                id="quantity"
                type="number"
                step="1"
                placeholder="0"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="note"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Note</FieldLabel>
              <Input
                {...field}
                id="note"
                placeholder="Optional note"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={createMutation.status === "pending"}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.status === "pending"}>
            {createMutation.status === "pending" ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
