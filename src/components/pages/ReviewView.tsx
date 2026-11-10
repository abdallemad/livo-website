"use client"

/**
 * Rate-your-service flow (prototype: review.html + pages.js review). The job card is read from the
 * query string (?service=plumbing&pro=Marc&ref=LV-1234&date=…) after mount, so the page itself
 * stays static. Submits to POST /api/reviews (with the photos).
 */
import Link from "next/link"
import { useEffect, useState, type CSSProperties } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { MascotSvg } from "@/components/shared/Mascot"
import { ServiceIcon } from "@/components/shared/ServiceIcon"
import { ApiError, apiFetch, formBody } from "@/lib/api-client"
import { getService } from "@/utils/services"

type T3 = [string, string, string]
const FACE: T3[] = [["", "", ""], ["Poor", "Mauvais", "Schlecht"], ["Fair", "Moyen", "Mäßig"], ["Good", "Bien", "Gut"], ["Great", "Très bien", "Sehr gut"], ["Excellent!", "Excellent !", "Hervorragend!"]]
const EMO = ["", "😞", "😕", "🙂", "😀", "🤩"]
const TAG_POS: T3[] = [["On time", "Ponctuel", "Pünktlich"], ["Clean work", "Travail soigné", "Saubere Arbeit"], ["Friendly", "Aimable", "Freundlich"], ["Fair price", "Prix juste", "Fairer Preis"], ["Great communication", "Bonne communication", "Gute Kommunikation"]]
const TAG_NEG: T3[] = [["Arrived late", "En retard", "Verspätet"], ["Poor finish", "Finition moyenne", "Unsaubere Arbeit"], ["Unclear price", "Prix pas clair", "Preis unklar"], ["Hard to reach", "Difficile à joindre", "Schwer erreichbar"]]
const DETAILS: [key: string, label: T3][] = [
  ["time", ["On time", "Ponctualité", "Pünktlichkeit"]],
  ["quality", ["Quality of work", "Qualité du travail", "Arbeitsqualität"]],
  ["communication", ["Communication", "Communication", "Kommunikation"]],
  ["value", ["Value for money", "Rapport qualité-prix", "Preis-Leistung"]],
]
const CONFETTI = ["#7B2FF7", "#C42B9B", "#FF3D5A", "#04123A", "#A9AEB8"]

function Stars({ value, onPick }: { value: number; onPick: (n: number) => void }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" data-v={n} aria-label={String(n)} className={n <= value ? "on" : undefined} aria-pressed={n <= value} onClick={() => onPick(n)}>
          ★
        </button>
      ))}
    </>
  )
}

