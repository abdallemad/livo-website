/** Locale helpers for Server Components (pages receive `params` as a Promise in Next 16). */
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config"
import { localePath, translator, type Translate } from "./translate"

export interface PageLocale {
  lang: Locale
  t: Translate
  /** locale-prefixed path */
  l: (path: string) => string
}

export async function resolvePage(params: Promise<{ lang: string }>): Promise<PageLocale> {
  const { lang: raw } = await params
  const lang = isLocale(raw) ? raw : DEFAULT_LOCALE // the root layout already 404s unknown locales
  return { lang, t: translator(lang), l: (p: string) => localePath(lang, p) }
}
