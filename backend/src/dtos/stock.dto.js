import { z } from "zod"

export const createStockMovementSchema = z.object({
  productId: z.uuid("Invalid product ID."),
  type: z.enum(["IN", "OUT", "ADJUST"]),
  quantity: z.int("Quantity must be an integer."),
  note: z.string().optional(),
})
