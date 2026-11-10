/**
 * Focused shell for task pages reached from a link (today: /review): logo + language only,
 * slim footer, no mascot. Static like the storefront shell.
 */
import { isLocale } from "@/i18n/config"
import { AnimatedBackground } from "@/components/layout/AnimatedBackground"
import { MinimalHeader } from "@/components/layout/SiteHeader"
import { MinimalFooter } from "@/components/layout/SiteFooter"
import { SiteOverlays } from "@/components/layout/SiteOverlays"

export const revalidate = 3600

export default async function FocusLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang: raw } = await params
  const lang = isLocale(raw) ? raw : "en"
  return (
    <>
      <AnimatedBackground />
      <MinimalHeader />
      <main id="top">{children}</main>
      <MinimalFooter lang={lang} />
      <SiteOverlays lang={lang} mascot={false} />
    </>
  )
}
