import type { Metadata } from "next"
import Link from "next/link"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"

const TITLE = { en: "FAQ – LIVO", fr: "FAQ – LIVO", de: "FAQ – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/faq", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "Frequently asked questions about LIVO." })
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { t, l } = await resolvePage(params)
  return (
    <>
      <section className="pgh">
        <div className="wrap">
          <div className="crumb">
            <Link href={l("/")}>LIVO</Link>
            {" / "}
            <span>FAQ</span>
          </div>
          <div className="sh">
            <span className="gh" aria-hidden="true">
              FAQ
            </span>
            <div className="sh-in">
              <h1>{t("Frequently asked questions", "Questions fréquentes", "Häufige Fragen")}</h1>
              <p>
                {t(
                  "Quick answers about LIVO and requesting a service.",
                  "Des réponses rapides sur LIVO et la demande de service.",
                  "Schnelle Antworten zu LIVO und zur Service-Anfrage.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ paddingTop: "20px" }}>
        <div className="wrap">
          <div className="faq rv">
            <details>
              <summary>{t("What is LIVO?", "Qu’est-ce que LIVO ?", "Was ist LIVO?")}</summary>
              <p>
                {t(
                  "LIVO is a service platform that helps people in Luxembourg discover and request everyday services in one place.",
                  "LIVO est une plateforme qui aide les habitants du Luxembourg à découvrir et demander des services du quotidien au même endroit.",
                  "LIVO ist eine Service-Plattform, die Menschen in Luxemburg hilft, Alltagsservices an einem Ort zu entdecken und anzufragen.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("What services can I find?", "Quels services puis-je trouver ?", "Welche Services finde ich?")}</summary>
              <p>
                {t(
                  "Home repairs, cleaning, gardening, delivery, moving, furniture assembly, transport and more. Categories may change — see the Services page.",
                  "Réparations, nettoyage, jardinage, livraison, déménagement, montage de meubles, transport et plus. Les catégories peuvent évoluer — voir la page Services.",
                  "Reparaturen im Haushalt, Reinigung, Gartenarbeit, Lieferung, Umzug, Möbelmontage, Transport und mehr. Die Kategorien können sich ändern – siehe Seite „Services“.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("How do I request a service?", "Comment demander un service ?", "Wie kann ich einen Service anfragen?")}</summary>
              <p>
                {t(
                  "Tap “Request a service”, choose what you need, add the date and your details, and submit.",
                  "Touchez « Demander un service », choisissez ce qu’il vous faut, ajoutez la date et vos coordonnées, puis envoyez.",
                  "Tippen Sie auf „Service anfragen“, wählen Sie aus, was Sie brauchen, ergänzen Sie Datum und Ihre Angaben und senden Sie ab.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("Which areas does LIVO cover?", "Quelles zones LIVO couvre-t-il ?", "Welche Gebiete deckt LIVO ab?")}</summary>
              <p>
                {t(
                  "LIVO focuses on Luxembourg. Availability can vary by service and location, so share your address with your request.",
                  "LIVO se concentre sur le Luxembourg. La disponibilité varie selon le service et le lieu : indiquez votre adresse avec votre demande.",
                  "LIVO konzentriert sich auf Luxemburg. Die Verfügbarkeit kann je nach Service und Ort variieren – geben Sie daher bei der Anfrage Ihre Adresse an.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("How much does a service cost?", "Combien coûte un service ?", "Was kostet ein Service?")}</summary>
              <p>
                {t(
                  "Price depends on the work, location and details. Request a quote and confirm the price before work begins.",
                  "Le prix dépend du travail, du lieu et des détails. Demandez un devis et confirmez le prix avant le début des travaux.",
                  "Der Preis hängt von Arbeit, Ort und Details ab. Fordern Sie ein Angebot an und bestätigen Sie den Preis vor Arbeitsbeginn.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("Evenings or weekends?", "Soirs ou week-ends ?", "Abends oder am Wochenende?")}</summary>
              <p>
                {t(
                  "It depends on the professional handling your request. Confirm the time before your service is scheduled.",
                  "Cela dépend du professionnel en charge de votre demande. Confirmez l’horaire avant la planification.",
                  "Das hängt von der Fachkraft ab, die Ihre Anfrage übernimmt. Bestätigen Sie die Uhrzeit, bevor Ihr Termin eingeplant wird.",
                )}
              </p>
            </details>
            <details>
              <summary>
                {t("Can I change or cancel a request?", "Puis-je modifier ou annuler une demande ?", "Kann ich eine Anfrage ändern oder stornieren?")}
              </summary>
              <p>
                {t(
                  "Contact LIVO as soon as possible with your request details.",
                  "Contactez LIVO dès que possible avec les détails de votre demande.",
                  "Kontaktieren Sie LIVO so bald wie möglich mit den Details Ihrer Anfrage.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("How can I become a LIVO professional?", "Comment devenir professionnel LIVO ?", "Wie werde ich LIVO-Profi?")}</summary>
              <p>
                {t(
                  "Use the “Join us” page to apply — we’ll share the next steps and requirements.",
                  "Utilisez la page « Rejoignez-nous » pour postuler — nous vous indiquerons les étapes et les conditions.",
                  "Bewerben Sie sich über die Seite „Mitmachen“ – wir informieren Sie über die nächsten Schritte und Voraussetzungen.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("What if there is a problem with a service?", "Que faire en cas de problème ?", "Was tun bei einem Problem?")}</summary>
              <p>
                {t(
                  "Contact us with your request reference and what happened, and we’ll advise on the next steps.",
                  "Contactez-nous avec votre référence de demande et ce qui s’est passé, et nous vous conseillerons.",
                  "Kontaktieren Sie uns mit Ihrer Anfragenummer und einer kurzen Schilderung – wir beraten Sie zu den nächsten Schritten.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("How can I contact LIVO?", "Comment contacter LIVO ?", "Wie erreiche ich LIVO?")}</summary>
              <p>
                {t(
                  "Call +352 661 111 353, write on WhatsApp, or use the Contact page.",
                  "Appelez le +352 661 111 353, écrivez sur WhatsApp ou utilisez la page Contact.",
                  "Rufen Sie +352 661 111 353 an, schreiben Sie per WhatsApp oder nutzen Sie die Seite „Kontakt“.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("Which languages are supported?", "Quelles langues sont disponibles ?", "Welche Sprachen gibt es?")}</summary>
              <p>
                {t(
                  "The website is available in English, French and German.",
                  "Le site est disponible en anglais, en français et en allemand.",
                  "Die Website ist auf Englisch, Französisch und Deutsch verfügbar.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("Do I need an account?", "Faut-il un compte ?", "Brauche ich ein Konto?")}</summary>
              <p>
                {t(
                  "Follow the request process shown on the website. If an account is needed for a service, we guide you through it.",
                  "Suivez le processus affiché sur le site. Si un compte est nécessaire, nous vous guidons.",
                  "Folgen Sie dem Anfrageprozess auf der Website. Falls für einen Service ein Konto nötig ist, begleiten wir Sie dabei.",
                )}
              </p>
            </details>
            <div className="cta2">
              <Link className="btn pk lg" href={l("/contact")}>
                {t("Still have a question? Contact LIVO", "Une question ? Contactez LIVO", "Noch Fragen? LIVO kontaktieren")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
