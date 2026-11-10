/**
 * Root layout (one per locale: /en, /fr, /de — all prerendered).
 *
 * Reads nothing from the request (CLAUDE.md §4.1): the locale comes from the static route param.
 * <ClerkProvider> is static (never the `dynamic` prop); the session is read in the browser.
 * Per-visitor state (signed in, slow-device "lite" mode) is applied by a tiny inline script before
 * first paint, so cached HTML never flashes the wrong state.
 */
import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { preload } from "react-dom"
import { ClerkProvider } from "@clerk/nextjs"
import "../globals.css"
import { LOCALES, isLocale } from "@/i18n/config"
import { pick } from "@/i18n/translate"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, THEME_COLOR } from "@/constants/site"
import { getSiteUrl } from "@/lib/site-url"
import { LangProvider } from "@/components/providers/lang-provider"
import { ChatProvider } from "@/components/providers/chat-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { SessionSync } from "@/components/providers/session-sync"
import { PageEffects } from "@/components/layout/PageEffects"
import { InlineScript } from "@/components/shared/InlineScript"

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : "en"
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: `${SITE_NAME} – ${pick(locale, SITE_TAGLINE)}`, template: `%s – ${SITE_NAME}` },
    description: pick(locale, SITE_DESCRIPTION),
    applicationName: SITE_NAME,
    openGraph: { siteName: SITE_NAME, type: "website", locale, images: ["/img/hero-team.jpg"] },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLOR,
  colorScheme: "light",
}

// same as the prototype's <head> script: slow device → html.lite; signed in last time → html.authed
// (SessionSync corrects it as soon as Clerk answers)
const BOOT = `try{var d=document.documentElement;if(localStorage.getItem("livo-lite")==="1"||(navigator.connection&&navigator.connection.saveData))d.classList.add("lite");if(localStorage.getItem("livo-authed"))d.classList.add("authed")}catch(e){}`

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  // the two latin faces above the fold (React dedupes these into <head>)
  preload("/fonts/sora-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  preload("/fonts/dm-sans-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  return (
    // data-scroll-behavior: livo.css sets smooth scrolling; Next turns it off during route changes
    <html lang={lang} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <InlineScript html={BOOT} />
      </head>
      <body>
        <ClerkProvider
          signInUrl={`/${lang}/auth`}
          signUpUrl={`/${lang}/auth/signup`}
          signInFallbackRedirectUrl={`/auth-callback?next=/${lang}`}
          signUpFallbackRedirectUrl={`/auth-callback?next=/${lang}`}
          afterSignOutUrl={`/${lang}`}
        >
          <QueryProvider>
            <LangProvider lang={lang}>
              <ChatProvider>
                {children}
                <PageEffects />
                <SessionSync />
              </ChatProvider>
            </LangProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
