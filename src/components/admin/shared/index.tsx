/**
 * Building blocks shared by every admin page (Server Components — no client JS).
 * Lists are plain links and GET forms: filters, search and pages live in the URL.
 */
import Link from "next/link"
import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { humanize, listHref } from "@/utils/admin-format"

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({ label, value, hint, href, tone }: { label: string; value: ReactNode; hint?: string; href?: string; tone?: "attention" }) {
  const card = (
    <Card className={cn("h-full transition-colors", href && "hover:border-primary/40", tone === "attention" && "border-primary/40 bg-primary/5")}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint && <CardContent className="-mt-2 text-xs text-muted-foreground">{hint}</CardContent>}
    </Card>
  )
  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  )
}

/** Colour per status value, across all the status enums of the schema. */
const TONE: Record<string, string> = {
  RECEIVED: "bg-sky-100 text-sky-800",
  MATCHED: "bg-violet-100 text-violet-800",
  SCHEDULED: "bg-indigo-100 text-indigo-800",
  DONE: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-zinc-200 text-zinc-700",
  IN_REVIEW: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  CUSTOMER: "bg-zinc-100 text-zinc-800",
  PRO: "bg-violet-100 text-violet-800",
  ADMIN: "bg-rose-100 text-rose-800",
  GENERAL: "bg-zinc-100 text-zinc-800",
  INQUIRY: "bg-sky-100 text-sky-800",
  COMPLAINT: "bg-rose-100 text-rose-800",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  HIDDEN: "bg-zinc-200 text-zinc-700",
  PENDING: "bg-amber-100 text-amber-800",
  OPEN: "bg-amber-100 text-amber-800",
  HANDLED: "bg-emerald-100 text-emerald-800",
}

export function StatusBadge({ value, label }: { value: string; label?: string }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", TONE[value])}>
      {label ?? humanize(value)}
    </Badge>
  )
}

export function ActiveBadge({ active }: { active: boolean }) {
  return <StatusBadge value={active ? "ACTIVE" : "HIDDEN"} />
}

/**
 * Filter chips + search box. `filters` are values of the `status` query param
 * (status, role, kind… — each list decides what it means).
 */
export function ListToolbar({
  base,
  filters,
  current,
  q,
  counts,
  searchPlaceholder = "Search…",
}: {
  base: string
  filters?: { value: string; label?: string }[]
  current?: string
  q?: string
  counts?: Partial<Record<string, number>>
  searchPlaceholder?: string
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      {filters ? (
        <nav className="flex flex-wrap gap-1.5" aria-label="Filter">
          {[{ value: "", label: "All" }, ...filters].map((f) => {
            const on = (current ?? "") === f.value
            const n = f.value ? counts?.[f.value] : undefined
            return (
              <Link
                key={f.value || "all"}
                href={listHref(base, { status: f.value || undefined, q })}
                className={cn("rounded-full border px-3 py-1 text-sm transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}
                aria-current={on ? "page" : undefined}
              >
                {f.label ?? humanize(f.value)}
                {n !== undefined && <span className={cn("ml-1.5 tabular-nums", on ? "opacity-80" : "text-muted-foreground")}>{n}</span>}
              </Link>
            )
          })}
        </nav>
      ) : (
        <span />
      )}
      <form action={base} className="relative w-full sm:w-72">
        {current && <input type="hidden" name="status" value={current} />}
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={q} placeholder={searchPlaceholder} className="pl-8" aria-label="Search" />
      </form>
    </div>
  )
}

export function Pagination({ base, page, pageCount, total, params }: { base: string; page: number; pageCount: number; total: number; params: Record<string, string | undefined> }) {
  if (total === 0) return null
  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        {total} result{total === 1 ? "" : "s"} · page {page} of {pageCount}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} render={page > 1 ? <Link href={listHref(base, { ...params, page: page - 1 })} /> : undefined}>
          <ChevronLeft /> Previous
        </Button>
        <Button variant="outline" size="sm" disabled={page >= pageCount} render={page < pageCount ? <Link href={listHref(base, { ...params, page: page + 1 })} /> : undefined}>
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export function EmptyState({ title = "Nothing here yet", children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
      <Inbox className="size-8 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {children && <p className="max-w-sm text-sm text-muted-foreground">{children}</p>}
    </div>
  )
}

/** A label/value grid for detail pages. */
export function DetailList({ rows }: { rows: [label: string, value: ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-sm break-words">{value || <span className="text-muted-foreground">—</span>}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Private stored file → opened through the admin-only route. */
export function FileLink({ id, name, hint }: { id: string; name: string; hint?: string }) {
  return (
    <a href={`/api/admin/files/${id}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
      {name}
      {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
    </a>
  )
}
