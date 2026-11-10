/**
 * sitemap.xml — every public page in EN/FR/DE with hreflang alternates (CLAUDE.md §11).
 * Private/noindex pages (/auth, /account, /review) are left out.
 * Backend phase: add DB-driven pages here (with real lastModified) via a sitemap service.
 */
import type { MetadataRoute } from "next"
import { LOCALES } from "@/i18n/config"
import { localePath } from "@/i18n/translate"
import { absoluteUrl } from "@/lib/site-url"

export const revalidate = 3600

const PUBLIC_PATHS = ["/", "/services", "/about", "/join", "/contact", "/faq", "/privacy", "/terms", "/refund"]

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: absoluteUrl(localePath(lang, path)),
      changeFrequency: path === "/" || path === "/services" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/services" ? 0.9 : 0.6,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(localePath(l, path))])) },
    })),
  )
}
