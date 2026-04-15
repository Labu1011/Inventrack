import { z } from "zod"

export const salesTrendSchema = z.object({
  groupBy: z.enum(["day", "month"]).default("day"),
})
