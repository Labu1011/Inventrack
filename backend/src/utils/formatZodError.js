import { ZodError, z } from "zod"

export function formatZodError(error) {
  if (!(error instanceof ZodError)) return null

  const formattedErrors = z.flattenError(error)

  return {
    status: "error",
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    errors: formattedErrors.fieldErrors,
  }
}
