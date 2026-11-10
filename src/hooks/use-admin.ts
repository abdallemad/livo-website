"use client"

/**
 * Admin writes from the dashboard (CLAUDE.md §2 hook layer): one TanStack `useMutation` that
 * calls an /api/admin route, unwraps the envelope (`apiFetch` throws an `ApiError`), toasts the
 * result and re-renders the Server Component page with fresh data (`router.refresh()`).
 */
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { ApiError, apiFetch } from "@/lib/api-client"

export interface AdminCall {
  path: string
  method: "POST" | "PATCH" | "DELETE"
  body?: unknown
  /** toast on success */
  success?: string
}

export function adminErrorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 0) return "No connection. Please try again."
    const field = e.fieldErrors ? Object.values(e.fieldErrors).flat()[0] : undefined
    return field ?? (e.status < 500 ? e.message : "Something went wrong. Please try again.")
  }
  return "Something went wrong. Please try again."
}

export function useAdminAction() {
  const router = useRouter()
  const [refreshing, startTransition] = useTransition()
  const mutation = useMutation({
    mutationFn: ({ path, method, body }: AdminCall) => apiFetch<unknown>(path, body === undefined ? { method } : { method, json: body }),
    onSuccess: (_data, call) => {
      if (call.success) toast.success(call.success)
      startTransition(() => router.refresh())
    },
    onError: (e) => toast.error(adminErrorMessage(e)),
  })
  return {
    /** resolves with the data, or rejects (the error is already toasted) */
    run: mutation.mutateAsync,
    pending: mutation.isPending || refreshing,
  }
}
