import { ApiError } from "../utils/apiError.js"
import { formatZodError } from "../utils/formatZodError.js"

export function errorHandler(err, req, res, next) {
  const zodError = formatZodError(err)

  if (zodError) {
    return res.status(400).json(zodError)
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: "error",
      code: err.code,
      message: err.message,
    })
  }

  console.error(err)

  return res.status(500).json({
    status: "error",
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  })
}
