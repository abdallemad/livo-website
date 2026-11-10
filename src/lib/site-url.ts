/**
 * Public origin of the site. Production MUST set NEXT_PUBLIC_SERVER_URL, otherwise canonicals,
 * hreflang links and the sitemap point at localhost (CLAUDE.md §11).
 */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000").trim().replace(/\/+$/, "")
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`
}
