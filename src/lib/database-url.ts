/**
 * Runtime database URL with the pool settings from CLAUDE.md §6 applied.
 *
 * DATABASE_URL is Neon's pooled (PgBouncer, transaction mode) endpoint. Prisma needs
 * `pgbouncer=true` there (no named prepared statements), and a small explicit pool so a build
 * prerendering in parallel or a burst of API calls never exhausts connections
 * (`connection_limit=5`, `pool_timeout=30`; a missing or 1 limit causes P2024 timeouts).
 * Values already present in the URL win.
 */
export function getDatabaseUrl(raw = process.env.DATABASE_URL): string {
  if (!raw) throw new Error("DATABASE_URL is not set")
  const url = new URL(raw)
  const set = (k: string, v: string) => {
    if (!url.searchParams.has(k)) url.searchParams.set(k, v)
  }
  if (url.hostname.includes("-pooler")) set("pgbouncer", "true")
  set("connection_limit", "5")
  set("pool_timeout", "30")
  return url.toString()
}
