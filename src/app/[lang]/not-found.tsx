"use client"

/** 404 inside a locale (no design exists yet: reuses the page-header and CTA styles). */
import Link from "next/link"
import { useLang } from "@/components/providers/lang-provider"

export default function NotFound() {
  const { t, l } = useLang()
  return (
    <main id="top">
      <section className="pgh">
        <div className="wrap">
          <div className="sh">
            <span className="gh" aria-hidden="true">
              404
            </span>
            <div className="sh-in">
              <h1>{t("Page not found", "Page introuvable", "Seite nicht gefunden")}</h1>
              <p>{t("This page does not exist or has moved.", "Cette page n’existe pas ou a été déplacée.", "Diese Seite existiert nicht oder wurde verschoben.")}</p>
            </div>
          </div>
          <div className="more">
            <Link className="btn p lg" href={l("/")}>
              {t("Back to LIVO", "Retour à LIVO", "Zurück zu LIVO")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
