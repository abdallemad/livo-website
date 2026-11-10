/**
 * robots.txt. Private pages use `noindex` meta instead of Disallow (a disallowed URL can still be
 * indexed from links) — CLAUDE.md §11. /api/ is reserved for the mobile-app backend.
 */
import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site-url"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: ["/", "/img/"], disallow: ["/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
