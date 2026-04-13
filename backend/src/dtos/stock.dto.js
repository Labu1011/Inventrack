import { z } from "zod"

export const createStockMovementSchema = z.object({
  productId: z.uuid("Invalid product ID."),
  type: z.enum(["IN", "OUT", "ADJUST"]),
  quantity: z.int("Quantity must be an integer."),
  note: z.string().optional(),
})

// page, limit, type, productId, startDate, endDate
export const getAllStockMovementsSchema = z
  .object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    productId: z.string().optional(),
    type: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(["IN", "OUT", "ADJUST"]).optional(),
    ),
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
