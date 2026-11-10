"use client"

/**
 * Services page catalogue (prototype: services.js): search box + category chips, category banners
 * with their service rows, and deep links (/services#plumbing highlights a service,
 * /services#repairs filters a category). Server-rendered with the full list for crawlers.
 */
import { useEffect, useState, type ReactNode } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { ServiceIcon } from "@/components/shared/ServiceIcon"
import { SERVICE_CATEGORIES, SERVICES, type Service } from "@/data/services"
import { useLocationHash } from "@/hooks/use-location-hash"
import { categoryImageSrc, getService, serviceSearchText, servicesInCategory } from "@/utils/services"

export function ServiceCatalog({ children }: { children?: ReactNode }) {
  const { t, pick } = useLang()
  const hash = useLocationHash()
  const [cat, setCat] = useState("all")
  const [q, setQ] = useState("")

  // deep links
  useEffect(() => {
    const h = decodeURIComponent(hash.slice(1))
    if (!h) return
    const scroll = (block: ScrollLogicalPosition, hit: boolean, delay: number) =>
      setTimeout(() => {
        const e = document.getElementById(h)
        if (!e) return
        e.scrollIntoView({ behavior: "smooth", block })
        if (hit) {
          e.classList.add("hit")
          setTimeout(() => e.classList.remove("hit"), 1800)
        }
      }, delay)
    /* eslint-disable react-hooks/set-state-in-effect -- the URL hash drives the filter */
    if (SERVICE_CATEGORIES.some((c) => c.id === h)) {
      setCat(h)
      const id = scroll("start", false, 60)
      return () => clearTimeout(id)
    }
    if (getService(h)) {
      setCat("all")
      setQ("")
      const id = scroll("center", true, 80)
      return () => clearTimeout(id)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [hash])

  const needle = q.trim().toLowerCase()
  const match = (s: Service) => !needle || serviceSearchText(s).includes(needle)
  const sections = SERVICE_CATEGORIES.filter((c) => cat === "all" || cat === c.id)
    .map((c) => ({ c, all: servicesInCategory(c.id), list: servicesInCategory(c.id).filter(match) }))
    .filter((x) => x.list.length)

  return (
    <>
      <div className="fbar">
        <div className="wrap">
          <input
            id="sq"
            type="search"
            placeholder={t("Search: plumbing, cleaning, moving…", "Rechercher : plomberie, nettoyage, déménagement…", "Suche: Sanitär, Reinigung, Umzug…")}
            aria-label={t("Search services", "Rechercher un service", "Services durchsuchen")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="fchips" id="fchips" role="group" aria-label={t("Categories", "Catégories", "Kategorien")}>
            <button type="button" data-c="all" className={cat === "all" ? "on" : ""} onClick={() => setCat("all")}>
              {`${t("All", "Tout", "Alle")} · ${SERVICES.length}`}
            </button>
            {SERVICE_CATEGORIES.map((c) => (
              <button key={c.id} type="button" data-c={c.id} className={cat === c.id ? "on" : ""} onClick={() => setCat(c.id)}>
                {`${c.emoji} ${pick(c.name)} · ${servicesInCategory(c.id).length}`}
              </button>
            ))}
          </div>
        </div>
      </div>
      {children}
      <div id="catlist">
        {sections.map(({ c, all, list }) => (
          <section className="cat" id={c.id} key={c.id}>
            <div className="wrap">
              <div className="catb">
                <div className="bgi" style={{ backgroundImage: `url(${categoryImageSrc(c.id)}),linear-gradient(120deg,${c.colors[0]},${c.colors[1]})` }} />
                <span className="em" aria-hidden="true">
                  {c.emoji}
                </span>
                <div>
                  <h2>{pick(c.name)}</h2>
                  <p>{`${all.length} ${all.length > 1 ? t("services", "services", "Services") : t("service", "service", "Service")}`}</p>
                </div>
                <button type="button" className="btn s" data-chat={all[0].id}>
                  {`${t("Request", "Demander", "Anfragen")} →`}
                </button>
              </div>
              <div className="srows">
                {list.map((s) => (
                  <article className="srow" id={s.id} key={s.id}>
                    <i aria-hidden="true">
                      <ServiceIcon service={s} />
                    </i>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3>{pick(s.name)}</h3>
                      <p>{pick(s.description)}</p>
                      <div className="subs">
                        {pick(s.subServices).map((x) => (
                          <span key={x}>{x}</span>
                        ))}
                      </div>
                      <button type="button" className="btn pk sm" data-chat={s.id}>
                        {t("Book this service", "Réserver ce service", "Diesen Service buchen")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="wrap">
        <p className="none" id="none" style={{ display: sections.length ? "none" : "block" }}>
          {t(
            "No service found. Contact us — we’ll help you anyway.",
            "Aucun service trouvé. Contactez-nous — nous vous aiderons quand même.",
            "Kein Service gefunden. Kontaktieren Sie uns – wir helfen Ihnen trotzdem.",
          )}
        </p>
      </div>
    </>
  )
}
