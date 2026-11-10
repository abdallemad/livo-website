"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import type { Locale, Localized } from "@/i18n/config"
import { localePath, pick, translator, type Translate } from "@/i18n/translate"

interface LangContextValue {
  lang: Locale
  /** t("English", "Français", "Deutsch") */
  t: Translate
  /** locale-prefixed path: l("/services#plumbing") */
  l: (path: string) => string
  pick: <T>(value: Localized<T>) => T
}

const LangContext = createContext<LangContextValue | null>(null)

/** The locale comes from the [lang] route segment; client islands read it from here. */
export function LangProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      t: translator(lang),
      l: (path: string) => localePath(lang, path),
      pick: <T,>(v: Localized<T>) => pick(lang, v),
    }),
    [lang],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>")
  return ctx
}
