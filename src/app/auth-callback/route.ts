/**
 * GET /auth-callback — where Clerk sends the browser after every sign-in and sign-up
 * (NEXT_PUBLIC_CLERK_SIGN_*_FALLBACK_REDIRECT_URL, and the ClerkProvider props per locale).
 *
 * Creates or completes the database row for the Clerk user (`syncUserWithDatabase`: race-safe,
 * never merges by email, claims guest bookings made with the verified email), then
 * sends the visitor on. A Route Handler, not a page: it renders nothing and stays dynamic,
 * while every page remains static. The mobile app calls POST /api/auth/sync instead.
 *
 * `?next=/fr/account` picks the destination — same-origin paths only (no open redirect).
 */
import { auth } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/i18n/config"
import { syncUserWithDatabase } from "@/services/auth.service"

function safeNext(raw: string | null, locale: Locale): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") && !raw.startsWith("/auth-callback")) return raw
  return `/${locale}`
}

export async function GET(request: NextRequest) {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value
  const next = request.nextUrl.searchParams.get("next")
  const nextLocale = next?.split("/")[1]
  const locale: Locale = isLocale(nextLocale) ? nextLocale : isLocale(fromCookie) ? fromCookie : DEFAULT_LOCALE

  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(new URL(`/${locale}/auth`, request.url))

  try {
    await syncUserWithDatabase(userId, locale)
  } catch (e) {
    // the session is valid; the profile page retries the sync through /api/me
    console.error("[auth-callback] sync failed", e)
  }
  return NextResponse.redirect(new URL(safeNext(next, locale), request.url))
}
