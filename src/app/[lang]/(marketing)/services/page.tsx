import type { Metadata } from "next"
import Link from "next/link"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"
import { CONTACT } from "@/constants/site"
import { ServiceCatalog } from "@/components/services/ServiceCatalog"

const TITLE = { en: "Our services – LIVO", fr: "Nos services – LIVO", de: "Unsere Services – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/services", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "All 17 LIVO services in Luxembourg." })
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { t, l } = await resolvePage(params)
  return (
    <>
      <section className="pgh">
        <div className="wrap">
          <div className="crumb">
            <Link href={l("/")}>LIVO</Link>
            {" / "}
            <span>{t("Services", "Services", "Services")}</span>
          </div>
          <div className="sh">
            <span className="gh" aria-hidden="true">
              {t("Services", "Services", "Services")}
            </span>
            <div className="sh-in">
              <h1>{t("Our services", "Nos services", "Unsere Services")}</h1>
              <p>{t("17 services, one platform.", "17 services, une seule plateforme.", "17 Services, eine Plattform.")}</p>
            </div>
          </div>
        </div>
      </section>
      <ServiceCatalog>
        <div className="wrap">
          <div className="stp">
            <ol>
              <li>
                <b>1</b>
                <span>{t("Sign-up", "Inscription", "Registrieren")}</span>
              </li>
              <li>
                <b>2</b>
                <span>{t("Choose a service", "Choisissez un service", "Service wählen")}</span>
              </li>
              <li>
                <b>3</b>
                <span>{t("Book in one minute", "Réservez en une minute", "In einer Minute buchen")}</span>
              </li>
              <li>
                <b>4</b>
                <span>{t("Get your first FREE visit", "Profitez de votre première visite GRATUITE", "Ersten Besuch GRATIS erhalten")}</span>
              </li>
            </ol>
          </div>
        </div>
      </ServiceCatalog>
      <section>
        <div className="wrap">
          <div className="end rv">
            <h2>{t("Can’t find what you need?", "Vous ne trouvez pas ce qu’il vous faut ?", "Nicht das Passende gefunden?")}</h2>
            <p>
              {t(
                "Tell us — we’ll help you find the right pro.",
                "Dites-le-nous — nous vous aiderons à trouver le bon pro.",
                "Sagen Sie es uns – wir helfen Ihnen, den richtigen Profi zu finden.",
              )}
            </p>
            <div className="cta">
              <button className="btn pk lg" type="button" data-chat="any">
                {t("Request a service", "Demander un service", "Service anfragen")}
              </button>
              <a className="btn gh lg" href={CONTACT.whatsapp} target="_blank" rel="noopener">
                <span aria-hidden="true">💬</span>
                <span>{t("Talk to us", "Parlez-nous", "Kontakt")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
