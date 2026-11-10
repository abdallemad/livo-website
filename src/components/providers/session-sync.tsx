"use client"

/**
 * Keeps the page in step with the Clerk session, renders nothing:
 * - `html.authed` (CSS switches the header's "Log in" / avatar) + the `livo-authed` hint the
 *   boot script reads before paint on the next visit;
 * - after a sign-up, sends the extras the form collected (account type, phone, address and, for a
 *   professional, the provider request with its documents — see lib/pending-signup.ts).
 */
import { useAuth } from "@clerk/nextjs"
import { useEffect, useRef } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { useAccountActions } from "@/hooks/use-session"
import { apiFetch } from "@/lib/api-client"
import { AUTHED_HINT, prefs } from "@/lib/browser-storage"
import { takePendingSignup } from "@/lib/pending-signup"

const PROFILE_FIELDS = ["phone", "address_building", "address_street", "address_postcode", "city", "contact"]

export function SessionSync() {
  const { isLoaded, isSignedIn } = useAuth()
  const { lang } = useLang()
  const { refreshProfile } = useAccountActions()
  const flushing = useRef(false)

  useEffect(() => {
    if (!isLoaded) return
    document.documentElement.classList.toggle("authed", !!isSignedIn)
    if (isSignedIn) prefs.set(AUTHED_HINT, "1")
    else prefs.del(AUTHED_HINT)
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    if (!isSignedIn || flushing.current) return
    flushing.current = true
    ;(async () => {
      const pending = await takePendingSignup()
      if (!pending) return
      const f = pending.fields
      const pro = f.role === "pro"
      const profile: Record<string, unknown> = { locale: lang, role: pro ? "pro" : "customer" }
      for (const k of PROFILE_FIELDS) if (typeof f[k] === "string" && f[k]) profile[k] = f[k]
      // the name fields are Clerk's on the sign-up form (firstName / lastName)
      const first = typeof f.firstName === "string" ? f.firstName : ""
      const last = typeof f.lastName === "string" ? f.lastName : ""
      if (first) profile.first = first
      if (last) profile.last = last
      try {
        await apiFetch("/api/me", { method: "PATCH", json: profile })
        if (pro) {
          const fd = new FormData()
          for (const [k, v] of Object.entries(f)) for (const one of ([] as string[]).concat(v)) fd.append(k, one)
          fd.set("locale", lang)
          fd.set("first", first)
          fd.set("last", last)
          for (const [k, file] of pending.files) fd.append(k, file)
          await apiFetch("/api/provider-requests", { method: "POST", body: fd })
        }
      } catch (e) {
        console.warn("[signup] extras not saved", e)
      }
      await refreshProfile()
    })()
  }, [isSignedIn, lang, refreshProfile])

  return null
}
