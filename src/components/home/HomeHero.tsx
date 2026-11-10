"use client"

/**
 * Home hero: full-width slider + search with suggestions (prototype: home.js slider/search).
 * Server-rendered with the first slide active, so the first paint matches the design.
 */
import Link from "next/link"
import { Fragment, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { useChat } from "@/components/providers/chat-provider"
import { ServiceIcon } from "@/components/shared/ServiceIcon"
import { ArrowRightIcon, ChevronIcon } from "@/components/shared/icons"
import { HERO_SLIDES, type HeroSlide } from "@/data/home"
import { POPULAR_REQUESTS, SEARCH_PHRASES, SERVICES, type Service } from "@/data/services"
import { getService, searchServices } from "@/utils/services"

const DIR: [string, string][] = [["-46px", "0px"], ["0px", "28px"], ["46px", "0px"], ["0px", "-28px"], ["-36px", "22px"], ["40px", "-22px"]]
const DUR = 6500

const fly = (i: number, dx: string, dy: string) => ({ "--i": i, "--dx": dx, "--dy": dy }) as CSSProperties

/** Title words fly in one by one; `*…*` segments are highlighted. */
function words(str: string, si: number) {
  const out: { w: string; hl: boolean; i: number; d: [string, string] }[] = []
  str.split("*").forEach((seg, k) => {
    seg
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => out.push({ w, hl: k % 2 === 1, i: out.length + 1, d: DIR[(out.length + si) % DIR.length] }))
  })
  return out
}

function Slide({ s, si, on }: { s: HeroSlide; si: number; on: boolean }) {
  const { pick, l } = useLang()
  const w = words(pick(s.title), si)
  const n = w.length
  return (
    <div className={`sl ${s.className}${on ? " on" : ""}`} role="group" aria-roledescription="slide" aria-label={`${si + 1} / ${HERO_SLIDES.length}`} aria-hidden={on ? undefined : true}>
      <div className="sl-bg" />
      <div className="sl-art" aria-hidden="true">
        {s.art.map((e) => (
          <span key={e}>{e}</span>
        ))}
      </div>
      <div className="sl-in">
        <span className="stag fly" style={fly(0, "0px", "-20px")}>
          {pick(s.tag)}
        </span>
        <h2>
          {w.map((x, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span className={`fly${x.hl ? " hl" : ""}`} style={fly(x.i, x.d[0], x.d[1])}>
                {x.w}
              </span>
            </Fragment>
          ))}
        </h2>
        <p className="fly" style={fly(n + 1, "-40px", "0px")}>
          {pick(s.text)}
        </p>
        {s.chips ? (
          <div className="sl-chips fly" style={fly(n + 3, "0px", "26px")}>
            {s.chips.map((id) => {
              const sv = getService(id)!
              return (
                <button key={id} type="button" data-chat={id}>
                  <i>
                    <ServiceIcon service={sv} />
                  </i>
                  {pick(sv.name)}
                </button>
              )
            })}
            <Link className="btn gh" href={l("/services")}>
              {pick(s.more!)} →
            </Link>
          </div>
        ) : (
          <div className="sl-acts fly" style={fly(n + 3, "0px", "26px")}>
            {s.actions!.map((a, i) =>
              a.href ? (
                a.href.startsWith("#") ? (
                  <a key={i} className={`btn ${a.kind} lg`} href={a.href}>
                    {pick(a.label)}
                  </a>
                ) : (
                  <Link key={i} className={`btn ${a.kind} lg`} href={l(a.href)}>
                    {pick(a.label)}
                  </Link>
                )
              ) : (
                <button key={i} type="button" className={`btn ${a.kind} lg`} data-chat={a.chat}>
                  {pick(a.label)}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function HomeHero() {
  const { t } = useLang()
  const [cur, setCur] = useState(0)
  const elapsed = useRef(0)
  const hold = useRef({ hover: false, search: false })
  const fills = useRef<(HTMLElement | null)[]>([])
  const x0 = useRef<number | null>(null)
  const count = HERO_SLIDES.length

  const go = (n: number) => {
    elapsed.current = 0
    setCur(((n % count) + count) % count)
  }

  // dot progress bars are painted directly (every 100 ms) instead of re-rendering the slider
  useEffect(() => {
    const paint = () =>
      fills.current.forEach((f, i) => {
        if (f) f.style.transform = `scaleX(${i < cur ? 1 : i === cur ? Math.min(elapsed.current / DUR, 1) : 0})`
      })
    paint()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => {
      if (document.hidden || hold.current.hover || hold.current.search) return
      elapsed.current += 100
      if (elapsed.current >= DUR) {
        elapsed.current = 0
        setCur((c) => (c + 1) % count)
      } else paint()
    }, 100)
    return () => clearInterval(id)
  }, [cur, count])

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.target as Element).closest("input")) return
    if (e.key === "ArrowRight") go(cur + 1)
    else if (e.key === "ArrowLeft") go(cur - 1)
  }
  const onPointerUp = (e: PointerEvent) => {
    if (x0.current === null) return
    const dx = e.clientX - x0.current
    x0.current = null
    if (Math.abs(dx) > 60 && !(e.target as Element).closest("a,button")) go(cur + (dx < 0 ? 1 : -1))
  }

  return (
    <div
      className="hs"
      id="hs"
      aria-roledescription="carousel"
      aria-label="LIVO highlights"
      onMouseEnter={() => (hold.current.hover = true)}
      onMouseLeave={() => (hold.current.hover = false)}
      onKeyDown={onKeyDown}
    >
      <div className="hs-view" id="hs-view" onPointerDown={(e) => (x0.current = e.clientX)} onPointerUp={onPointerUp}>
        {HERO_SLIDES.map((s, i) => (
          <Slide key={s.className} s={s} si={i} on={i === cur} />
        ))}
      </div>
      <button className="hs-arr pv" type="button" aria-label={t("Previous", "Précédent", "Zurück")} onClick={() => go(cur - 1)}>
        <ChevronIcon dir="left" />
      </button>
      <button className="hs-arr nx" type="button" aria-label={t("Next", "Suivant", "Weiter")} onClick={() => go(cur + 1)}>
        <ChevronIcon dir="right" />
      </button>
      <div className="hs-dots" id="hs-dots">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.className}
            type="button"
            className={`dot${i === cur ? " on" : ""}`}
            aria-label={`${t("Slide ", "Diapositive ", "Folie ")}${i + 1}`}
            aria-current={i === cur}
            onClick={() => go(i)}
          >
            <i ref={(el) => void (fills.current[i] = el)} />
          </button>
        ))}
      </div>
      <HeroSearch onHold={(v) => (hold.current.search = v)} />
    </div>
  )
}

