/**
 * Errors services throw. API routes turn them into a JSON failure with the matching HTTP status
 * (`lib/api.ts`); anything else is logged on the server and answered with a generic message.
 */
export type ErrorCode = "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "VALIDATION" | "DEPENDENCY" | "TOO_LARGE"

export class AppError extends Error {
  constructor(
    message: string,
    readonly code: ErrorCode,
    readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = new.target.name
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Please sign in first.") {
    super(message, "UNAUTHORIZED")
  }
}
export class ForbiddenError extends AppError {
  constructor(message = "You cannot do that.") {
    super(message, "FORBIDDEN")
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Not found.") {
    super(message, "NOT_FOUND")
  }
}
export class ConflictError extends AppError {
  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message, "CONFLICT", fieldErrors)
  }
}
export class ValidationError extends AppError {
  constructor(message = "Please check the highlighted fields.", fieldErrors?: Record<string, string[]>) {
    super(message, "VALIDATION", fieldErrors)
  }
}
export class DependencyError extends AppError {
  constructor(message: string) {
    super(message, "DEPENDENCY")
  }
}
export class TooLargeError extends AppError {
  constructor(message = "That file is too large.", fieldErrors?: Record<string, string[]>) {
    super(message, "TOO_LARGE", fieldErrors)
  }
}

export const isAppError = (e: unknown): e is AppError => e instanceof AppError

export const HTTP_STATUS: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION: 422,
  DEPENDENCY: 409,
  TOO_LARGE: 413,
}
