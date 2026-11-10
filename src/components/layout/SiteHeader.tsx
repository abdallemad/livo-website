"use client"

/**
 * Site header + mobile drawer (prototype: header#hd and div#dr, behaviour from app.js initHeader).
 *
 * A Client Component because nearly everything in it reacts to the visitor: dropdowns, drawer,
 * scroll shadow/progress, "burger mode" when the nav does not fit, the active link (path + hash),
 * the language switch and the account menu (Clerk session + /api/me). It still renders on the server, so the
 * cached HTML contains every nav link. Signed-in vs signed-out is switched by CSS (`html.authed`).
 */
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config"
import { rememberLocale, switchLocalePath } from "@/i18n/translate"
import { SERVICES } from "@/data/services"
import { ServiceIcon } from "@/components/shared/ServiceIcon"
import { SocialLinks } from "@/components/shared/icons"
import { useLocationHash } from "@/hooks/use-location-hash"
import { initials, useAccountActions, useSession, type SessionUser } from "@/hooks/use-session"

type Dropdown = "services" | "account" | null

export function LangSwitch() {
  const { lang } = useLang()
  const pathname = usePathname()
  const router = useRouter()
  const choose = (to: Locale) => {
    if (to === lang) return
    rememberLocale(to)
    router.push(switchLocalePath(pathname, to) + window.location.search + window.location.hash, { scroll: false })
  }
  return (
    <div className="lang" role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <button key={l} type="button" className={l === lang ? "on" : undefined} onClick={() => choose(l)}>
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  )
}

function Avatar({ user }: { user: SessionUser | null }) {
  return <span className="av-i">{user?.photo ? <img src={user.photo} alt="" /> : user ? initials(user) : null}</span>
}

function AccountSummary({ user }: { user: SessionUser | null }) {
  return (
    <div>
      <b className="acct-n">{user?.name ?? ""}</b>
      <small className="acct-e">{user?.email || user?.phone || ""}</small>
    </div>
  )
}

