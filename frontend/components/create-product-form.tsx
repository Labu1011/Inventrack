"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, useForm, type FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateProduct } from "@/hooks/products/useCreateProduct"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/hooks/categories/useCategories"

const unitOptions = ["pcs", "kg", "box", "litre"] as const

// Zod schema for product creation (matching backend DTO)
const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(255, "Product name cannot exceed 255 characters"),
  sku: z.string().min(2, "SKU is required").max(50, "SKU is too long"),
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
      (value) => Number.isInteger(Number(value)),
      "Reorder level must be an integer",
    )
    .refine((value) => Number(value) >= 0, "Reorder level cannot be negative"),
})

type CreateProductFormData = z.infer<typeof createProductSchema>

type CreateProductFormProps = {
  onClose: () => void
}

export function CreateProductForm({ onClose }: CreateProductFormProps) {
  const { data: categoriesResp } = useCategories()
  const categories = categoriesResp?.data?.categories ?? []

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      unit: "pcs",
      costPrice: "0",
      sellingPrice: "0",
      reorderLevel: "0",
    },
  })

  const createMutation = useCreateProduct()

  function onSubmit(data: CreateProductFormData) {
    const payload = {
      ...data,
      costPrice: Number(data.costPrice),
      sellingPrice: Number(data.sellingPrice),
      reorderLevel: Number(data.reorderLevel),
    }
    createMutation.mutate(payload)
  }

  useEffect(() => {
    if (createMutation.status === "success") {
      form.reset()
      onClose()
    }
  }, [createMutation.status, form, onClose])

  return (
    <form
      id="form-create-product"
      onSubmit={form.handleSubmit(onSubmit as any)}
    >
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
            form="form-create-product"
            disabled={createMutation.status === "pending"}
          >
            {createMutation.status === "pending" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createMutation.status === "pending"}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
