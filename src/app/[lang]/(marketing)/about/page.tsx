import type { Metadata } from "next"
import Link from "next/link"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"

const TITLE = { en: "About LIVO", fr: "À propos de LIVO", de: "Über LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/about", {
    title: t(TITLE.en, TITLE.fr, TITLE.de),
    description: "About LIVO — everyday services made easier in Luxembourg.",
  })
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { t, l } = await resolvePage(params)
  return (
    <>
      <section className="pgh">
        <div className="wrap">
          <div className="crumb">
            <Link href={l("/")}>LIVO</Link>
            {" / "}
            <span>{t("About", "À propos", "Über uns")}</span>
          </div>
          <div className="sh">
            <span className="gh" aria-hidden="true">
              {t("About", "À propos", "Team")}
            </span>
            <div className="sh-in">
              <h1>{t("Making everyday services easier.", "Des services du quotidien plus simples.", "Alltagsservices leicht gemacht.")}</h1>
              <p>
                {t(
                  "One convenient place for home and daily needs in Luxembourg.",
                  "Un seul endroit pratique pour la maison et le quotidien au Luxembourg.",
                  "Ein praktischer Ort für Zuhause und Alltag in Luxemburg.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ paddingTop: "10px" }}>
        <div className="wrap abrs">
          <article className="abr rv">
            <div className="abr-t">
              <span className="abr-n" aria-hidden="true">
                01
              </span>{" "}
              <span className="abr-l">{t("Who we are", "Qui sommes-nous", "Wer wir sind")}</span>
              <h2>
                {t(
                  "Life Gets Busy. LIVO Makes It Easier.",
                  "La vie est bien remplie. LIVO la simplifie.",
                  "Der Alltag ist voll. LIVO macht ihn leichter.",
                )}
              </h2>
              <p>
                {t(
                  "From everyday home repairs to cleaning, gardening, transportation, and deliveries, LIVO helps you find the services you need without the hassle of searching everywhere.",
                  "Des réparations du quotidien au nettoyage, au jardinage, au transport et aux livraisons, LIVO vous aide à trouver les services dont vous avez besoin sans devoir chercher partout.",
                  "Von alltäglichen Reparaturen im Haushalt über Reinigung und Gartenarbeit bis zu Transport und Lieferungen: LIVO hilft Ihnen, die Services zu finden, die Sie brauchen – ohne überall suchen zu müssen.",
                )}
              </p>
              <p>
                {t(
                  "We bring everyday services together in one convenient platform, connecting you with professionals who help make life simpler, smoother, and more manageable.",
                  "Nous réunissons les services du quotidien sur une seule plateforme pratique, qui vous met en relation avec des professionnels pour rendre la vie plus simple, plus fluide et plus facile à gérer.",
                  "Wir bündeln Alltagsservices auf einer praktischen Plattform und bringen Sie mit Fachkräften zusammen, die Ihr Leben einfacher, entspannter und überschaubarer machen.",
                )}
              </p>
              <p className="abr-hl">
                {t(
                  "Less searching. Less stress. More time for what matters.",
                  "Moins de recherches. Moins de stress. Plus de temps pour ce qui compte.",
                  "Weniger suchen. Weniger Stress. Mehr Zeit für das, was zählt.",
                )}
              </p>
            </div>
            <figure className="abr-i abr-cut">
              <img
                src="/img/about-team.webp"
                width="1100"
                height="767"
                alt={t("LIVO professionals with their tools", "Les professionnels LIVO avec leurs outils", "LIVO-Fachkräfte mit ihrem Werkzeug")}
                loading="lazy"
              />
            </figure>
          </article>
          <article className="abr rv">
            <div className="abr-t">
              <span className="abr-n" aria-hidden="true">
                02
              </span>{" "}
              <span className="abr-l">{t("Our mission", "Notre mission", "Unsere Mission")}</span>
              <h2>
                {t(
                  "Making Everyday Life Easier, One Service at a Time.",
                  "Faciliter le quotidien, un service à la fois.",
                  "Den Alltag leichter machen – Service für Service.",
                )}
              </h2>
              <p>
                {t(
                  "Our mission is to simplify the way people access everyday services by bringing convenience, trusted professionals, and practical solutions together in one place.",
                  "Notre mission est de simplifier l’accès aux services du quotidien en réunissant au même endroit praticité, professionnels de confiance et solutions concrètes.",
                  "Unsere Mission ist es, den Zugang zu Alltagsservices zu vereinfachen – indem wir Komfort, vertrauenswürdige Fachkräfte und praktische Lösungen an einem Ort vereinen.",
                )}
              </p>
              <p>
                {t(
                  "We believe getting things done should feel simple, not stressful. That’s why LIVO is designed to help you spend less time managing tasks and more time enjoying life.",
                  "Nous pensons que faire les choses doit être simple, pas stressant. C’est pourquoi LIVO est conçu pour vous faire passer moins de temps à gérer vos tâches et plus de temps à profiter de la vie.",
                  "Wir finden: Dinge zu erledigen sollte sich einfach anfühlen, nicht stressig. Deshalb hilft Ihnen LIVO, weniger Zeit mit Organisieren zu verbringen – und mehr Zeit, das Leben zu genießen.",
                )}
              </p>
            </div>
            <figure className="abr-i">
              <img
                src="/img/about-mission.webp"
                width="1100"
                height="1100"
                alt={t(
                  "A LIVO professional installing a light while the homeowner helps",
                  "Un professionnel LIVO installe un luminaire pendant que le client l’aide",
                  "Eine LIVO-Fachkraft montiert eine Leuchte, während der Hausbesitzer hilft",
                )}
                loading="lazy"
              />
            </figure>
          </article>
          <article className="abr rv">
            <div className="abr-t">
              <span className="abr-n" aria-hidden="true">
                03
              </span>{" "}
              <span className="abr-l">{t("Our vision", "Notre vision", "Unsere Vision")}</span>
              <h2>{t("A Simpler Way to Live, Every Day.", "Une façon plus simple de vivre, chaque jour.", "Einfacher leben, jeden Tag.")}</h2>
              <p>
                {t(
                  "We envision a world where finding the right service is no longer a challenge. Through one accessible platform, we aim to make everyday life more convenient for individuals, families, and communities across Luxembourg.",
                  "Nous imaginons un monde où trouver le bon service n’est plus un défi. Grâce à une plateforme accessible, nous voulons faciliter le quotidien des particuliers, des familles et des communautés dans tout le Luxembourg.",
                  "Wir stellen uns eine Welt vor, in der die Suche nach dem richtigen Service keine Herausforderung mehr ist. Mit einer zugänglichen Plattform möchten wir den Alltag für Einzelpersonen, Familien und Gemeinschaften in ganz Luxemburg bequemer machen.",
                )}
              </p>
            </div>
            <figure className="abr-i">
              <img
                src="/img/about-vision.webp"
                width="1100"
                height="1100"
                alt={t(
                  "A relaxed couple on a balcony overlooking Luxembourg",
                  "Un couple détendu sur un balcon avec vue sur le Luxembourg",
                  "Ein entspanntes Paar auf einem Balkon mit Blick über Luxemburg",
                )}
                loading="lazy"
              />
            </figure>
          </article>
          <article className="abr rv">
            <div className="abr-t">
              <span className="abr-n" aria-hidden="true">
                04
              </span>{" "}
              <span className="abr-l">{t("The LIVO promise", "La promesse LIVO", "Das LIVO-Versprechen")}</span>
              <h2>
                {t(
                  "Your Needs. One Platform. Less Hassle.",
                  "Vos besoins. Une plateforme. Moins de tracas.",
                  "Ihre Wünsche. Eine Plattform. Weniger Aufwand.",
                )}
              </h2>
              <ul className="abr-pl">
                <li>
                  <i aria-hidden="true">✓</i>
                  <div>
                    <b>{t("Convenience That Fits Your Life", "Une praticité qui s’adapte à votre vie", "Komfort, der zu Ihrem Leben passt")}</b>
                    <span>
                      {t(
                        "Find services for your everyday needs in one place.",
                        "Trouvez les services pour vos besoins du quotidien au même endroit.",
                        "Finden Sie Services für Ihren Alltag an einem Ort.",
                      )}
                    </span>
                  </div>
                </li>
                <li>
                  <i aria-hidden="true">✓</i>
                  <div>
                    <b>
                      {t(
                        "Professionals for Everyday Tasks",
                        "Des professionnels pour les tâches du quotidien",
                        "Fachkräfte für alltägliche Aufgaben",
                      )}
                    </b>
                    <span>
                      {t(
                        "Discover service providers for your home and daily life.",
                        "Découvrez des prestataires pour votre maison et votre vie de tous les jours.",
                        "Entdecken Sie Dienstleister für Ihr Zuhause und Ihren Alltag.",
                      )}
                    </span>
                  </div>
                </li>
                <li>
                  <i aria-hidden="true">✓</i>
                  <div>
                    <b>{t("Time Well Saved", "Du temps bien gagné", "Wertvolle Zeit gespart")}</b>
                    <span>
                      {t(
                        "Spend less time searching and more time doing what you love.",
                        "Passez moins de temps à chercher et plus de temps à faire ce que vous aimez.",
                        "Weniger Zeit mit Suchen, mehr Zeit für das, was Sie lieben.",
                      )}
                    </span>
                  </div>
                </li>
                <li>
                  <i aria-hidden="true">✓</i>
                  <div>
                    <b>{t("Flexible When You Need It", "Souple quand il le faut", "Flexibel, wenn Sie es brauchen")}</b>
                    <span>
                      {t(
                        "Explore solutions for everyday tasks, including evenings and weekends.",
                        "Explorez des solutions pour les tâches du quotidien, y compris le soir et le week-end.",
                        "Entdecken Sie Lösungen für alltägliche Aufgaben – auch abends und am Wochenende.",
                      )}
                    </span>
                  </div>
                </li>
                <li>
                  <i aria-hidden="true">✓</i>
                  <div>
                    <b>{t("A Simpler Experience", "Une expérience plus simple", "Einfach unkompliziert")}</b>
                    <span>
                      {t(
                        "From finding a service to taking the next step, we make the process easier.",
                        "De la recherche d’un service à l’étape suivante, nous simplifions le parcours.",
                        "Von der Suche nach einem Service bis zum nächsten Schritt: Wir machen es Ihnen leichter.",
                      )}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <figure className="abr-i">
              <img
                src="/img/about-promise.webp"
                width="1100"
                height="1100"
                alt={t("A happy family relaxing at home", "Une famille heureuse à la maison", "Eine glückliche Familie entspannt zu Hause")}
                loading="lazy"
              />
            </figure>
          </article>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="sh rv">
            <span className="gh" aria-hidden="true">
              {t("How", "Comment", "Wie")}
            </span>
            <div className="sh-in">
              <h2>{t("How LIVO works", "Comment fonctionne LIVO", "So funktioniert LIVO")}</h2>
            </div>
          </div>
          <div className="ab3 rv">
            <div className="bn">
              <i aria-hidden="true">🔎</i>
              <h3>{t("1. Choose what you need", "1. Choisissez", "1. Service wählen")}</h3>
              <p>
                {t(
                  "Explore our categories and pick your service.",
                  "Explorez nos catégories et choisissez votre service.",
                  "Stöbern Sie in unseren Kategorien und wählen Sie Ihren Service.",
                )}
              </p>
            </div>
            <div className="bn">
              <i aria-hidden="true">💬</i>
              <h3>{t("2. Tell us the details", "2. Dites-nous les détails", "2. Details angeben")}</h3>
              <p>
                {t(
                  "Describe the task and share your location.",
                  "Décrivez la tâche et indiquez votre adresse.",
                  "Beschreiben Sie die Aufgabe und nennen Sie Ihren Standort.",
                )}
              </p>
            </div>
            <div className="bn">
              <i aria-hidden="true">➡️</i>
              <h3>{t("3. Take the next step", "3. Passez à l’étape suivante", "3. Nächster Schritt")}</h3>
              <p>
                {t(
                  "Submit your request and follow LIVO’s instructions.",
                  "Envoyez votre demande et suivez les indications de LIVO.",
                  "Senden Sie Ihre Anfrage und folgen Sie den Hinweisen von LIVO.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="sh rv">
            <span className="gh" aria-hidden="true">
              {t("Why", "Pourquoi", "Warum")}
            </span>
            <div className="sh-in">
              <h2>{t("Why choose LIVO?", "Pourquoi choisir LIVO ?", "Warum LIVO?")}</h2>
            </div>
          </div>
          <div className="bn4 rv">
            <div className="bn">
              <i aria-hidden="true">🧩</i>
              <h3>{t("Convenience", "Simplicité", "Komfort")}</h3>
              <p>{t("Many services in one place.", "Plusieurs services au même endroit.", "Viele Services an einem Ort.")}</p>
            </div>
            <div className="bn">
              <i aria-hidden="true">🔍</i>
              <h3>{t("Less searching", "Moins de recherches", "Weniger Suchen")}</h3>
              <p>{t("Start from one starting point.", "Un seul point de départ.", "Ein einziger Startpunkt.")}</p>
            </div>
            <div className="bn">
              <i aria-hidden="true">📝</i>
              <h3>{t("Clear requests", "Demandes claires", "Klare Anfragen")}</h3>
              <p>{t("A straightforward request process.", "Un processus de demande simple.", "Ein unkomplizierter Anfrageprozess.")}</p>
            </div>
            <div className="bn">
              <i aria-hidden="true">🏠</i>
              <h3>{t("Made for everyday life", "Pensé pour le quotidien", "Für den Alltag gemacht")}</h3>
              <p>{t("From home tasks to daily help.", "Des tâches de la maison à l’aide du quotidien.", "Von Hausarbeit bis Alltagshilfe.")}</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="end rv">
            <span className="abr-end-l">{t("Your everyday", "Votre quotidien", "Ihr Alltag")}</span>
            <h2>{t("Made easier.", "Plus facile.", "Leichter gemacht.")}</h2>
            <p>
              {t(
                "Whether it’s a small repair, a home project, or a service you need on the go, LIVO helps you take the next step with confidence.",
                "Qu’il s’agisse d’une petite réparation, d’un projet à la maison ou d’un service dont vous avez besoin en déplacement, LIVO vous aide à passer à l’étape suivante en toute confiance.",
                "Ob kleine Reparatur, Projekt im Haus oder ein Service für unterwegs: LIVO hilft Ihnen, den nächsten Schritt mit Zuversicht zu gehen.",
              )}
            </p>
            <p className="abr-end-s">
              {t(
                "Discover the services you need. Enjoy more of what matters.",
                "Découvrez les services dont vous avez besoin. Profitez davantage de ce qui compte.",
                "Entdecken Sie die Services, die Sie brauchen. Genießen Sie mehr von dem, was zählt.",
              )}
            </p>
            <div className="cta">
              <Link className="btn pk lg" href={l("/services")}>
                {t("Explore services", "Découvrir les services", "Services entdecken")}
              </Link>
              <button className="btn gh lg" type="button" data-chat="any">
                {t("Request a service", "Demander un service", "Service anfragen")}
              </button>
              <Link className="btn gh lg" href={l("/contact")}>
                {t("Contact LIVO", "Contacter LIVO", "LIVO kontaktieren")}
              </Link>
            </div>
            <p className="abr-end-t">
              {t(
                "LIVO — All Services. One Place. Anytime.",
                "LIVO — Tous les services. Un seul endroit. À tout moment.",
                "LIVO – Alle Services. Ein Ort. Jederzeit.",
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
