import { z } from "zod"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const forgotPasswordSchema = z.object({
  email: z.email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9]).+$/,
      "Password must contain at least one uppercase and one number",
    ),
})
