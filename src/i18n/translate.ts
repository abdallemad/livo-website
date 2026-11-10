/**
 * Pure translation helpers shared by Server and Client Components.
 *
 * The design keeps every string next to its translations (`data-fr` / `data-de` in the
 * prototype), so pages call `t("English", "Français", "Deutsch")` inline instead of looking up
 * dictionary keys. That keeps copy reviewable in one place per page and makes a missing
 * translation fall back to English, the same rule as the prototype.
 */
import { LOCALE_COOKIE, type Locale, type Localized } from "./config"

export type Translate = (en: string, fr?: string, de?: string) => string

export function translator(lang: Locale): Translate {
  return (en, fr, de) => (lang === "fr" ? fr : lang === "de" ? de : en) ?? en
}

export function pick<T>(lang: Locale, value: Localized<T>): T {
  return value[lang] ?? value.en
}

/**
 * Prefix an app path with the locale: "/" → "/fr", "/services#plumbing" → "/fr/services#plumbing",
 * "/#how" → "/fr#how". External URLs and pure hashes are returned unchanged.
 */
export function localePath(lang: Locale, path: string): string {
  if (!path.startsWith("/")) return path
  const cut = path.search(/[?#]/)
  const base = cut === -1 ? path : path.slice(0, cut)
  const rest = cut === -1 ? "" : path.slice(cut)
  return `/${lang}${base === "/" ? "" : base}${rest}`
}

/** Swap the locale segment of a pathname ("/fr/about" → "/de/about"). */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/")
  parts[1] = to
  return parts.join("/") || `/${to}`
}

/** Remember the visitor's language choice for src/proxy.ts (browser only). */
export function rememberLocale(lang: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${lang};path=/;max-age=31536000;samesite=lax`
}