export function ReviewView() {
  const { lang, t, l, pick } = useLang()
  const [sending, setSending] = useState(false)
  const [qs, setQs] = useState<URLSearchParams | null>(null)
  const [overall, setOverall] = useState(0)
  const [subs, setSubs] = useState<Record<string, number>>({})
  const [rec, setRec] = useState<string | null>(null)
  const [err, setErr] = useState("")
  const [done, setDone] = useState(false)
  const [confetti, setConfetti] = useState<CSSProperties[] | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- query string is only known in the browser (page stays static)
    setQs(new URLSearchParams(window.location.search))
  }, [])

  const sv = getService(qs?.get("service"))
  const jobDetail =
    [qs?.get("pro") ? `${t("Pro: ", "Pro : ", "Profi: ")}${qs.get("pro")}` : "", qs?.get("ref") ? `${t("Ref: ", "Réf : ", "Ref.: ")}${qs.get("ref")}` : "", qs?.get("date") ?? ""]
      .filter(Boolean)
      .join(" · ") || (qs ? t("Completed — thank you for choosing LIVO", "Terminé — merci d’avoir choisi LIVO", "Abgeschlossen — danke, dass Sie LIVO gewählt haben") : "")

  const tags = overall && overall <= 3 ? TAG_NEG : TAG_POS

  return (
    <section style={{ padding: "0 0 30px" }}>
      <div className="wrap">
        <div className="rvw">
          <div className="rv-top">
            <div>
              <h1>{t("How was your service?", "Comment s’est passé votre service ?", "Wie war Ihr Service?")}</h1>
              <p>{t("Your feedback helps us and the next customer.", "Votre avis nous aide, ainsi que les prochains clients.", "Ihr Feedback hilft uns und den nächsten Kunden.")}</p>
            </div>
            <div className="mm">
              <MascotSvg gradientId="mgrv" />
            </div>
          </div>
          <div className="fcard">
            <div className="rv-job">
              <i id="rjob-i" aria-hidden="true">
                {sv ? <ServiceIcon service={sv} /> : "🛠️"}
              </i>
              <div>
                <b id="rjob-n">{sv ? pick(sv.name) : t("Your LIVO service", "Votre service LIVO", "Ihr LIVO-Service")}</b>
                <span id="rjob-d">{jobDetail}</span>
              </div>
            </div>
            <form
              id="rf"
              noValidate
              hidden={done}
              onSubmit={async (e) => {
                e.preventDefault()
                if (sending) return
                if (!overall) {
                  setErr(t("Please choose a star rating first.", "Veuillez d’abord choisir une note.", "Bitte wählen Sie zuerst eine Sternebewertung."))
                  document.getElementById("rstars")?.scrollIntoView({ block: "center", behavior: "smooth" })
                  return
                }
                const f = e.currentTarget
                const body = formBody(f, {
                  rating: String(overall),
                  details: JSON.stringify(subs),
                  recommend: rec ?? "",
                  ref: qs?.get("ref") ?? "",
                  service: qs?.get("service") ?? "",
                  locale: lang,
                })
                setSending(true)
                try {
                  await apiFetch("/api/reviews", { method: "POST", body })
                } catch (error) {
                  setSending(false)
                  const field = error instanceof ApiError && error.fieldErrors ? Object.values(error.fieldErrors).flat()[0] : undefined
                  setErr(field ?? t("Something went wrong. Please try again.", "Une erreur est survenue. Veuillez réessayer.", "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut."))
                  return
                }
                setSending(false)
                setErr("")
                setDone(true)
                setTimeout(() => document.getElementById("thanks")?.scrollIntoView({ block: "center", behavior: "smooth" }), 0)
                if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                  setConfetti(
                    Array.from({ length: 60 }, (_, i) => ({
                      left: `${Math.random() * 100}%`,
                      background: CONFETTI[i % 5],
                      animationDuration: `${2.2 + Math.random() * 2.2}s`,
                      animationDelay: `${Math.random() * 0.6}s`,
                    })),
                  )
                  setTimeout(() => setConfetti(null), 5200)
                }
              }}
            >
              <div className="lbl" style={{ textAlign: "center" }}>
                {t("Overall rating", "Note globale", "Gesamtbewertung")}
              </div>
              <div className="emo" id="remo" aria-hidden="true">
                {EMO[overall]}
              </div>
              <div className="big-stars" id="rstars" role="group" aria-label={t("Overall rating", "Note globale", "Gesamtbewertung")}>
                <Stars
                  value={overall}
                  onPick={(n) => {
                    setOverall(n)
                    setErr("")
                  }}
                />
              </div>
              <div className="face" id="rface" aria-live="polite">
                {overall ? t(...FACE[overall]) : ""}
              </div>
              <div className="subr">
                {DETAILS.map(([k, label]) => (
                  <div key={k}>
                    <b>{t(...label)}</b>
                    <span className="mini-stars" data-k={k}>
                      <Stars value={subs[k] ?? 0} onPick={(n) => setSubs((s) => ({ ...s, [k]: n }))} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="lbl" style={{ marginBottom: "8px" }}>
                {t("Would you recommend LIVO?", "Recommanderiez-vous LIVO ?", "Würden Sie LIVO empfehlen?")}
              </div>
              <div className="yn" id="ryn">
                <button type="button" data-v="yes" className={rec === "yes" ? "on" : undefined} onClick={() => setRec("yes")}>
                  <span>👍</span> <span>{t("Yes", "Oui", "Ja")}</span>
                </button>
                <button type="button" data-v="no" className={rec === "no" ? "on" : undefined} onClick={() => setRec("no")}>
                  <span>👎</span> <span>{t("Not really", "Pas vraiment", "Eher nicht")}</span>
                </button>
              </div>
              <div className="lbl" style={{ margin: "18px 0 8px" }}>
                {t("What stood out?", "Qu’est-ce qui a compté ?", "Was ist Ihnen aufgefallen?")}
              </div>
              {/* the tag set changes with the rating (positive vs. things to improve) */}
              <div className="pills" id="rtags" key={tags === TAG_NEG ? "neg" : "pos"}>
                {tags.map((tag) => (
                  <label key={tag[0]}>
                    <input type="checkbox" name="tags" value={tag[0]} />
                    <span>{t(...tag)}</span>
                  </label>
                ))}
              </div>
              <div className="fld" style={{ marginTop: "18px" }}>
                <label htmlFor="r-c">{t("Your comment (optional)", "Votre commentaire (facultatif)", "Ihr Kommentar (optional)")}</label>
                <textarea id="r-c" name="comment" />
              </div>
              <div className="fld" style={{ marginTop: "12px" }}>
                <label htmlFor="r-f">{t("Add photos (optional)", "Ajouter des photos (facultatif)", "Fotos hinzufügen (optional)")}</label>
                <input id="r-f" name="photos" type="file" accept="image/*" multiple />
              </div>
              <label className="agree" style={{ margin: "14px 0" }}>
                <input type="checkbox" name="publish" defaultChecked />
                <span>
                  {t(
                    "You may publish my review with my first name only.",
                    "Vous pouvez publier mon avis avec mon prénom uniquement.",
                    "Sie dürfen meine Bewertung nur mit meinem Vornamen veröffentlichen.",
                  )}
                </span>
              </label>{" "}
              <button className="btn pk lg" type="submit" style={{ width: "100%" }}>
                {t("Send my review", "Envoyer mon avis", "Bewertung senden")}
              </button>
              <div className={`fmsg${err ? " err" : ""}`} id="rmsg" role="status" style={{ marginTop: "12px" }}>
                {err}
              </div>
            </form>
            <div className={`thanks${done ? " show" : ""}`} id="thanks">
              <div className="ok" aria-hidden="true">
                ✓
              </div>
              <h2>{t("Thank you!", "Merci !", "Vielen Dank!")}</h2>
              <p style={{ color: "var(--muted)", margin: "8px 0 20px" }}>
                {t(
                  "Your review helps LIVO get better. This is a preview — nothing was sent.",
                  "Votre avis aide LIVO à s’améliorer. Ceci est un aperçu — rien n’a été envoyé.",
                  "Ihre Bewertung hilft LIVO, besser zu werden. Dies ist eine Vorschau — es wurde nichts gesendet.",
                )}
              </p>
              <div className="cta2">
                <Link className="btn pk" href={l("/")}>
                  {t("Back to LIVO", "Retour à LIVO", "Zurück zu LIVO")}
                </Link>
                <button className="btn s" type="button" data-chat="">
                  {t("Book another service", "Réserver un autre service", "Weiteren Service buchen")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {confetti && (
        <div className="conf">
          {confetti.map((s, i) => (
            <i key={i} style={s} />
          ))}
        </div>
      )}
    </section>
  )
}
