"use client"

/**
 * Join page "become a provider" form (prototype: join.html #apply form). Sends to
 * POST /api/provider-requests, which creates a ProviderRequest with the details and documents.
 */
import Link from "next/link"
import { useLang } from "@/components/providers/lang-provider"
import { SiteForm } from "@/components/forms/SiteForm"
import { ProFields, PRO_WATCHED_FIELDS, validateProLanguages } from "@/components/forms/ProFields"
import { WatchProvider, useWatchedFields } from "@/components/forms/conditional"
import { useAccountActions } from "@/hooks/use-session"
import { apiFetch, formBody } from "@/lib/api-client"

export function JoinApplicationForm() {
  const { lang, t, l } = useLang()
  const { refreshProfile } = useAccountActions()
  const { values, formProps } = useWatchedFields(PRO_WATCHED_FIELDS)
  return (
    <WatchProvider values={values}>
      <SiteForm
        className="fm g2"
        data-pro-form=""
        msgClassName="full"
        {...formProps}
        beforeValidate={(f) => validateProLanguages(f, t("Please choose at least one language.", "Veuillez choisir au moins une langue.", "Bitte wählen Sie mindestens eine Sprache."))}
        action={async (f) => {
          await apiFetch("/api/provider-requests", { method: "POST", body: formBody(f, { locale: lang }) })
          // a signed-in requester sees the request on their profile
          await refreshProfile()
        }}
      >
        <div className="fld">
          <label htmlFor="j-n">
            <span>{t("First name", "Prénom", "Vorname")}</span> <i>*</i>
          </label>
          <input id="j-n" name="first" required autoComplete="given-name" />
        </div>
        <div className="fld">
          <label htmlFor="j-l">
            <span>{t("Family name", "Nom de famille", "Nachname")}</span> <i>*</i>
          </label>
          <input id="j-l" name="last" required autoComplete="family-name" />
        </div>
        <div className="fld">
          <label htmlFor="j-p">
            <span>{t("Phone", "Téléphone", "Telefon")}</span> <i>*</i>
          </label>
          <input id="j-p" name="phone" type="tel" required autoComplete="tel" placeholder="+352 …" />
        </div>
        <div className="fld">
          <label htmlFor="j-e">{t("Email address (optional)", "Adresse e-mail (facultatif)", "E-Mail-Adresse (optional)")}</label>
          <input id="j-e" name="email" type="email" autoComplete="email" />
        </div>
        <ProFields />
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
        <div className="full">
          <button className="btn pk lg" type="submit" style={{ width: "100%" }}>
            {t("Send my application", "Envoyer ma candidature", "Bewerbung senden")}
          </button>
        </div>
      </SiteForm>
    </WatchProvider>
  )
}
