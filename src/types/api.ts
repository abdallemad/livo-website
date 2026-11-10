/**
 * The JSON envelope every `/api/*` route answers with (web and mobile app alike) — the same
 * `ActionResult` shape CLAUDE.md §2.1 defines for Server Actions, since this project uses Route
 * Handlers instead. Never a raw error.
 */
export interface ApiSuccess<T> {
  success: true
  data: T
}
export interface ApiFailure {
  success: false
  error: string
  code?: string
  fieldErrors?: Record<string, string[]>
}
export type ApiResult<T> = ApiSuccess<T> | ApiFailure

export const apiSuccess = <T,>(data: T): ApiSuccess<T> => ({ success: true, data })
export const apiFailure = (error: string, fieldErrors?: Record<string, string[]>, code?: string): ApiFailure => ({
  success: false,
  error,
  ...(code ? { code } : {}),
  ...(fieldErrors ? { fieldErrors } : {}),
})
