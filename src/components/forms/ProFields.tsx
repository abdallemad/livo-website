"use client"

/**
 * Professional application fields, shared by the Join page and the "Professional" sign-up
 * (prototype: identical blocks in join.html and auth.html, behaviour in pages.js).
 * Must be rendered inside a form wrapped in <WatchProvider> watching
 * `id_type`, `authorized` and `has_car`.
 */
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { COMMON_PRO_LANGUAGES, WORLD_LANGUAGES } from "@/data/languages"
import { ServiceSelect } from "./ServiceSelect"
import { When } from "./conditional"

export const PRO_WATCHED_FIELDS = ["id_type", "authorized", "has_car"]

/** Call before validating: at least one language (a pill or an "Other" pick). */
export function validateProLanguages(form: HTMLFormElement, message: string) {
  const all = Array.from(form.querySelectorAll<HTMLInputElement>("[name=langs]"))
  const any = all.some((i) => i.type === "hidden" || i.checked)
  all[0]?.setCustomValidity(any ? "" : message)
}

const Req = () => <i>*</i>

function LanguagePicker() {
  const { lang, t } = useLang()
  const [other, setOther] = useState(false)
  const [picked, setPicked] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const form = ref.current?.closest("form")
    if (!form) return
    const onReset = () => {
      setOther(false)
      setPicked([])
    }
    form.addEventListener("reset", onReset)
    return () => form.removeEventListener("reset", onReset)
  }, [])

  const name = useMemo(() => {
    let dn: Intl.DisplayNames | null = null
    try {
      dn = new Intl.DisplayNames([lang], { type: "language" })
    } catch {
      /* old browser */
    }
    return (c: string) => {
      const n = dn?.of(c)
      return n && n !== c ? n : WORLD_LANGUAGES[c]
    }
  }, [lang])

  const rest = Object.keys(WORLD_LANGUAGES)
    .filter((c) => !picked.includes(c))
    .map((c) => [c, name(c)] as const)
    .sort((a, b) => a[1].localeCompare(b[1], lang))

  return (
    <div className="fld full" ref={ref}>
      <span className="lbl">
        <span>{t("Languages you speak", "Langues parlées", "Ihre Sprachen")}</span> <Req />
      </span>
      <div className="pills">
        {COMMON_PRO_LANGUAGES.map(([code, label]) => (
          <label key={code}>
            <input type="checkbox" name="langs" value={code} />
            <span>{label}</span>
          </label>
        ))}
        <label>
          <input
            type="checkbox"
            id="j-lo"
            checked={other}
            onChange={(e) => {
              setOther(e.target.checked)
              if (!e.target.checked) setPicked([])
            }}
          />
          <span>{t("Other", "Autre", "Andere")}</span>
        </label>
      </div>
      <div className="lgx" id="j-lx" hidden={!other}>
        <select
          id="j-ls"
          aria-label={t("Choose another language", "Choisir une autre langue", "Weitere Sprache auswählen")}
          value=""
          onChange={(e) => e.target.value && setPicked((p) => [...p, e.target.value])}
        >
          <option value="">{t("Choose a language", "Choisir une langue", "Sprache auswählen")}</option>
          {rest.map(([c, n]) => (
            <option key={c} value={c}>
              {n}
            </option>
          ))}
        </select>
        <div className="lgx-ch" id="j-lc">
          {picked.map((c) => (
            <Fragment key={c}>
              <button type="button" aria-label={`${t("Remove ", "Retirer ", "Entfernen: ")}${name(c)}`} onClick={() => setPicked((p) => p.filter((x) => x !== c))}>
                {name(c)} <span aria-hidden="true">✕</span>
              </button>
              <input type="hidden" name="langs" value={c} />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProFields() {
  const { t } = useLang()
  return (
    <>
      <div className="fld">
        <label htmlFor="j-s">
          <span>{t("Main service", "Service principal", "Hauptservice")}</span> <Req />
        </label>
        <ServiceSelect id="j-s" name="service" required />
      </div>
      <div className="fld">
        <label htmlFor="j-x">
          <span>{t("Years of experience", "Années d’expérience", "Jahre Erfahrung")}</span> <Req />
        </label>
        <select id="j-x" name="experience" required defaultValue="">
          <option value="">{t("Choose", "Choisir", "Auswählen")}</option>
          <option value="0-1">0–1</option>
          <option value="2-4">2–4</option>
          <option value="5-9">5–9</option>
          <option value="10+">10+</option>
        </select>
      </div>
      <LanguagePicker />
      <h3 className="fsec full">{t("Your address", "Votre adresse", "Ihre Adresse")}</h3>
      <div className="fld">
        <label htmlFor="j-ab">
          <span>{t("Building number", "Numéro du bâtiment", "Hausnummer")}</span> <Req />
        </label>
        <input id="j-ab" name="address_building" required autoComplete="off" />
      </div>
      <div className="fld">
        <label htmlFor="j-as">
          <span>{t("Street name", "Nom de la rue", "Straße")}</span> <Req />
        </label>
        <input id="j-as" name="address_street" required autoComplete="address-line1" />
      </div>
      <div className="fld">
        <label htmlFor="j-ap">
          <span>{t("Postal code", "Code postal", "Postleitzahl")}</span> <Req />
        </label>
        <input id="j-ap" name="address_postcode" required autoComplete="postal-code" placeholder="1477" />
      </div>
      <div className="fld">
        <label htmlFor="j-c">{t("City / area", "Ville / zone", "Stadt / Gebiet")}</label>
        <input id="j-c" name="city" placeholder={t("Luxembourg City", "Luxembourg-Ville", "Luxemburg-Stadt")} />
      </div>
      <h3 className="fsec full">{t("ID document", "Pièce d’identité", "Ausweisdokument")}</h3>
      <div className="fld full">
        <label htmlFor="j-id">
          <span>{t("Document type", "Type de document", "Dokumenttyp")}</span> <Req />
        </label>
        <select id="j-id" name="id_type" required defaultValue="">
          <option value="">{t("Choose a document", "Choisir un document", "Dokument auswählen")}</option>
          <option value="id_card">{t("ID card", "Carte d’identité", "Personalausweis")}</option>
          <option value="driving_licence">{t("Driving licence", "Permis de conduire", "Führerschein")}</option>
          <option value="passport">{t("Passport", "Passeport", "Reisepass")}</option>
        </select>
      </div>
      <When field="id_type" is={["id_card", "driving_licence"]} className="upl2 full">
        <div className="fld">
          <label htmlFor="j-if">
            <span>{t("Front side", "Recto", "Vorderseite")}</span> <Req />
          </label>
          <input id="j-if" name="id_front" type="file" accept="image/*,.pdf" required />
        </div>
        <div className="fld">
          <label htmlFor="j-ib">
            <span>{t("Back side", "Verso", "Rückseite")}</span> <Req />
          </label>
          <input id="j-ib" name="id_back" type="file" accept="image/*,.pdf" required />
        </div>
      </When>
      <When field="id_type" is={["passport"]} className="fld full">
        <label htmlFor="j-ip">
          <span>{t("Passport photo page", "Page photo du passeport", "Passseite mit Foto")}</span> <Req />
        </label>
        <input id="j-ip" name="passport_page" type="file" accept="image/*,.pdf" required />
      </When>
      <h3 className="fsec full">{t("Work authorization", "Autorisation de travail", "Arbeitserlaubnis")}</h3>
      <div className="fld full">
        <span className="lbl">
          <span>{t("Do you have work authorization?", "Avez-vous une autorisation de travail ?", "Haben Sie eine Arbeitserlaubnis?")}</span> <Req />
        </span>
        <div className="who">
          <label>
            <input type="radio" name="authorized" value="yes" required />
            <span>{t("Yes", "Oui", "Ja")}</span>
          </label>
          <label>
            <input type="radio" name="authorized" value="no" />
            <span>{t("No", "Non", "Nein")}</span>
          </label>
        </div>
      </div>
      <When field="authorized" is={["yes"]} className="upl2 full">
        <div className="fld">
          <label htmlFor="j-af">{t("Front side (optional)", "Recto (facultatif)", "Vorderseite (optional)")}</label>
          <input id="j-af" name="authorization_front" type="file" accept="image/*,.pdf" />
        </div>
        <div className="fld">
          <label htmlFor="j-ak">{t("Back side (optional)", "Verso (facultatif)", "Rückseite (optional)")}</label>
          <input id="j-ak" name="authorization_back" type="file" accept="image/*,.pdf" />
        </div>
      </When>
      <h3 className="fsec full">{t("Car (optional)", "Voiture (facultatif)", "Auto (optional)")}</h3>
      <div className="fld full">
        <span className="lbl">{t("Do you have a car?", "Avez-vous une voiture ?", "Haben Sie ein Auto?")}</span>
        <div className="who">
          <label>
            <input type="radio" name="has_car" value="yes" />
            <span>{t("Yes", "Oui", "Ja")}</span>
          </label>
          <label>
            <input type="radio" name="has_car" value="no" />
            <span>{t("No", "Non", "Nein")}</span>
          </label>
        </div>
      </div>
      <When field="has_car" is={["yes"]} className="upl3 full">
        <div className="fld">
          <label htmlFor="j-lt">{t("Licence type", "Type de permis", "Führerscheinklasse")}</label>
          <select id="j-lt" name="licence_type" defaultValue="">
            {["", "AM", "A", "B", "BE", "C", "CE", "D"].map((v) => (
              <option key={v} value={v}>
                {v || "–"}
              </option>
            ))}
          </select>
        </div>
        <div className="upl2">
          <div className="fld">
            <label htmlFor="j-lf">{t("Licence, front side", "Permis, recto", "Führerschein, Vorderseite")}</label>
            <input id="j-lf" name="licence_front" type="file" accept="image/*,.pdf" />
          </div>
          <div className="fld">
            <label htmlFor="j-lb">{t("Licence, back side", "Permis, verso", "Führerschein, Rückseite")}</label>
            <input id="j-lb" name="licence_back" type="file" accept="image/*,.pdf" />
          </div>
        </div>
      </When>
      <div className="fld full">
        <label htmlFor="j-m">{t("About you (optional)", "À propos de vous (facultatif)", "Über Sie (optional)")}</label>
        <textarea id="j-m" name="about" />
      </div>
      <div className="fld full">
        <label htmlFor="j-f">{t("CV or portfolio (optional)", "CV ou portfolio (facultatif)", "Lebenslauf oder Portfolio (optional)")}</label>
        <input id="j-f" name="cv" type="file" accept=".pdf,.doc,.docx,image/*" />
      </div>
    </>
  )
}
