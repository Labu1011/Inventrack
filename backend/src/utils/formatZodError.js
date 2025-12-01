import { ZodError, z } from "zod"

export function formatZodError(error) {
  if (!(error instanceof ZodError)) return null

  const formattedErrors = z.flattenError(error)

  return {
    message: "Validation Failed",
    errors: formattedErrors.fieldErrors,
  }
}
