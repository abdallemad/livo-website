/** Pure formatting helpers for the admin dashboard (times shown in Luxembourg time). */
const TZ = "Europe/Luxembourg"

export const formatDate = (d: Date | string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: TZ }).format(new Date(d))
export const formatDateTime = (d: Date | string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: TZ }).format(new Date(d))

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

/** "IN_REVIEW" → "In review" */
export const humanize = (v: string) => v.charAt(0) + v.slice(1).toLowerCase().replaceAll("_", " ")

/** ?page=… → a page number ≥ 1 */
export function parsePage(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isInteger(n) && n > 0 ? Math.min(n, 10_000) : 1
}

export const one = (raw: string | string[] | undefined) => (Array.isArray(raw) ? raw[0] : raw)?.trim() || undefined

/** Build an admin list URL keeping the other filters; empty values drop out, page 1 is implicit. */
export function listHref(base: string, params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "" && !(k === "page" && Number(v) === 1)) q.set(k, String(v))
  const s = q.toString()
  return s ? `${base}?${s}` : base
}
