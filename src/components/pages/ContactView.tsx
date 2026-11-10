"use client"

/** Contact page body (prototype: contact.html + pages.js contact tabs). Sends to POST /api/contact. */
import Link from "next/link"
import { useLang } from "@/components/providers/lang-provider"
import { SiteForm } from "@/components/forms/SiteForm"
import { apiFetch, formBody } from "@/lib/api-client"
import { ServiceSelect } from "@/components/forms/ServiceSelect"
import { MascotSvg } from "@/components/shared/Mascot"
import { CONTACT } from "@/constants/site"
import { useHashTabs } from "@/hooks/use-hash-tabs"

const TABS = ["general", "inquiry", "complaint"] as const
type Topic = (typeof TABS)[number]

const HEADINGS: Record<Topic, [string, string, string]> = {
  general: ["Send us a message", "Envoyez-nous un message", "Schreiben Sie uns"],
  inquiry: ["Ask us anything", "Posez-nous vos questions", "Fragen Sie uns alles"],
  complaint: ["Tell us what went wrong", "Dites-nous ce qui n’a pas fonctionné", "Sagen Sie uns, was schiefging"],
}

export function ContactView() {
  const { lang, t, l } = useLang()
  const [tab, setTab] = useHashTabs(TABS, "general")
  const show = (...panels: Topic[]) => !panels.includes(tab)

  return (
    <>
      <section className="pgh">
        <div className="wrap">
          <div className="crumb">
            <Link href={l("/")}>LIVO</Link>
            {" / "}
            <span>{t("Contact", "Contact", "Kontakt")}</span>
          </div>
          <div className="sh">
            <span className="gh" aria-hidden="true">
              {t("Contact", "Contact", "Kontakt")}
            </span>
            <div className="sh-in">
              <h1>{t("We’re here to help.", "Nous sommes là pour vous aider.", "Wir sind für Sie da.")}</h1>
              <p>{t("Questions, inquiries or complaints — tell us.", "Questions, demandes ou réclamations — dites-nous.", "Fragen, Anfragen oder Beschwerden — schreiben Sie uns.")}</p>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="tabs" id="ctabs" role="tablist">
              {TABS.map((k) => (
                <button key={k} type="button" role="tab" data-t={k} className={tab === k ? "on" : undefined} aria-selected={tab === k} onClick={() => setTab(k)}>
                  {k === "general" ? t("General", "Général", "Allgemein") : k === "inquiry" ? t("Inquiry", "Demande", "Anfrage") : t("Complaint", "Réclamation", "Beschwerde")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{ paddingTop: "10px" }}>
        <div className="wrap split">
          <div className="cinfo">
            <a className="ci2" href={CONTACT.phoneHref}>
              <i aria-hidden="true">📞</i>
              <div>
                <b>{t("Call us", "Appelez-nous", "Anrufen")}</b>
                <span>{CONTACT.phoneDisplay}</span>
              </div>
            </a>{" "}
            <a className="ci2" href={CONTACT.whatsapp} target="_blank" rel="noopener">
              <i aria-hidden="true">💬</i>
              <div>
                <b>WhatsApp</b>
                <span>{t("Talk to us now", "Parlez-nous maintenant", "Jetzt mit uns sprechen")}</span>
              </div>
            </a>{" "}
            <a className="ci2" href={`mailto:${CONTACT.email}`}>
              <i aria-hidden="true">✉️</i>
              <div>
                <b>{t("Email", "E-mail", "E-Mail")}</b>
                <span>{CONTACT.email}</span>
              </div>
            </a>
            <div className="ci2">
              <i aria-hidden="true">📍</i>
              <div>
                <b>{t("Service area", "Zone de service", "Einsatzgebiet")}</b>
                <span>{t("All of Luxembourg · bookings online only", "Tout le Luxembourg · réservation en ligne uniquement", "Ganz Luxemburg · Buchung nur online")}</span>
              </div>
            </div>
            <div className="mini-m">
              <MascotSvg gradientId="mgc" />
              <div>{t("Prefer a quick chat? I’m here! 👋", "Un petit chat ? Je suis là ! 👋", "Lieber kurz chatten? Ich bin da! 👋")}</div>
            </div>
          </div>
          <div className="fcard">
            <h2 id="cf-h">{t(...HEADINGS[tab])}</h2>
            <p className="sub">{t("We reply as soon as we can.", "Nous répondons dès que possible.", "Wir antworten so schnell wie möglich.")}</p>
            <SiteForm
              className="fm g2"
              id="cf"
              msgClassName="full"
              action={async (f) => {
                await apiFetch("/api/contact", { method: "POST", body: formBody(f, { locale: lang }) })
              }}
            >
              <input type="hidden" name="topic" value={tab} readOnly />
              <div className="fld">
                <label htmlFor="c-n">
                  <span>{t("Full name", "Nom complet", "Vor- und Nachname")}</span> <i>*</i>
                </label>
                <input id="c-n" name="name" required autoComplete="name" />
              </div>
              <div className="fld">
                <label htmlFor="c-e">
                  <span>{t("Email address", "Adresse e-mail", "E-Mail-Adresse")}</span> <i>*</i>
                </label>
                <input id="c-e" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="fld">
                <label htmlFor="c-p">{t("Phone (optional)", "Téléphone (facultatif)", "Telefon (optional)")}</label>
                <input id="c-p" name="phone" type="tel" autoComplete="tel" placeholder="+352 …" />
              </div>
              <div className="fld" data-panel="inquiry complaint" hidden={show("inquiry", "complaint")}>
                <label htmlFor="c-s">{t("Related service", "Service concerné", "Betreffender Service")}</label>
                <ServiceSelect id="c-s" name="service" />
              </div>
              <div className="fld full" data-panel="complaint" hidden={show("complaint")}>
                <label htmlFor="c-r">{t("Request reference (if you have one)", "Référence de la demande (si vous en avez une)", "Anfragenummer (falls vorhanden)")}</label>
                <input id="c-r" name="reference" placeholder="LV-0000" />
              </div>
              <div className="fld full">
                <label htmlFor="c-m">
                  <span>{t("Your message", "Votre message", "Ihre Nachricht")}</span> <i>*</i>
                </label>
                <textarea id="c-m" name="message" required />
              </div>
              <div className="fld full">
                <label htmlFor="c-f">{t("Attach a file or photo (optional)", "Joindre un fichier ou une photo (facultatif)", "Datei oder Foto anhängen (optional)")}</label>
                <input id="c-f" name="file" type="file" accept="image/*,.pdf" />
              </div>
              <label className="agree full">
                <input type="checkbox" name="consent" required />
                <span>
                  <span>{t("I agree to the", "J’accepte la", "Ich akzeptiere die")}</span>{" "}
                  <Link href={l("/privacy")} target="_blank" rel="noopener">
                    {t("Privacy Policy", "Politique de confidentialité", "Datenschutzerklärung")}
                  </Link>
                  .
                </span>
              </label>
              <p className="hint full">
                {t(
                  "Please do not include sensitive personal information.",
                  "Merci de ne pas inclure d’informations personnelles sensibles.",
                  "Bitte geben Sie keine sensiblen persönlichen Daten an.",
                )}
              </p>
              <div className="full">
                <button className="btn pk lg" type="submit" style={{ width: "100%" }}>
                  {t("Send message", "Envoyer le message", "Nachricht senden")}
                </button>
              </div>
            </SiteForm>
          </div>
        </div>
      </section>
    </>
  )
}