function HeroSearch({ onHold }: { onHold: (hold: boolean) => void }) {
  const { lang, t, pick } = useLang()
  const { openChat } = useChat()
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  // typewriter placeholder (written to the DOM directly: no re-render per letter)
  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    const list = SEARCH_PHRASES[lang]
    let pi = 0
    let ci = 0
    let del = false
    let timer: ReturnType<typeof setTimeout>
    input.placeholder = ""
    const tick = () => {
      const w = list[pi % list.length]
      if (!input.value && document.activeElement !== input) {
        input.placeholder = w.slice(0, ci)
        if (!del && ci === w.length) {
          del = true
          timer = setTimeout(tick, 1100)
          return
        }
        if (del && ci === 0) {
          del = false
          pi = (pi + 1) % list.length
        }
        ci += del ? -1 : 1
        timer = setTimeout(tick, del ? 16 : 34)
      } else {
        if (!input.value && document.activeElement !== input) ci = 0
        timer = setTimeout(tick, 400)
      }
    }
    tick()
    return () => clearTimeout(timer)
  }, [lang])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", onDoc)
    return () => document.removeEventListener("click", onDoc)
  }, [])

  const close = () => {
    setOpen(false)
    onHold(q.trim().length > 0 && document.activeElement === inputRef.current)
  }
  const choose = (preset: string | { text: string }) => {
    close()
    inputRef.current?.blur()
    openChat(preset)
    setQ("")
  }

  const v = q.trim()
  const matches: Service[] = v ? searchServices(v).slice(0, 8) : []
  const row = (s: Service) => (
    <button key={s.id} type="button" onClick={() => choose(s.id)}>
      <i>
        <ServiceIcon service={s} />
      </i>
      <span>{pick(s.name)}</span>
    </button>
  )

  return (
    <div className={`hs-search${open ? " open" : ""}`} id="hs-search" ref={boxRef}>
      <form
        className="sbar"
        id="hsf"
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          choose(v ? { text: v } : "")
        }}
      >
        <span className="si" aria-hidden="true">
          🔍
        </span>
        <input
          ref={inputRef}
          id="hsq"
          type="text"
          autoComplete="off"
          aria-label={t("What are you looking for?", "Que recherchez-vous ?", "Was suchen Sie?")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={(e) => {
            e.target.placeholder = t("What are you looking for?", "Que recherchez-vous ?", "Was suchen Sie?")
            setOpen(true)
            onHold(true)
          }}
          onBlur={() => onHold(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              close()
              inputRef.current?.blur()
            }
          }}
        />
        <button type="submit" aria-label={t("Search", "Rechercher", "Suchen")}>
          <ArrowRightIcon />
        </button>
      </form>
      {/* mousedown would blur the input before the click lands */}
      <div className="sg" id="sg" onMouseDown={(e) => e.preventDefault()}>
        {open &&
          (!v ? (
            <>
              <h4>{t("Popular requests", "Demandes populaires", "Beliebte Anfragen")}</h4>
              <div className="sg-ch">
                {POPULAR_REQUESTS[lang].map(([id, label]) => (
                  <button key={label} type="button" onClick={() => choose(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <h4>{t("Top services", "Services", "Top-Services")}</h4>
              <div className="sg-l">{SERVICES.slice(0, 8).map(row)}</div>
            </>
          ) : (
            <>
              <button type="button" className="sg-req" onClick={() => choose({ text: v })}>
                💬 <span>{`${t("Request « ", "Demander « ", "Anfragen: „")}${v}${t(" »", " »", "“")}`}</span>
              </button>
              {matches.length ? (
                <div className="sg-l">{matches.map(row)}</div>
              ) : (
                <div className="sg-none">
                  {t(
                    "No service found — send your request and we’ll help anyway.",
                    "Aucun service trouvé — envoyez votre demande, on vous aide quand même.",
                    "Kein Service gefunden — senden Sie Ihre Anfrage, wir helfen trotzdem.",
                  )}
                </div>
              )}
            </>
          ))}
      </div>
    </div>
  )
}
