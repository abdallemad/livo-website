/**
 * Full storefront shell: animated background, header + drawer, footer, floating actions.
 * No request-time APIs here (CLAUDE.md §4.1) — every page below stays static.
 */
import { isLocale } from "@/i18n/config"
import { AnimatedBackground } from "@/components/layout/AnimatedBackground"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteOverlays } from "@/components/layout/SiteOverlays"

export const revalidate = 3600

export default async function MarketingLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang: raw } = await params
  const lang = isLocale(raw) ? raw : "en"
  return (
    <>
      <AnimatedBackground />
      <SiteHeader />
      <main id="top">{children}</main>
      <SiteFooter lang={lang} />
      <SiteOverlays lang={lang} />
    </>
  )
}
