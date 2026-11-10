import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { localePath, translator } from "@/i18n/translate"
import { CONTACT, SITE_TAGLINE } from "@/constants/site"
import { SocialLinks } from "@/components/shared/icons"

/** Full site footer (server-rendered; "Request a service" opens the chat via `data-chat`). */
export function SiteFooter({ lang }: { lang: Locale }) {
  const t = translator(lang)
  const l = (p: string) => localePath(lang, p)
  return (
    <footer>
      <div className="wrap">
        <div className="fg">
          <div>
            <img className="flogo" src="/img/logo-white.png" alt="LIVO" width="190" height="65" />
            <b className="ftag">{t(SITE_TAGLINE.en, SITE_TAGLINE.fr, SITE_TAGLINE.de)}</b>
            <span className="fsub">
              {t("Home & daily services in Luxembourg.", "Services à domicile et du quotidien au Luxembourg.", "Services für Zuhause & Alltag in Luxemburg.")}
            </span>{" "}
            <SocialLinks whatsapp />
          </div>{" "}
          <div>
            <h3>{t("Customers", "Clients", "Kunden")}</h3>
            <Link href={l("/#how")}>{t("How it works", "Comment ça marche", "So funktioniert’s")}</Link>
            <Link href={l("/services")}>{t("Our services", "Nos services", "Unsere Services")}</Link>
            <a href="#" data-chat="">
              {t("Request a service", "Demander un service", "Service anfragen")}
            </a>
            <Link href={l("/faq")}>FAQ</Link>
          </div>{" "}
          <div>
            <h3>{t("Professionals", "Professionnels", "Fachkräfte")}</h3>
            <Link href={l("/join")}>{t("Become a Professional", "Devenir professionnel", "Profi werden")}</Link>
            <Link href={l("/join#apply")}>{t("Join as a pro", "Devenir pro", "Als Profi starten")}</Link>
            <Link href={l("/auth")}>{t("Log in", "Connexion", "Anmelden")}</Link>
          </div>{" "}
          <div>
            <h3>{t("Support", "Assistance", "Hilfe")}</h3>
            <a className="fcall" href={CONTACT.phoneHref}>
              <span>📞</span>
              <span>{t(`Call ${CONTACT.phoneDisplay}`, `Appeler le ${CONTACT.phoneDisplay}`, `${CONTACT.phoneDisplay} anrufen`)}</span>
            </a>{" "}
            <Link href={l("/contact")}>{t("Contact us", "Nous contacter", "Kontakt")}</Link>
            <Link href={l("/contact#complaint")}>{t("Inquiries & complaints", "Demandes & réclamations", "Anfragen & Beschwerden")}</Link>
            <a href={`mailto:${CONTACT.email}`}>{`✉️ ${CONTACT.email}`}</a>
            <span>{`📍 ${CONTACT.address}`}</span>
          </div>{" "}
        </div>
        <div className="fb">
          <span>© 2026 LIVO</span>
          <span>
            <Link href={l("/privacy")}>{t("Privacy", "Confidentialité", "Datenschutz")}</Link>
            <Link href={l("/terms")}>{t("Terms", "Conditions", "AGB")}</Link>
            <Link href={l("/refund")}>{t("Refunds", "Remboursements", "Erstattungen")}</Link>
            <Link href={l("/faq")}>FAQ</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

/** Slim footer of the focused review page. */
export function MinimalFooter({ lang }: { lang: Locale }) {
  const t = translator(lang)
  const l = (p: string) => localePath(lang, p)
  return (
    <footer>
      <div className="wrap">
        <div className="fb" style={{ marginTop: 0, border: 0 }}>
          <span>© 2026 LIVO</span>
          <span>
            <Link href={l("/")}>LIVO</Link>
            <Link href={l("/contact")}>{t("Contact", "Contact", "Kontakt")}</Link>
            <Link href={l("/privacy")}>{t("Privacy", "Confidentialité", "Datenschutz")}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
