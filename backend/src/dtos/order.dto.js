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

export const updateOrderStatusSchema = z.object({
  id: z.uuid("Invalid order ID."),
  status: z.enum(["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
})

export const orderHistoryQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).default(10),
    status: z
      .enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"])
      .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && Number.isNaN(Date.parse(data.startDate))) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Invalid start date.",
      })
    }

    if (data.endDate && Number.isNaN(Date.parse(data.endDate))) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Invalid end date.",
      })
    }

    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) > new Date(data.endDate)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date must be earlier than or equal to end date.",
      })
    }
  })
