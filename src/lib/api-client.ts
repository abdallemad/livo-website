/**
 * Browser side of the `/api` envelope: `apiFetch` unwraps `{ success, data }` and throws an
 * `ApiError` (with the field errors) on failure, so hooks and forms can use plain try/catch.
 */
import type { ApiResult } from "@/types/api"

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors?: Record<string, string[]>,
    readonly code?: string,
  ) {
    super(message)
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {}
  let res: Response
  try {
    res = await fetch(path, {
      ...rest,
      credentials: "same-origin",
      headers: json !== undefined ? { "Content-Type": "application/json", ...rest.headers } : rest.headers,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    })
  } catch {
    throw new ApiError("network", 0)
  }
  let body: ApiResult<T> | null = null
  try {
    body = (await res.json()) as ApiResult<T>
  } catch {
    /* not JSON */
  }
  if (!body) throw new ApiError(`HTTP ${res.status}`, res.status)
  if (!body.success) throw new ApiError(body.error, res.status, body.fieldErrors, body.code)
  return body.data
}

/** FormData from a form, without the inputs listed in `skip`. Empty file inputs are dropped. */
export function formBody(form: HTMLFormElement, extra?: Record<string, string>, skip: string[] = []): FormData {
  const fd = new FormData()
  new FormData(form).forEach((v, k) => {
    if (skip.includes(k)) return
    if (typeof v !== "string" && !v.size) return
    fd.append(k, v)
  })
  for (const [k, v] of Object.entries(extra ?? {})) fd.set(k, v)
  return fd
}
