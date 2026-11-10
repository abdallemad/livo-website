import type { Metadata } from "next"
import Link from "next/link"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"
import { MascotSvg } from "@/components/shared/Mascot"
import { HomeHero } from "@/components/home/HomeHero"
import { ServiceCards, ServiceMarquee } from "@/components/home/ServiceCards"

const TITLE = {
  en: "LIVO – All Services. One Place. Anytime.",
  fr: "LIVO – Tous les services. Un seul endroit. À tout moment.",
  de: "LIVO – Alle Services. Ein Ort. Jederzeit.",
}

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/", {
    title: t(TITLE.en, TITLE.fr, TITLE.de),
    description: "Home & daily services in Luxembourg: repairs, cleaning, moving and more. One place, one tap.",
  })
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang, t, l } = await resolvePage(params)
  return (
    <>
      <div className="first">
        <HomeHero />
        <div className="hero-strip">
          <div className="wrap hr-in">
            <div>
              <h1>
                {t("All Services. One Place. Anytime.", "Tous les services. Un seul endroit. À tout moment.", "Alle Services. Ein Ort. Jederzeit.")}
              </h1>
              <p className="lead">
                {t(
                  "Find local professionals for repairs, cleaning, moving and more across Luxembourg.",
                  "Trouvez des professionnels locaux pour réparations, nettoyage, déménagement et plus au Luxembourg.",
                  "Finden Sie lokale Fachkräfte für Reparaturen, Reinigung, Umzug und mehr in ganz Luxemburg.",
                )}
              </p>
            </div>
            <div className="hstats">
              <div>
                <span className="num" data-n="17">
                  17
                </span>
                <b>{t("Service categories", "Catégories de services", "Kategorien")}</b>
              </div>
              <div>
                <span className="num" data-n="3">
                  3
                </span>
                <b>{t("Languages", "Langues", "Sprachen")}</b>
              </div>
              <div>
                <span className="num" data-n="1">
                  1
                </span>
                <b>{t("Platform", "Plateforme", "Plattform")}</b>
              </div>
            </div>
            <div className="hr-img">
              <img className="cut" src="/img/hero-cutout.webp" alt="" />
              <img
                className="ph"
                src="/img/hero-team.jpg"
                alt={t("LIVO professionals ready to help", "Les professionnels LIVO prêts à vous aider", "LIVO-Profis, bereit zu helfen")}
                width="767"
                height="464"
              />
              <Link className="cap" href={l("/services")}>
                {t("See all services →", "Voir tous les services →", "Alle Services ansehen →")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <section id="services">
        <div className="wrap">
          <div className="sh rv">
            <span className="gh" aria-hidden="true">
              {t("Services", "Services", "Services")}
            </span>
            <div className="sh-in">
              <h2>
                {t("Pros for every project in Luxembourg.", "Des pros pour chaque projet au Luxembourg.", "Profis für jedes Projekt in Luxemburg.")}
              </h2>
            </div>
          </div>
        </div>
        <ServiceMarquee lang={lang} />
        <div className="wrap">
          <ServiceCards lang={lang} />
          <div className="more">
            <Link className="btn p lg" href={l("/services")}>
              {t("See all 17 services →", "Voir les 17 services →", "Alle 17 Services ansehen →")}
            </Link>
          </div>
        </div>
      </section>
      <section id="why">
        <div className="wrap">
          <div className="sh rv">
            <span className="gh" aria-hidden="true">
              {t("Why LIVO", "Pourquoi LIVO", "Warum")}
            </span>
            <div className="sh-in">
              <h2>{t("Why customers love LIVO.", "Pourquoi les clients aiment LIVO.", "Warum Kunden LIVO lieben.")}</h2>
            </div>
          </div>
          <div className="why">
            <div
              className="why-ph rv"
              role="img"
              aria-label={t(
                "Pick a service, get matched, and a LIVO pro arrives",
                "Choisissez un service, soyez mis en relation, et un pro LIVO arrive",
                "Service wählen, passenden Profi finden – und ein LIVO-Profi kommt vorbei",
              )}
            >
              <svg viewBox="0 0 560 460" role="presentation" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="wBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#0A1F5C" />
                    <stop offset=".6" stopColor="#2A1A7C" />
                    <stop offset="1" stopColor="#5B1F8F" />
                  </linearGradient>
                  <linearGradient id="wG" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#7B2FF7" />
                    <stop offset=".55" stopColor="#C42B9B" />
                    <stop offset="1" stopColor="#FF3D5A" />
                  </linearGradient>
                  <radialGradient id="wGlow" cx=".25" cy=".2" r=".8">
                    <stop offset="0" stopColor="#7B2FF7" stopOpacity=".55" />
                    <stop offset="1" stopColor="#7B2FF7" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="560" height="460" fill="url(#wBg)" />
                <rect width="560" height="460" fill="url(#wGlow)" />
                <g fill="#fff" opacity=".07">
                  <circle cx="40" cy="40" r="3" />
                  <circle cx="90" cy="40" r="3" />
                  <circle cx="140" cy="40" r="3" />
                  <circle cx="190" cy="40" r="3" />
                  <circle cx="240" cy="40" r="3" />
                  <circle cx="520" cy="430" r="3" />
                  <circle cx="470" cy="430" r="3" />
                  <circle cx="420" cy="430" r="3" />
                </g>
                <rect x="246" y="46" width="294" height="368" rx="26" fill="#0B2A6F" />
                <g stroke="#fff" strokeOpacity=".10" strokeWidth="10" strokeLinecap="round" fill="none">
                  <path d="M262 150H524" />
                  <path d="M262 290H524" />
                  <path d="M330 60V400" />
                  <path d="M470 60V400" />
                </g>
                <g stroke="#fff" strokeOpacity=".06" strokeWidth="3" fill="none">
                  <path d="M262 90H524M262 220H524M262 350H524M400 60V400M530 60V400" />
                </g>
                <rect x="352" y="172" width="64" height="40" rx="8" fill="#7B2FF7" opacity=".28" />
                <rect x="262" y="226" width="52" height="50" rx="8" fill="#FF3D5A" opacity=".18" />
                <rect x="496" y="300" width="30" height="80" rx="8" fill="#A9AEB8" opacity=".18" />
                <path
                  d="M300 372 C300 290 430 306 430 226 S486 168 486 118"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity=".22"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M300 372 C300 290 430 306 430 226 S486 168 486 118"
                  pathLength="100"
                  fill="none"
                  stroke="url(#wG)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="100"
                >
                  <animate attributeName="stroke-dashoffset" values="100;100;0;0;0" keyTimes="0;.1;.31;.95;1" dur="8s" repeatCount="indefinite" />
                </path>
                <g transform="translate(486 118)">
                  <circle r="26" fill="#FF3D5A" opacity=".25">
                    <animate attributeName="r" values="22;22;22;40;22" keyTimes="0;.6;.68;.84;1" dur="8s" repeatCount="indefinite" />{" "}
                    <animate attributeName="opacity" values="0;0;.45;0;0" keyTimes="0;.6;.68;.84;1" dur="8s" repeatCount="indefinite" />
                  </circle>
                  <image href="/img/tile-house.webp" x="-20" y="-20" width="40" height="39.5" />
                </g>
                <g>
                  <animateMotion
                    dur="8s"
                    repeatCount="indefinite"
                    calcMode="linear"
                    keyPoints="0;0;1;1"
                    keyTimes="0;.31;.69;1"
                    path="M300 372 C300 290 430 306 430 226 S486 168 486 118"
                  />
                  <circle r="19" fill="#fff" />
                  <circle r="15" fill="#FFD3B8" />
                  <path d="M-15 -2 C-15 -22 15 -22 15 -2Z" fill="#04123A" />
                  <path d="M-19 -2H19Q21 3 14 3H-14Q-21 3 -19 -2Z" fill="#0A1F5C" />
                  <image href="/img/logo-mark.webp" x="-5.25" y="-13.5" width="10.5" height="10.28" />
                  <circle cx="-5" cy="5" r="1.7" fill="#04123A" />
                  <circle cx="5" cy="5" r="1.7" fill="#04123A" />
                  <path d="M-4 10q4 3.4 8 0" stroke="#04123A" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                </g>
                <g transform="translate(486 80)">
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="0;0;0;1.25;1;1;0"
                      keyTimes="0;.6;.69;.76;.82;.95;1"
                      dur="8s"
                      repeatCount="indefinite"
                      additive="replace"
                    />
                    <circle r="15" fill="#fff" />
                    <circle r="12" fill="#2BC48A" />
                    <path d="M-6 0l4.2 4.4 8-8.8" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
                <g>
                  <rect x="34" y="70" width="190" height="330" rx="32" fill="#04123A" stroke="#fff" strokeOpacity=".25" strokeWidth="2" />
                  <rect x="44" y="80" width="170" height="310" rx="24" fill="#F3F4FB" />
                  <rect x="104" y="86" width="50" height="9" rx="4.5" fill="#04123A" />
                  <g transform="translate(60 108)">
                    <image href="/img/logo-mark.webp" width="26" height="25.5" />
                    <rect x="34" y="4" width="64" height="9" rx="4.5" fill="#04123A" opacity=".85" />
                    <rect x="34" y="17" width="44" height="7" rx="3.5" fill="#04123A" opacity=".25" />
                  </g>
                  <g transform="translate(58 152)">
                    <image href="/img/tile-pin.webp" width="66" height="65.5" />
                    <image href="/img/tile-house.webp" x="78" width="66" height="65" />
                    <image href="/img/tile-gear.webp" y="78" width="66" height="65" />
                    <image href="/img/tile-shield.webp" x="78" y="78" width="66" height="64.7" />
                  </g>
                  <rect x="58" y="312" width="142" height="34" rx="17" fill="url(#wG)" />
                  <rect x="86" y="325" width="86" height="8" rx="4" fill="#fff" opacity=".9" />
                  <circle cx="91" cy="185" r="12" fill="#fff" stroke="#04123A" strokeOpacity=".35" strokeWidth="2" opacity="0">
                    <animate attributeName="opacity" values="0;.95;0;0" keyTimes="0;.06;.2;1" dur="8s" repeatCount="indefinite" />{" "}
                    <animate attributeName="r" values="22;12;12;12" keyTimes="0;.06;.2;1" dur="8s" repeatCount="indefinite" />
                  </circle>
                </g>
                <g transform="translate(238 66)">
                  <g>
                    <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="3.4s" repeatCount="indefinite" />
                    <circle r="24" fill="#FF3D5A" />
                    <path d="M5 -14 -8 2h8L-5 14 9 -3H1z" fill="#fff" />
                  </g>
                </g>
                <g transform="translate(520 330)">
                  <g>
                    <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="4.1s" repeatCount="indefinite" />
                    <image href="/img/tile-shield.webp" x="-26" y="-26" width="52" height="51.5" />
                  </g>
                </g>
                <g transform="translate(236 400)">
                  <g>
                    <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="3.7s" repeatCount="indefinite" />
                    <circle r="24" fill="#fff" />
                    <path d="M-12 -2 -2 -12H12V2L2 12z" fill="#C42B9B" />
                    <circle cx="6" cy="-6" r="2.600" fill="#fff" />
                  </g>
                </g>
              </svg>
              <div className="fb">
                <i>✓</i>
                <span>{t("Local, trusted pros", "Pros locaux de confiance", "Lokal & verlässlich")}</span>
              </div>
            </div>
            <div className="wl">
              <div className="wi rv">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="54" fill="#F3F4FB" />
                  <circle cx="60" cy="60" r="40" fill="#FF3D5A" opacity=".16" />
                  <path d="M68 22 38 66h20l-6 32 30-46H62z" fill="#FF3D5A" />
                </svg>
                <div>
                  <h3>{t("Get to a pro faster.", "Trouvez un pro plus vite.", "Schneller zum Profi.")}</h3>
                  <p>
                    {t(
                      "Tell us what you need — we find your best fit.",
                      "Dites-nous ce qu’il vous faut — on trouve le bon.",
                      "Sagen Sie uns, was Sie brauchen – wir finden den Passenden.",
                    )}
                  </p>
                </div>
              </div>
              <div className="wi rv">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="54" fill="#F3F4FB" />
                  <path d="M60 20 90 32v26c0 20-13 34-30 42-17-8-30-22-30-42V32z" fill="#04123A" />
                  <path d="m44 60 12 12 22-24" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h3>{t("Local, trusted professionals.", "Des professionnels locaux de confiance.", "Lokale, verlässliche Fachkräfte.")}</h3>
                  <p>
                    {t(
                      "Reliable service providers across Luxembourg.",
                      "Des prestataires fiables partout au Luxembourg.",
                      "Zuverlässige Dienstleister in ganz Luxemburg.",
                    )}
                  </p>
                </div>
              </div>
              <div className="wi rv">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="54" fill="#F3F4FB" />
                  <path d="M26 58 58 26h34v34L60 92z" fill="#04123A" />
                  <circle cx="76" cy="44" r="8" fill="#fff" />
                  <path d="M52 66h22M52 76h14" stroke="#FF3D5A" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <div>
                  <h3>{t("Fair, clear pricing.", "Des prix justes et clairs.", "Faire, klare Preise.")}</h3>
                  <p>
                    {t("A clear quote before work starts.", "Un devis clair avant le début des travaux.", "Ein klares Angebot vor Arbeitsbeginn.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="how">
        <div className="wrap">
          <div className="sh rv">
            <span className="gh" aria-hidden="true">
              {t("Process", "Étapes", "Ablauf")}
            </span>
            <div className="sh-in">
              <h2>{t("From request to done", "De la demande à la réalisation", "Von der Anfrage zum Ergebnis")}</h2>
            </div>
          </div>
          <div className="flow rv">
            <svg className="flow-p" viewBox="0 0 1000 92" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="fg" x1="0" x2="1">
                  <stop offset="0" stopColor="#7B2FF7" />
                  <stop offset=".55" stopColor="#C42B9B" />
                  <stop offset="1" stopColor="#FF3D5A" />
                </linearGradient>
              </defs>
              <path d="M125 46 C200 -8 300 100 375 46 C450 -8 550 100 625 46 C700 -8 800 100 875 46" />
            </svg>
            <div className="fs">
              <div className="fc" aria-hidden="true">
                💬
                <b>1</b>
              </div>
              <h3>{t("Tell us what you need", "Dites-nous ce qu’il vous faut", "Anliegen schildern")}</h3>
              <p>
                {t("Pick a service and describe the job.", "Choisissez un service et décrivez la tâche.", "Service wählen und Auftrag beschreiben.")}
              </p>
            </div>
            <div className="fs">
              <div className="fc" aria-hidden="true">
                🔎
                <b>2</b>
              </div>
              <h3>{t("We find the right pro", "Nous trouvons le bon pro", "Wir finden Ihren Profi")}</h3>
              <p>
                {t(
                  "We match you with a suitable professional.",
                  "Nous vous associons à un professionnel adapté.",
                  "Wir vermitteln Ihnen eine passende Fachkraft.",
                )}
              </p>
            </div>
            <div className="fs">
              <div className="fc" aria-hidden="true">
                📅
                <b>3</b>
              </div>
              <h3>{t("Agree on the details", "Convenez des détails", "Details abstimmen")}</h3>
              <p>
                {t(
                  "Get a clear quote and choose a time.",
                  "Recevez un devis clair et choisissez un créneau.",
                  "Klares Angebot erhalten und Termin wählen.",
                )}
              </p>
            </div>
            <div className="fs">
              <div className="fc" aria-hidden="true">
                ✅<b>4</b>
              </div>
              <h3>{t("Job done", "Travail terminé", "Erledigt")}</h3>
              <p>
                {t(
                  "Relax while your task is taken care of.",
                  "Détendez-vous, on s’occupe de tout.",
                  "Lehnen Sie sich zurück – wir kümmern uns darum.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="joinb" id="pro">
        <div className="wrap">
          <h2 className="rv">
            <span className="tagm">{t("Pros,", "Pros,", "Profis,")}</span>{" "}
            <span>{t("grow your business with LIVO.", "développez votre activité avec LIVO.", "wachsen Sie mit LIVO.")}</span>
          </h2>
          <div className="j3 rv">
            <div>
              <svg viewBox="0 0 200 190" aria-hidden="true">
                <path d="M26 100C16 40 86 8 150 28c52 16 44 108-16 142-62 30-98-6-108-70z" fill="#fff" opacity=".65" />
                <g className="fl">
                  <g transform="rotate(-7 100 95)">
                    <rect x="62" y="20" width="78" height="152" rx="15" fill="#fff" stroke="#04123A" strokeWidth="6" />
                    <rect x="88" y="27" width="26" height="5" rx="2.5" fill="#04123A" />
                    <path d="M101 52c-10 0-17 8-17 19v8l-5 9h44l-5-9v-8c0-11-7-19-17-19z" fill="#FF3D5A" />
                    <circle cx="101" cy="102" r="5" fill="#FF3D5A" />
                    <text
                      className="pt1"
                      x="101"
                      y="124"
                      textAnchor="middle"
                      fontFamily="Sora,sans-serif"
                      fontWeight="700"
                      fontSize="10"
                      fill="#C42B9B"
                    >
                      {t("New request", "Nouvelle", "Neue")}
                    </text>
                    <text
                      className="pt2"
                      x="101"
                      y="124"
                      textAnchor="middle"
                      fontFamily="Sora,sans-serif"
                      fontWeight="700"
                      fontSize="10"
                      fill="#C42B9B"
                    >
                      {t(".", "demande", "Anfrage")}
                    </text>
                    <rect x="76" y="132" width="50" height="8" rx="4" fill="#FFD3DA" />
                    <rect x="76" y="146" width="34" height="8" rx="4" fill="#E2E5F3" />
                  </g>
                </g>
                <path d="M44 70c-10 12-10 32 0 44M156 70c10 12 10 32 0 44" fill="none" stroke="#FF3D5A" strokeWidth="5" strokeLinecap="round" />
              </svg>
              <p>
                {t(
                  "Get notified of new requests near you.",
                  "Soyez averti des nouvelles demandes près de chez vous.",
                  "Erfahren Sie sofort von neuen Anfragen in Ihrer Nähe.",
                )}
              </p>
            </div>
            <div>
              <div className="fl" style={{ width: "min(100%,170px)", margin: "0 auto 10px" }}>
                <MascotSvg gradientId="mgj" />
              </div>
              <p>
                {t(
                  "Accept the job and do what you do best.",
                  "Acceptez la mission et faites ce que vous faites de mieux.",
                  "Nehmen Sie den Auftrag an und tun Sie, was Sie am besten können.",
                )}
              </p>
            </div>
            <div>
              <svg viewBox="0 0 200 190" aria-hidden="true">
                <path d="M24 98C20 40 90 12 154 34c50 18 40 104-18 138-62 28-108-4-112-74z" fill="#fff" opacity=".65" />
                <g className="fl">
                  <g transform="rotate(6 100 95)">
                    <rect x="62" y="20" width="78" height="152" rx="15" fill="#fff" stroke="#04123A" strokeWidth="6" />
                    <rect x="88" y="27" width="26" height="5" rx="2.5" fill="#04123A" />
                    <circle cx="101" cy="64" r="15" fill="#C9CEE8" />
                    <circle cx="101" cy="60" r="6" fill="#7B8AB8" />
                    <path d="M88 74c3-8 22-8 26 0" fill="#7B8AB8" />
                    <text x="101" y="102" textAnchor="middle" fontSize="15" fill="#FF3D5A">
                      ★★★★★
                    </text>
                    <text
                      className="pt3"
                      x="101"
                      y="124"
                      textAnchor="middle"
                      fontFamily="Sora,sans-serif"
                      fontWeight="700"
                      fontSize="10"
                      fill="#04123A"
                    >
                      {t("Great job!", "Super travail !", "Top Arbeit!")}
                    </text>
                    <rect x="76" y="136" width="50" height="8" rx="4" fill="#E2E5F3" />
                    <rect x="76" y="150" width="30" height="8" rx="4" fill="#E2E5F3" />
                  </g>
                </g>
              </svg>
              <p>
                {t(
                  "Get rated and grow your reputation.",
                  "Soyez évalué et développez votre réputation.",
                  "Sammeln Sie Bewertungen und stärken Sie Ihren Ruf.",
                )}
              </p>
            </div>
          </div>
          <div className="more rv">
            <Link className="btn p lg" href={l("/join")}>
              {t("Join us", "Rejoignez-nous", "Mitmachen")}
            </Link>
          </div>
        </div>
      </section>
      <section id="app">
        <div className="wrap">
          <div className="appb rv">
            <div>
              <h2>
                {t(
                  "The one platform you need to get everything done.",
                  "La seule plateforme qu’il vous faut pour tout faire.",
                  "Die eine Plattform, mit der Sie alles erledigen.",
                )}
              </h2>
              <p>
                {t(
                  "From repairs to moving, everything is one tap away.",
                  "Des réparations au déménagement, tout est à portée de main.",
                  "Von Reparaturen bis zum Umzug – alles nur einen Fingertipp entfernt.",
                )}
              </p>
              <div className="stores">
                <div className="store" aria-disabled="true">
                  <span className="soon">{t("Coming soon", "Bientôt", "Demnächst")}</span>
                  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                    <path d="M16.4 12.6c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.15-2.9.9-3.7.9s-1.9-.85-3.1-.8c-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.6-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-.95.04-2.1.64-2.8 1.4-.6.7-1.15 1.8-1 2.9 1.05.08 2.1-.55 2.8-1.3z" />
                  </svg>
                  <div>
                    <small>{t("Download on the", "Télécharger sur l’", "Laden im")}</small>
                    <b>App Store</b>
                  </div>
                </div>
                <div className="store" aria-disabled="true">
                  <span className="soon">{t("Coming soon", "Bientôt", "Demnächst")}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <defs>
                      <linearGradient id="gpg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#7B2FF7" />
                        <stop offset=".5" stopColor="#C42B9B" />
                        <stop offset="1" stopColor="#FF3D5A" />
                      </linearGradient>
                    </defs>
                    <path d="M4.5 2.8v18.4c0 .5.5.8.9.5L20.6 12.7c.4-.3.4-.9 0-1.2L5.4 2.3c-.4-.3-.9 0-.9.5z" fill="url(#gpg)" />
                    <path d="M4.5 12 14 12 4.7 2.6" fill="#fff" opacity=".28" />
                  </svg>
                  <div>
                    <small>{t("Get it on", "Disponible sur", "Jetzt bei")}</small>
                    <b>Google Play</b>
                  </div>
                </div>
              </div>
            </div>
            <div className="ph">
              <img
                src="/img/phone-app.webp"
                width="1000"
                height="1140"
                alt={t("The LIVO app on a phone", "L’application LIVO sur un téléphone", "Die LIVO-App auf einem Smartphone")}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="faq">
        <div className="wrap">
          <div className="sh rv">
            <span className="gh" aria-hidden="true">
              FAQ
            </span>
            <div className="sh-in">
              <h2>{t("Frequently asked questions", "Questions fréquentes", "Häufige Fragen")}</h2>
            </div>
          </div>
          <div className="faq rv">
            <details>
              <summary>{t("How do I request a service?", "Comment demander un service ?", "Wie kann ich einen Service anfragen?")}</summary>
              <p>
                {t(
                  "Tap “Request a service”, answer a few quick questions, and we take it from there.",
                  "Touchez « Demander un service », répondez à quelques questions, et nous nous occupons du reste.",
                  "Tippen Sie auf „Service anfragen“, beantworten Sie ein paar kurze Fragen – den Rest übernehmen wir.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("Which areas do you cover?", "Quelles zones couvrez-vous ?", "Welche Gebiete decken Sie ab?")}</summary>
              <p>
                {t(
                  "LIVO focuses on Luxembourg. Availability can vary by service and location.",
                  "LIVO se concentre sur le Luxembourg. La disponibilité varie selon le service et le lieu.",
                  "LIVO konzentriert sich auf Luxemburg. Die Verfügbarkeit kann je nach Service und Ort variieren.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("How does pricing work?", "Comment fonctionnent les prix ?", "Wie funktionieren die Preise?")}</summary>
              <p>
                {t(
                  "Prices depend on the job. You get a clear quote before work begins.",
                  "Les prix dépendent de la tâche. Vous recevez un devis clair avant le début des travaux.",
                  "Die Preise hängen vom Auftrag ab. Vor Arbeitsbeginn erhalten Sie ein klares Angebot.",
                )}
              </p>
            </details>
            <details>
              <summary>
                {t(
                  "Can I get service in the evening or weekend?",
                  "Puis-je être servi le soir ou le week-end ?",
                  "Gibt es auch Termine abends oder am Wochenende?",
                )}
              </summary>
              <p>
                {t(
                  "Often yes — it depends on the professional’s availability.",
                  "Souvent oui — cela dépend de la disponibilité du professionnel.",
                  "Oft ja – das hängt von der Verfügbarkeit der Fachkraft ab.",
                )}
              </p>
            </details>
            <details>
              <summary>{t("Can I cancel or reschedule?", "Puis-je annuler ou reporter ?", "Kann ich stornieren oder verschieben?")}</summary>
              <p>
                {t(
                  "Contact LIVO as soon as possible with your request details.",
                  "Contactez LIVO dès que possible avec les détails de votre demande.",
                  "Kontaktieren Sie LIVO so bald wie möglich mit den Details Ihrer Anfrage.",
                )}
              </p>
            </details>
          </div>
        </div>
      </section>
      <section id="contact">
        <div className="wrap">
          <div className="end rv">
            <h2>{t("Need a hand? LIVO is here to help.", "Besoin d’un coup de main ? LIVO est là.", "Brauchen Sie Hilfe? LIVO ist für Sie da.")}</h2>
            <p>
              {t(
                "Tell us what you need. We’ll help you find the right service.",
                "Dites-nous ce qu’il vous faut. Nous vous aiderons à trouver le bon service.",
                "Sagen Sie uns, was Sie brauchen. Wir helfen Ihnen, den richtigen Service zu finden.",
              )}
            </p>
            <div className="cta">
              <a className="btn pk lg" href="https://wa.me/352661111353" target="_blank" rel="noopener">
                <span aria-hidden="true">💬</span>
                <span>{t("Talk to us", "Parlez-nous", "Kontakt")}</span>
              </a>
              <button className="btn gh lg" type="button" data-chat="any">
                {t("Request a service", "Demander un service", "Service anfragen")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
