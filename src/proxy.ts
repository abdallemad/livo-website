/**
 * Next 16 Proxy (formerly middleware).
 *
 * 1. clerkMiddleware — makes the Clerk session (cookie, or `Authorization: Bearer` from the mobile
 *    app) available to `auth()` in Route Handlers and /auth-callback. It never forces a page to
 *    render dynamically: pages read no request data (CLAUDE.md §4.1).
 * 2. Locale routing — a URL without /en|/fr|/de is redirected to the visitor's language: the
 *    `livo-lang` cookie (set by the language switch), else Accept-Language, else English.
 *    Clerk's default /sign-in and /sign-up land on the designed /<lang>/auth page.
 *
 * 3. /admin gate (CLAUDE.md §5, layer 1 of 3): no session or not an admin → the site's normal 404
 *    (a rewrite, never 403/redirect, so probers cannot tell the dashboard exists). The admin
 *    layout and every /api/admin route check again (layers 2 and 3).
 */
import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, isLocale, type Locale } from "@/i18n/config"
import { isAdminUser } from "@/services/auth.service"

function preferredLocale(request: NextRequest): Locale {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(fromCookie)) return fromCookie
  const header = request.headers.get("accept-language") ?? ""
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=")
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  return ranked.map((r) => r.lang).find(isLocale) ?? DEFAULT_LOCALE
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const { userId } = await auth()
    const allowed = userId ? await isAdminUser(userId).catch(() => false) : false
    if (allowed) return NextResponse.next()
    // rendered by /<lang>/[...rest] → the localized LIVO 404 page, with a 404 status
    return NextResponse.rewrite(new URL(`/${preferredLocale(request)}/__not-found`, request.url), { status: 404 })
  }

  if (pathname === "/api" || pathname.startsWith("/api/") || pathname.startsWith("/auth-callback")) return NextResponse.next()

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  const url = request.nextUrl.clone()
  const locale = preferredLocale(request)
  if (pathname === "/sign-in" || pathname.startsWith("/sign-in/")) url.pathname = `/${locale}/auth`
  else if (pathname === "/sign-up" || pathname.startsWith("/sign-up/")) url.pathname = `/${locale}/auth/signup`
  else url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
})

export const config = {
  // pages + API routes; skip Next internals, public assets (/img is rewritten to R2) and metadata files
  matcher: ["/((?!_next/|img/|fonts/|favicon\\.ico|icon\\.png|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)", "/api/(.*)"],
}
