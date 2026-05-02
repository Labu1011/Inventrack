import { z } from "zod"

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9]).+$/,
      "Password must contain at least one uppercase and one number",
    ),
  role: z.enum(["ADMIN", "MANAGER"]).optional(),
})

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9]).+$/,
      "Password must contain at least one uppercase and one number",
    ),
})

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER"]),
})
