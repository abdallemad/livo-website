"use client"

/**
 * First-visit welcome offer (prototype: #promo + app.js initPromo).
 * Shown once (`livo-promo`), never to a signed-in visitor, never over an open booking chat,
 * and not on the sign-in / profile pages. The photo is loaded only for visitors who will see it.
 */
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { prefs } from "@/lib/browser-storage"

const HIDDEN_ON = ["auth", "account", "review"]

export function PromoDialog() {
  const { t, l } = useLang()
  const pathname = usePathname()
  const [state, setState] = useState<"idle" | "loading" | "open" | "done">("idle")
  const dialogRef = useRef<HTMLDivElement>(null)
  const okRef = useRef<HTMLAnchorElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const page = pathname.split("/")[2] ?? ""

  useEffect(() => {
    if (state !== "idle") return
    if (HIDDEN_ON.includes(page) || prefs.get("livo-promo") || prefs.get("livo-authed")) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starts loading the photo after hydration
    setState("loading")
  }, [page, state])

  useEffect(() => {
    if (state !== "open") return
    document.body.classList.add("lock")
    okRef.current?.focus()
    return () => document.body.classList.remove("lock")
  }, [state])

  const close = () => {
    prefs.set("livo-promo", "1")
    setState("done")
    lastFocus.current?.focus?.()
  }

  const show = () => {
    // never on top of a booking in progress
    if (document.querySelector(".chat.open")) {
      setTimeout(show, 1500)
      return
    }
    lastFocus.current = document.activeElement as HTMLElement
    setState("open")
  }

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") close()
    if (e.key !== "Tab" || !dialogRef.current) return
    const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("a,button"))
    const a = document.activeElement
    if (e.shiftKey && a === f[0]) {
      e.preventDefault()
      f[f.length - 1].focus()
    } else if (!e.shiftKey && a === f[f.length - 1]) {
      e.preventDefault()
      f[0].focus()
    }
  }

  if (state === "idle" || state === "done") return null
  return (
    <div className="promo" id="promo" hidden={state !== "open"} onMouseDown={(e) => e.target === e.currentTarget && close()} onKeyDown={onKeyDown}>
      <div className="promo-d" role="dialog" aria-modal="true" aria-labelledby="promo-t" ref={dialogRef}>
        <div className="promo-im">
          <img
            src="/img/promo.webp"
            alt=""
            width="800"
            height="1000"
            onLoad={() => state === "loading" && setTimeout(show, 700)}
            onError={() => state === "loading" && setTimeout(show, 700)}
          />
        </div>
        <div className="promo-tx">
          <span className="promo-tag">{t("Welcome offer", "Offre de bienvenue", "Willkommensangebot")}</span>
          <h2 id="promo-t">{t("Your first inspection is on us.", "Votre première inspection est offerte.", "Ihre erste Besichtigung geht auf uns.")}</h2>
          <p>
            {t(
              "Sign up with LIVO today and a local pro will inspect your first job for free.",
              "Inscrivez-vous sur LIVO dès aujourd’hui : un pro près de chez vous inspecte gratuitement votre premier projet.",
              "Registrieren Sie sich noch heute bei LIVO – ein Profi aus Ihrer Nähe besichtigt Ihren ersten Auftrag kostenlos.",
            )}
          </p>
          <Link className="btn pk lg" href={l("/auth#signup")} ref={okRef} onClick={() => { prefs.set("livo-promo", "1"); setState("done") }}>
            {t("Sign up now", "Je m’inscris", "Jetzt registrieren")}
          </Link>
          <button className="promo-x" type="button" onClick={close}>
            {t("Skip", "Passer", "Überspringen")}
          </button>
        </div>
      </div>
    </div>
  )
}
