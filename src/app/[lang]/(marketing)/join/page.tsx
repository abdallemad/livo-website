import type { Metadata } from "next"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"
import { MascotSvg } from "@/components/shared/Mascot"
import { JoinApplicationForm } from "@/components/pages/JoinApplicationForm"

const TITLE = { en: "Join us – LIVO", fr: "Rejoignez-nous – LIVO", de: "Mitmachen – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/join">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/join", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "Become a LIVO professional in Luxembourg." })
}

export default async function JoinPage({ params }: PageProps<"/[lang]/join">) {
  const { t } = await resolvePage(params)
  return (
    <>
      <section className="pgh" style={{ paddingBottom: "0" }}>
        <div className="wrap jhero">
          <div>
            <h1>
              <span>{t("Work with", "Travaillez avec", "Arbeiten Sie mit")}</span> <em>LIVO.</em>
            </h1>
            <p>
              {t(
                "Offer your skills to customers across Luxembourg. Tell us your trade — we’ll get back to you.",
                "Proposez vos compétences aux clients du Luxembourg. Indiquez-nous votre métier — nous vous recontactons.",
                "Bieten Sie Ihr Können Kunden in ganz Luxemburg an. Nennen Sie uns Ihren Beruf — wir melden uns bei Ihnen.",
              )}
            </p>
            <div className="checks">
              <span>
                <span>✓</span> <span>{t("Local requests", "Demandes locales", "Lokale Anfragen")}</span>
              </span>
              <span>
                <span>✓</span> <span>{t("Simple process", "Processus simple", "Einfacher Ablauf")}</span>
              </span>
              <span>
                <span>✓</span> <span>{t("Real support", "Vrai soutien", "Echte Hilfe")}</span>
              </span>
            </div>
            <a className="btn pk lg" href="#apply">
              {t("Apply now", "Postuler maintenant", "Jetzt bewerben")}
            </a>
          </div>
          <div className="collage" aria-hidden="true">
            <div className="c1" />
            <div className="c2" />
            <div className="lg">
              <img src="/img/logo.png" alt="" />
            </div>
            <div className="mm">
              <MascotSvg gradientId="mgjm" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="sh rv">
            <span className="gh" aria-hidden="true">
              {t("Benefits", "Atouts", "Vorteile")}
            </span>
            <div className="sh-in">
              <h2>{t("Why work with LIVO", "Pourquoi travailler avec LIVO", "Warum mit LIVO arbeiten")}</h2>
            </div>
          </div>
          <div className="bn4 rv">
            <div className="bn">
              <i aria-hidden="true">📍</i>
              <h3>{t("Requests near you", "Demandes près de vous", "Anfragen in Ihrer Nähe")}</h3>
              <p>{t("Local jobs in Luxembourg.", "Des missions locales au Luxembourg.", "Lokale Aufträge in Luxemburg.")}</p>
            </div>
            <div className="bn">
              <i aria-hidden="true">🧭</i>
              <h3>{t("Simple process", "Processus simple", "Einfacher Ablauf")}</h3>
              <p>{t("Apply once, we guide you.", "Postulez une fois, on vous guide.", "Einmal bewerben, wir begleiten Sie.")}</p>
            </div>
            <div className="bn">
              <i aria-hidden="true">⭐</i>
              <h3>{t("Build your name", "Faites-vous un nom", "Ruf aufbauen")}</h3>
              <p>{t("Ratings that grow your reputation.", "Des avis qui font grandir votre réputation.", "Bewertungen, die Ihr Ansehen stärken.")}</p>
            </div>
            <div className="bn">
              <i aria-hidden="true">🤝</i>
              <h3>{t("Local support", "Soutien local", "Hilfe vor Ort")}</h3>
              <p>{t("A team you can call.", "Une équipe que vous pouvez appeler.", "Ein Team, das Sie anrufen können.")}</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="sh rv">
            <span className="gh" aria-hidden="true">
              {t("Steps", "Étapes", "Schritte")}
            </span>
            <div className="sh-in">
              <h2>{t("How to join", "Comment nous rejoindre", "So machen Sie mit")}</h2>
            </div>
          </div>
          <div className="flow rv">
            <div className="fs">
              <div className="fc" aria-hidden="true">
                📝
                <b>1</b>
              </div>
              <h3>{t("Apply", "Postulez", "Bewerben")}</h3>
              <p>{t("Fill in the short form.", "Remplissez le court formulaire.", "Füllen Sie das kurze Formular aus.")}</p>
            </div>
            <div className="fs">
              <div className="fc" aria-hidden="true">
                📞
                <b>2</b>
              </div>
              <h3>{t("We call you", "Nous vous appelons", "Wir rufen an")}</h3>
              <p>{t("A quick chat about your work.", "Un échange rapide sur votre métier.", "Ein kurzes Gespräch über Ihre Arbeit.")}</p>
            </div>
            <div className="fs">
              <div className="fc" aria-hidden="true">
                🛡️
                <b>3</b>
              </div>
              <h3>{t("Get verified", "Vérification", "Prüfung")}</h3>
              <p>{t("We check your details.", "Nous vérifions vos informations.", "Wir prüfen Ihre Angaben.")}</p>
            </div>
            <div className="fs">
              <div className="fc" aria-hidden="true">
                🚀
                <b>4</b>
              </div>
              <h3>{t("Start working", "C’est parti", "Loslegen")}</h3>
              <p>{t("Receive requests.", "Recevez des demandes.", "Erhalten Sie Anfragen.")}</p>
            </div>
          </div>
        </div>
      </section>
      <section id="apply">
        <div className="wrap" style={{ maxWidth: "900px" }}>
          <div className="fcard">
            <h2>{t("Job application", "Candidature", "Bewerbung")}</h2>
            <p className="sub">
              {t(
                "Tell us about you and the service you offer.",
                "Parlez-nous de vous et du service que vous proposez.",
                "Erzählen Sie uns von sich und Ihrem Angebot.",
              )}
            </p>
            <JoinApplicationForm />
          </div>
        </div>
      </section>
    </>
  )
}
