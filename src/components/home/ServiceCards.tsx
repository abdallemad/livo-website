/**
 * Home "Services" section: two-row marquee + featured cards (prototype: home.js buildCards /
 * buildMarquee). Server-rendered (the prototype built them in the browser), so crawlers see every
 * service. Clicking opens the booking chat through `data-chat`.
 */
import type { CSSProperties } from "react"
import type { Locale } from "@/i18n/config"
import { pick, translator } from "@/i18n/translate"
import { SERVICES, type Service } from "@/data/services"
import { FEATURED_SERVICE_IDS } from "@/data/home"
import { categoryOf, getService, serviceImageSrc } from "@/utils/services"
import { ServiceIcon } from "@/components/shared/ServiceIcon"

/** Stable pseudo-random number in [0,1) — gives each card its own float rhythm and gradient angle. */
const rnd = (i: number, k: number) => Math.abs(Math.sin((i + 1) * (12.9898 + k)) * 43758.5453) % 1

export function ServiceCards({ lang }: { lang: Locale }) {
  const t = translator(lang)
  return (
    <div className="cards" id="cards">
      {FEATURED_SERVICE_IDS.map((id, i) => {
        const s = getService(id)!
        const c = categoryOf(s)
        const ang = 130 + Math.round(rnd(i, 1) * 70)
        const style = { "--dur": `${(6 + rnd(i, 2) * 4.5).toFixed(2)}s`, "--dl": `${(-rnd(i, 3) * 9).toFixed(2)}s` } as CSSProperties
        return (
          <article key={id} className="sc" tabIndex={0} data-chat={id} style={style}>
            <div className="sc-bg" style={{ backgroundImage: `url(${serviceImageSrc(id)}),linear-gradient(${ang}deg,${c.colors[0]},${c.colors[1]})` }} />
            <span className="sc-em" aria-hidden="true">
              {s.emoji}
            </span>
            <i className="sc-ic" aria-hidden="true">
              <ServiceIcon service={s} />
            </i>
            <span className="sc-most">
              <b aria-hidden="true">★</b>
              {t("Most requested", "Le plus demandé", "Meistgefragt")}
            </span>
            <div className="sc-tx">
              <h3>{pick(lang, s.name)}</h3>
              <p>{pick(lang, s.description)}</p>
            </div>
            <button type="button" className="btn pk sc-bk" data-chat={id}>
              {t("Book this service", "Réserver ce service", "Diesen Service buchen")}
            </button>
          </article>
        )
      })}
    </div>
  )
}

export function ServiceMarquee({ lang }: { lang: Locale }) {
  const t = translator(lang)
  const items = (list: Service[], copy: string) =>
    list.map((s) => (
      <span key={`${copy}-${s.id}`} className="mq-i" role="button" tabIndex={0} data-chat={s.id}>
        <i>
          <ServiceIcon service={s} />
        </i>
        {pick(lang, s.name)}
      </span>
    ))
  const reversed = SERVICES.slice().reverse()
  return (
    <div className="mq" id="mq" aria-label={t("Services", "Services", "Services")}>
      <div className="mq-r">
        {items(SERVICES, "a")}
        {items(SERVICES, "b")}
      </div>
      <div className="mq-r rv2">
        {items(reversed, "a")}
        {items(reversed, "b")}
      </div>
    </div>
  )
}
