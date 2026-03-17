class ApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.status = status
    this.code = code
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED")
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN")
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND")
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message, 400, "BAD_REQUEST")
  }
}

class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, 409, "CONFLICT")
  }
}

export {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
  ConflictError,
}
