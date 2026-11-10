/**
 * Route Handler plumbing (the API layer that replaces Server Actions — docs/backend.md).
 *
 * Every handler is wrapped by `route()`: it runs the handler, answers `{ success: true, data }`,
 * maps an `AppError` to its HTTP status, and logs anything else server-side, answering a generic
 * 500 so internals never reach the client. Handlers follow CLAUDE.md's order:
 * authorise → validate → delegate to a service.
 */
import "server-only"
import { NextResponse } from "next/server"
import type { z } from "zod"
import { HTTP_STATUS, ValidationError, isAppError } from "@/lib/errors"
import { apiFailure, apiSuccess } from "@/types/api"

type Handler<C> = (request: Request, context: C) => Promise<unknown>

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(apiSuccess(data), init)
}

export function route<C = unknown>(label: string, handler: Handler<C>) {
  return async (request: Request, context: C) => {
    try {
      // a browser sending cookies from another site is refused; native apps send no Origin
      if (request.method !== "GET" && request.method !== "HEAD") {
        const origin = request.headers.get("origin")
        if (origin && new URL(origin).host !== new URL(request.url).host && origin !== process.env.NEXT_PUBLIC_SERVER_URL) {
          return NextResponse.json(apiFailure("Cross-site request refused.", undefined, "FORBIDDEN"), { status: 403 })
        }
      }
      const result = await handler(request, context)
      return result instanceof Response ? result : json(result)
    } catch (e) {
      if (isAppError(e)) return NextResponse.json(apiFailure(e.message, e.fieldErrors, e.code), { status: HTTP_STATUS[e.code] })
      console.error(`[api] ${label}`, e) // the real cause stays on the server
      return NextResponse.json(apiFailure("Something went wrong. Please try again."), { status: 500 })
    }
  }
}

/** Parse with a Zod schema or throw a ValidationError carrying the field errors. */
export function parse<S extends z.ZodType>(schema: S, input: unknown): z.infer<S> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_"
      ;(fieldErrors[key] ??= []).push(issue.message)
    }
    throw new ValidationError("Please check the highlighted fields.", fieldErrors)
  }
  return parsed.data
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new ValidationError("The request body must be JSON.")
  }
}

/**
 * Read a multipart body into plain fields + files. Repeated names become arrays (checkbox
 * groups like `langs`, `tags`); empty file inputs are dropped.
 */
export async function readMultipart(request: Request): Promise<{ fields: Record<string, string | string[]>; files: Map<string, File[]> }> {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    throw new ValidationError("The request body must be multipart/form-data.")
  }
  const fields: Record<string, string | string[]> = {}
  const files = new Map<string, File[]>()
  form.forEach((value, key) => {
    if (typeof value === "string") {
      const prev = fields[key]
      fields[key] = prev === undefined ? value : ([] as string[]).concat(prev, value)
    } else if (value.size > 0) {
      files.set(key, [...(files.get(key) ?? []), value])
    }
  })
  return { fields, files }
}

/** Either body type: JSON (mobile app) or multipart (web forms with files). */
export async function readBody(request: Request) {
  const type = request.headers.get("content-type") ?? ""
  if (type.includes("multipart/form-data")) return readMultipart(request)
  return { fields: (await readJson(request)) as Record<string, unknown>, files: new Map<string, File[]>() }
}
