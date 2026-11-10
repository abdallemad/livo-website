/**
 * Pure metadata builders (no DB, relative URLs only — metadataBase makes them absolute).
 * Every page exists in EN/FR/DE, so each one declares its canonical + hreflang alternates.
 */
import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/i18n/config"
import { localePath } from "@/i18n/translate"

export function localeAlternates(lang: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(lang, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])),
      "x-default": localePath("en", path),
    },
  }
}

export function pageMetadata(
  lang: Locale,
  path: string,
  { title, description, noindex = false }: { title: string; description?: string; noindex?: boolean },
): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: noindex ? undefined : localeAlternates(lang, path),
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: { title, description, type: "website", locale: lang, siteName: "LIVO" },
  }
}
