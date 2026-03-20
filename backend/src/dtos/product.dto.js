import { z } from "zod"

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(255, "Product name cannot exceed 255 characters"),
  sku: z.string().min(2, "SKU is required").max(50, "SKU is too long"),
  categoryId: z.uuid("Invalid category ID"),
  unit: z
    .string()
    .min(2, "Unit is required")
    .max(15, "Unit name cannot exceed 15 characters"),
  costPrice: z.number().nonnegative("Cost price cannot be negative"),
  sellingPrice: z.number().nonnegative("Selling price cannot be negative"),
  reorderLevel: z
    .number()
    .int("Reorder level must be an integer")
    .nonnegative("Reorder level cannot be negative"),
})

export const productPaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => Math.max(1, parseInt(val || "1"))),
  limit: z
    .string()
    .optional()
    .transform((val) => Math.max(1, parseInt(val || "10"))),
  search: z.string().optional(),
})

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(255, "Product name cannot exceed 255 characters")
    .optional(),
  sku: z
    .string()
    .min(2, "SKU must be at least 2 characters")
    .max(50, "SKU is too long")
    .optional(),
  categoryId: z.uuid("Invalid category ID").optional(),
  unit: z
    .string()
    .min(2, "Unit must be at least 2 characters")
    .max(15, "Unit name cannot exceed 15 characters")
    .optional(),
  costPrice: z.number().nonnegative("Cost price cannot be negative").optional(),
  sellingPrice: z
    .number()
    .nonnegative("Selling price cannot be negative")
    .optional(),
  reorderLevel: z
    .number()
    .int("Reorder level must be an integer")
    .nonnegative("Reorder level cannot be negative")
    .optional(),
})
