import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(2, "SKU is required").max(50, "SKU is too long"),
  categoryId: z.uuid("Invalid category ID"),
  unit: z.string().min(2, "Unit is required"),
  costPrice: z.number().nonnegative("Cost price cannot be negative"),
  sellingPrice: z.number().nonnegative("Selling price cannot be negative"),
  reorderLevel: z
    .number()
    .int("Reorder level must be an integer")
    .nonnegative("Reorder level cannot be negative"),
})

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .optional(),
})
