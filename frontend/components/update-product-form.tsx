"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/hooks/categories/useCategories"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct"
import { Loader2 } from "lucide-react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { useEffect } from "react"
import { z } from "zod"

const unitOptions = ["pcs", "kg", "box", "litre"] as const

const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(255, "Product name cannot exceed 255 characters"),
  sku: z
    .string()
    .min(2, "SKU must be at least 2 characters")
    .max(50, "SKU is too long"),
  categoryId: z.string().uuid("Invalid category ID"),
  unit: z.enum(unitOptions),
  costPrice: z
    .string()
    .min(1, "Cost price is required")
    .refine(
      (value) => !Number.isNaN(Number(value)),
      "Cost price must be a valid number",
    )
    .refine((value) => Number(value) >= 0, "Cost price cannot be negative"),
  sellingPrice: z
    .string()
    .min(1, "Selling price is required")
    .refine(
      (value) => !Number.isNaN(Number(value)),
      "Selling price must be a valid number",
    )
    .refine((value) => Number(value) >= 0, "Selling price cannot be negative"),
  reorderLevel: z
    .string()
    .min(1, "Reorder level is required")
    .refine(
      (value) => !Number.isNaN(Number(value)),
      "Reorder level must be a valid number",
    )
    .refine(
      (value) => Number.isInteger(Number(value)),
      "Reorder level must be an integer",
    )
    .refine((value) => Number(value) >= 0, "Reorder level cannot be negative"),
})

type UpdateProductFormData = z.infer<typeof updateProductSchema>

type EditableProduct = {
  id: string
  name: string
  sku: string
  categoryId: string
  unit: string
  costPrice: string
  sellingPrice: string
  reorderLevel: number
}

type UpdateProductFormProps = {
  product: EditableProduct
  onClose: () => void
}

export function UpdateProductForm({
  product,
  onClose,
}: UpdateProductFormProps) {
  const { data: categoriesResp } = useCategories()
  const categories = categoriesResp?.data?.categories ?? []
  const normalizedUnit = unitOptions.includes(
    product.unit as (typeof unitOptions)[number],
  )
    ? (product.unit as (typeof unitOptions)[number])
    : "pcs"

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      unit: normalizedUnit,
      costPrice: String(product.costPrice),
      sellingPrice: String(product.sellingPrice),
      reorderLevel: String(product.reorderLevel),
    },
  })

  const updateMutation = useUpdateProduct()

  const onSubmit: SubmitHandler<UpdateProductFormData> = (data) => {
    const payload = {
      ...data,
      costPrice: Number(data.costPrice),
      sellingPrice: Number(data.sellingPrice),
      reorderLevel: Number(data.reorderLevel),
    }

    updateMutation.mutate({ id: product.id, data: payload })
  }

  useEffect(() => {
    if (updateMutation.status === "success") {
      onClose()
    }
  }, [updateMutation.status, onClose])

  return (
    <form id="form-update-product" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="e.g., A4 Gaming Keyboard"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="sku"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>SKU</FieldLabel>
              <Input
                {...field}
                id="sku"
                placeholder="e.g., PK-132-DKE"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="categoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Category</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map(
                      (cat: {
                        id: string
                        name: string
                        isActive: boolean
                      }) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          disabled={!cat.isActive}
                        >
                          {cat.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="unit"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Unit</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="costPrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Cost Price</FieldLabel>
                <Input
                  {...field}
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="sellingPrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Selling Price</FieldLabel>
                <Input
                  {...field}
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="reorderLevel"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Reorder Level</FieldLabel>
              <Input
                {...field}
                id="reorderLevel"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            form="form-update-product"
            disabled={updateMutation.status === "pending"}
          >
            {updateMutation.status === "pending" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.status === "pending"}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
