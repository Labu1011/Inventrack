import { z } from "zod"

export const orderItemSchema = z.object({
  productId: z.uuid("Invalid product ID."),
  quantity: z
    .int("Quantity must be an integer.")
    .positive("Quantity must be greater than zero."),
})

export const placeOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item."),
})

export const cancelOrderSchema = z.object({
  id: z.uuid("Invalid order ID."),
})