export function SiteHeader() {
  const { t, l } = useLang()
  const pathname = usePathname()
  const hash = useLocationHash()
  const { user } = useSession()
  const { uploadPhoto, signOut } = useAccountActions()
  const logOut = () => signOut(l("/"))
  const [open, setOpen] = useState<Dropdown>(null)
  const [drawer, setDrawer] = useState(false)
  const hdRef = useRef<HTMLElement>(null)
  const nvRef = useRef<HTMLDivElement>(null)
  const pgRef = useRef<HTMLElement>(null)

  const closeDrawer = useCallback(() => setDrawer(false), [])

  // close menus on outside click / Escape
  useEffect(() => {
    const onDoc = (e: globalThis.MouseEvent) => {
      if (!(e.target as Element).closest?.(".dd")) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null)
        setDrawer(false)
      }
    }
    document.addEventListener("click", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("click", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle("lock", drawer)
  }, [drawer])

  // scroll: shadow + reading progress
  useEffect(() => {
    let tick = false
    const frame = () => {
      tick = false
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (pgRef.current) pgRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      hdRef.current?.classList.toggle("sc", y > 8)
    }
    const onScroll = () => {
      if (!tick) {
        tick = true
        requestAnimationFrame(frame)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [pathname])

  // burger mode when the full nav does not fit (any width, any language)
  useEffect(() => {
    const fit = () => {
      const hd = hdRef.current
      const nv = nvRef.current
      if (!hd || !nv) return
      hd.classList.remove("bm")
      if (window.innerWidth > 1180 && nv.scrollWidth > nv.clientWidth + 1) hd.classList.add("bm")
    }
    fit()
    window.addEventListener("resize", fit)
    document.fonts?.ready.then(fit)
    return () => window.removeEventListener("resize", fit)
  }, [t])

  // current page link: same page, and same hash when the link has one (#general = no hash)
  const page = pathname.split("/").slice(2).join("/")
  const cur = (href: string) => {
    const [p, h] = href.split("#")
    const linkPage = p.replace(/^\//, "")
    const lh = h ? `#${h}` : ""
    return linkPage === page && (lh === "" || lh === hash || (lh === "#general" && hash === "")) ? "cur" : undefined
  }

  const toggle = (d: Exclude<Dropdown, null>) => (e: MouseEvent) => {
    e.stopPropagation()
    setOpen((o) => (o === d ? null : d))
  }

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !user) return
    await uploadPhoto(file).catch(() => {})
  }

  // links/chat buttons inside the drawer close it
  const onDrawerClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("a,[data-chat],[data-dr-close]")) closeDrawer()
  }

  const navLinks: [string, string][] = [
    ["/", t("Home", "Accueil", "Start")],
  ]

  return (
    <>
      <header className="hd" id="hd" ref={hdRef}>
        <div className="nv" ref={nvRef}>
          <Link className="logo" href={l("/")} aria-label="LIVO — home" />
          <nav className="nl" aria-label="Main">
            {navLinks.map(([href, label]) => (
              <Link key={href} href={l(href)} className={cur(href)}>
                {label}
              </Link>
            ))}
            <div className={`dd mw${open === "services" ? " open" : ""}`}>
              <button type="button" aria-expanded={open === "services"} aria-haspopup="true" onClick={toggle("services")}>
                {t("Services", "Services", "Services")}
              </button>
              <div className="pn mega">
                <div className="mega-in">
                  <div className="mpromo">
                    <b>{t("All services. One place.", "Tous les services. Un seul endroit.", "Alle Services. Ein Ort.")}</b>
                    <button className="btn pk sm" type="button" data-chat="">
                      {t("Request a service", "Demander un service", "Service anfragen")}
                    </button>
                  </div>
                  <div className="mgrid" id="mg">
                    {SERVICES.map((s) => (
                      <Link key={s.id} href={l(`/services#${s.id}`)} onClick={() => setOpen(null)}>
                        <i>
                          <ServiceIcon service={s} />
                        </i>
                        <span>{t(s.name.en, s.name.fr, s.name.de)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Link href={l("/#how")} className={cur("/#how")}>
              {t("How it works", "Fonctionnement", "So funktioniert’s")}
            </Link>
            <Link href={l("/about")} className={cur("/about")}>
              {t("About", "À propos", "Über uns")}
            </Link>
            <Link href={l("/join")} className={cur("/join")}>
              {t("Join us", "Rejoignez-nous", "Mitmachen")}
            </Link>
            <Link href={l("/contact#general")} className={cur("/contact#general")}>
              {t("Contact us", "Contact", "Kontakt")}
            </Link>
            <Link href={l("/contact#inquiry")} className={cur("/contact#inquiry")}>
              {t("Inquiries", "Demandes", "Anfragen")}
            </Link>
            <Link href={l("/contact#complaint")} className={cur("/contact#complaint")}>
              {t("Complaints", "Réclamations", "Beschwerden")}
            </Link>
            <Link href={l("/faq")} className={cur("/faq")}>
              FAQ
            </Link>
          </nav>
          <div className="nv-r">
            <SocialLinks className="soc nv-soc" />
            <LangSwitch />
            <Link className="btn ghost-nav sm" href={l("/auth")}>
              {t("Log in", "Connexion", "Anmelden")}
            </Link>
            <Link className="btn s sm hide-m" href={l("/auth#signup")}>
              {t("Sign up", "Inscription", "Registrieren")}
            </Link>
            <div className={`dd acct${open === "account" ? " open" : ""}`}>
              <button
                className="av"
                type="button"
                aria-expanded={open === "account"}
                aria-haspopup="true"
                aria-label={t("My account", "Mon compte", "Mein Konto")}
                onClick={toggle("account")}
              >
                <Avatar user={user} />
              </button>
              <div className="pn acct-m">
                <div className="acct-h">
                  <Avatar user={user} />
                  <AccountSummary user={user} />
                </div>
                <Link className="acct-i" href={l("/account")} onClick={() => setOpen(null)}>
                  <span aria-hidden="true">👤</span>
                  <span>{t("My profile", "Mon profil", "Mein Profil")}</span>
                </Link>
                <label className="acct-i">
                  <input type="file" accept="image/*" hidden onChange={onPhoto} />
                  <span aria-hidden="true">📷</span>
                  <span>{t("Change photo", "Changer la photo", "Foto ändern")}</span>
                </label>
                <button className="acct-i" type="button" onClick={logOut}>
                  <span aria-hidden="true">↩</span>
                  <span>{t("Log out", "Déconnexion", "Abmelden")}</span>
                </button>
              </div>
            </div>
            <button className="btn pk sm" type="button" data-chat="">
              {t("Request a service", "Demander un service", "Service anfragen")}
            </button>
            <button className="burger" id="burger" type="button" aria-label="Menu" onClick={() => setDrawer(true)}>
              <span />
            </button>
          </div>
        </div>
        <div className="prog">
          <i id="pg" ref={pgRef} />
        </div>
      </header>

      <div className={`dr${drawer ? " open" : ""}`} id="dr" onClick={onDrawerClick}>
        <div className="dr-bk" data-dr-close="" />
        <div className="dr-p">
          <div className="dr-h">
            <span className="logo" role="img" aria-label="LIVO" />
            <button className="dr-x" type="button" data-dr-close="" aria-label="Close">
              ✕
            </button>
          </div>
          <Link href={l("/")}>{t("Home", "Accueil", "Start")}</Link>
          <details>
            <summary>{t("Services", "Services", "Services")}</summary>
            <div className="dr-sub" id="drsub">
              {SERVICES.map((s) => (
                <Link key={s.id} href={l(`/services#${s.id}`)}>
                  <i>
                    <ServiceIcon service={s} />
                  </i>
                  {t(s.name.en, s.name.fr, s.name.de)}
                </Link>
              ))}
            </div>
          </details>
          <Link href={l("/#how")}>{t("How it works", "Comment ça marche", "So funktioniert’s")}</Link>
          <Link href={l("/about")}>{t("About", "À propos", "Über uns")}</Link>
          <Link href={l("/join")}>{t("Join us", "Rejoignez-nous", "Mitmachen")}</Link>
          <Link href={l("/contact#general")}>{t("Contact us", "Nous contacter", "Kontakt")}</Link>
          <Link href={l("/contact#inquiry")}>{t("Inquiries", "Demandes", "Anfragen")}</Link>
          <Link href={l("/contact#complaint")}>{t("Complaints", "Réclamations", "Beschwerden")}</Link>
          <Link href={l("/faq")}>FAQ</Link>
          <div className="dr-b">
            <div className="dr-acct">
              <Avatar user={user} />
              <AccountSummary user={user} />
              <button className="btn s sm" type="button" onClick={logOut}>
                {t("Log out", "Déconnexion", "Abmelden")}
              </button>
            </div>
            <Link className="btn s dr-prof" href={l("/account")}>
              {t("My profile", "Mon profil", "Mein Profil")}
            </Link>
            <button className="btn pk lg" type="button" data-chat="">
              {t("Request a service", "Demander un service", "Service anfragen")}
            </button>
            <Link className="btn s" href={l("/auth")}>
              {t("Log in", "Connexion", "Anmelden")}
            </Link>
            <Link className="btn p" href={l("/auth#signup")}>
              {t("Sign up", "Inscription", "Registrieren")}
            </Link>
            <div className="dr-l">
              <LangSwitch />
            </div>
            <SocialLinks className="soc dr-soc" />
          </div>
        </div>
      </div>
    </>
  )
}

/** Header of the focused review page: logo + language only. */
export function MinimalHeader() {
  const { l } = useLang()
  return (
    <header className="hd" id="hd">
      <div className="nv">
        <Link className="logo" href={l("/")} aria-label="LIVO — home" />
        <div className="nv-r">
          <LangSwitch />
        </div>
      </div>
      <div className="prog">
        <i id="pg" />
      </div>
    </header>
  )
}
