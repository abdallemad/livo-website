/**
 * Locales — the site is trilingual (EN default, FR, DE), exactly like the design prototype.
 *
 * Routing is by path prefix (/en, /fr, /de). Every page is prerendered once per locale, so a
 * visitor never downloads translations they do not need and crawlers get each language as real
 * HTML. src/proxy.ts sends un-prefixed URLs to the visitor's language (cookie → Accept-Language).
 */
export const LOCALES = ["en", "fr", "de"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

/** Remembers the language the visitor picked in the switcher (read by src/proxy.ts). */
export const LOCALE_COOKIE = "livo-lang"

export const LOCALE_LABELS: Record<Locale, string> = { en: "EN", fr: "FR", de: "DE" }

/** BCP 47 tags for Intl formatting and <html lang>. */
export const LOCALE_TAGS: Record<Locale, string> = { en: "en", fr: "fr", de: "de" }

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

/** A value in every language; a missing translation falls back to English. */
export interface Localized<T = string> {
  en: T
  fr?: T
  de?: T
}
