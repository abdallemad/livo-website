"use client"

/**
 * Cookie notice (UI only, like the prototype): the choice is stored as `livo-ck`.
 * Shown only after mount so a returning visitor never sees it flash in the cached HTML.
 * Backend/analytics phase: load GA only when the stored choice is "accept".
 */
import { useEffect, useState } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { prefs } from "@/lib/browser-storage"

export function CookieBanner() {
  const { t } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser storage after hydration
    setShow(!prefs.get("livo-ck"))
  }, [])

  if (!show) return null
  const choose = (v: "accept" | "refuse") => {
    prefs.set("livo-ck", v)
    setShow(false)
  }
  return (
    <div className="cookie" id="ck" role="dialog" aria-label="Cookies">
      <span>
        {t(
          "This site uses essential cookies. Analytics cookies are used only with your consent.",
          "Ce site utilise des cookies essentiels. Les cookies d’analyse ne sont utilisés qu’avec votre accord.",
          "Diese Website verwendet notwendige Cookies. Analyse-Cookies werden nur mit Ihrer Zustimmung verwendet.",
        )}
      </span>
      <div>
        <button className="btn s sm" type="button" onClick={() => choose("refuse")}>
          {t("Refuse all", "Tout refuser", "Alle ablehnen")}
        </button>
        <button className="btn p sm" type="button" onClick={() => choose("accept")}>
          {t("Accept all", "Tout accepter", "Alle akzeptieren")}
        </button>
      </div>
    </div>
  )
}
