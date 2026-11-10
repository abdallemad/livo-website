import type { Metadata } from "next"
import Link from "next/link"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"

const TITLE = { en: "Terms & conditions – LIVO", fr: "Conditions générales – LIVO", de: "Allgemeine Geschäftsbedingungen – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/terms", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "LIVO terms and conditions." })
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { t, l } = await resolvePage(params)
  return (
    <>
      <section className="pgh">
        <div className="wrap">
          <div className="crumb">
            <Link href={l("/")}>LIVO</Link>
            {" / "}
            <span>{t("Terms", "Conditions", "AGB")}</span>
          </div>
          <div className="sh">
            <span className="gh" aria-hidden="true">
              {t("Terms", "Conditions", "AGB")}
            </span>
            <div className="sh-in">
              <h1>{t("Terms & conditions", "Conditions générales", "Allgemeine Geschäftsbedingungen")}</h1>
              <p>{t("The rules for using LIVO.", "Les règles d’utilisation de LIVO.", "Die Regeln für die Nutzung von LIVO.")}</p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ paddingTop: "20px" }}>
        <div className="wrap prose legal">
          <nav className="legal-nav" aria-label={t("Legal documents", "Documents juridiques", "Rechtliche Dokumente")}>
            <Link href={l("/privacy")}>{t("Privacy policy", "Politique de confidentialité", "Datenschutzerklärung")}</Link>
            <Link className="on" aria-current="page" href={l("/terms")}>
              {t("Terms & conditions", "Conditions générales", "AGB")}
            </Link>
            <Link href={l("/refund")}>{t("Cancellation & refunds", "Annulation et remboursement", "Stornierung & Erstattung")}</Link>
          </nav>
          <p className="legal-date">
            {t("Last updated: 3 November 2026", "Dernière mise à jour : 3 novembre 2026", "Zuletzt aktualisiert: 3. November 2026")}
          </p>
          <details open>
            <summary>
              <span>
                <b className="num2">1</b>
                <span>
                  {t("Introduction and Acceptance of Terms", "Introduction et acceptation des conditions", "Einleitung und Annahme der Bedingungen")}
                </span>
              </span>
            </summary>
            <p>
              {t(
                "These terms govern the use of the LIVO website and the services and features it provides.",
                "Les présentes conditions régissent l’utilisation du site LIVO ainsi que des services et fonctionnalités qu’il propose.",
                "Diese Bedingungen regeln die Nutzung der LIVO-Website sowie der darüber angebotenen Dienste und Funktionen.",
              )}
            </p>
            <p>
              {t(
                "By using the website or submitting a service request, the user agrees to the applicable terms, subject to any additional consents or confirmation procedures required by law.",
                "En utilisant le site ou en soumettant une demande de service, l’utilisateur accepte les conditions applicables, sous réserve des consentements ou procédures de confirmation supplémentaires exigés par la loi.",
                "Durch die Nutzung der Website oder das Einreichen einer Dienstleistungsanfrage erklärt sich der Nutzer mit den geltenden Bedingungen einverstanden, vorbehaltlich etwaiger zusätzlicher gesetzlich vorgeschriebener Einwilligungen oder Bestätigungsverfahren.",
              )}
            </p>
            <p>
              {t(
                "If you do not agree to these terms, please do not use the services that require acceptance of them.",
                "Si vous n’acceptez pas ces conditions, veuillez ne pas utiliser les services qui nécessitent leur acceptation.",
                "Wenn Sie mit diesen Bedingungen nicht einverstanden sind, nutzen Sie bitte nicht die Dienste, die deren Annahme voraussetzen.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">2</b>
                <span>{t("Definitions", "Définitions", "Begriffsbestimmungen")}</span>
              </span>
            </summary>
            <ul>
              <li>
                {t(
                  "LIVO: The digital platform that facilitates access to home and everyday services.",
                  "LIVO : la plateforme numérique qui facilite l’accès aux services à domicile et du quotidien.",
                  "LIVO: Die digitale Plattform, die den Zugang zu Dienstleistungen rund um Haus und Alltag erleichtert.",
                )}
              </li>
              <li>
                {t(
                  "User or Customer: The person who visits the website or requests a service through it.",
                  "Utilisateur ou Client : la personne qui visite le site ou demande un service par son intermédiaire.",
                  "Nutzer oder Kunde: Die Person, die die Website besucht oder über sie eine Dienstleistung anfragt.",
                )}
              </li>
              <li>
                {t(
                  "Service Provider: The person or business that offers or carries out a service through the platform.",
                  "Prestataire de services : la personne ou l’entreprise qui propose ou réalise un service via la plateforme.",
                  "Dienstleister: Die Person oder das Unternehmen, die bzw. das über die Plattform eine Dienstleistung anbietet oder erbringt.",
                )}
              </li>
              <li>
                {t(
                  "Request: A request to obtain a specific service according to the agreed details, date and price.",
                  "Demande : une demande d’obtention d’un service précis selon les détails, la date et le prix convenus.",
                  "Anfrage: Ein Ersuchen um eine bestimmte Dienstleistung gemäß den vereinbarten Einzelheiten, dem vereinbarten Termin und dem vereinbarten Preis.",
                )}
              </li>
              <li>
                {t(
                  "Platform: The LIVO website and any digital features connected to it.",
                  "Plateforme : le site LIVO et toutes les fonctionnalités numériques qui y sont liées.",
                  "Plattform: Die LIVO-Website und alle damit verbundenen digitalen Funktionen.",
                )}
              </li>
            </ul>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">3</b>
                <span>{t("Nature of LIVO’s Work", "Nature de l’activité de LIVO", "Art der Tätigkeit von LIVO")}</span>
              </span>
            </summary>
            <p>
              {t(
                "LIVO aims to facilitate communication between customers and service providers in Luxembourg.",
                "LIVO vise à faciliter la communication entre clients et prestataires de services au Luxembourg.",
                "LIVO hat zum Ziel, die Kommunikation zwischen Kunden und Dienstleistern in Luxemburg zu erleichtern.",
              )}
            </p>
            <p>
              {t(
                "If LIVO acts only as a digital intermediary, carrying out the actual service is the responsibility of the service provider with whom the customer contracts, according to the nature of the contract and the applicable law.",
                "Si LIVO agit uniquement comme intermédiaire numérique, la réalisation effective du service relève de la responsabilité du prestataire avec lequel le client contracte, selon la nature du contrat et la loi applicable.",
                "Tritt LIVO ausschließlich als digitaler Vermittler auf, liegt die tatsächliche Erbringung der Dienstleistung in der Verantwortung des Dienstleisters, mit dem der Kunde den Vertrag schließt, entsprechend der Art des Vertrags und dem geltenden Recht.",
              )}
            </p>
            <p>
              {t(
                "If LIVO provides a particular service itself or contracts for it as the service provider, its responsibilities for that service will be determined by the contract and the applicable law.",
                "Si LIVO fournit elle-même un service donné ou contracte pour celui-ci en tant que prestataire, ses responsabilités pour ce service seront déterminées par le contrat et la loi applicable.",
                "Erbringt LIVO eine bestimmte Dienstleistung selbst oder schließt LIVO den Vertrag darüber als Dienstleister, bestimmen sich die Pflichten von LIVO in Bezug auf diese Dienstleistung nach dem Vertrag und dem geltenden Recht.",
              )}
            </p>
            <p>
              {t(
                "LIVO’s role in each type of service must be made clear in a way that does not mislead the user or diminish their legal rights.",
                "Le rôle de LIVO pour chaque type de service doit être indiqué clairement, sans induire l’utilisateur en erreur ni diminuer ses droits légaux.",
                "Die Rolle von LIVO bei der jeweiligen Art von Dienstleistung muss so klar dargestellt werden, dass der Nutzer nicht irregeführt wird und seine gesetzlichen Rechte nicht geschmälert werden.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">4</b>
                <span>{t("Scope of Services", "Étendue des services", "Umfang der Dienstleistungen")}</span>
              </span>
            </summary>
            <p>
              {t(
                "The available services may include, depending on actual coverage:",
                "Les services disponibles peuvent comprendre, selon la couverture réelle :",
                "Die verfügbaren Dienstleistungen können je nach tatsächlicher Abdeckung Folgendes umfassen:",
              )}
            </p>
            <ul>
              <li>{t("Plumbing and electrical work.", "Plomberie et travaux d’électricité.", "Sanitär- und Elektroarbeiten.")}</li>
              <li>
                {t(
                  "Home repairs and general maintenance.",
                  "Réparations à domicile et entretien général.",
                  "Reparaturen im Haushalt und allgemeine Instandhaltung.",
                )}
              </li>
              <li>{t("Home cleaning and office cleaning.", "Nettoyage de logements et de bureaux.", "Wohnungs- und Büroreinigung.")}</li>
              <li>
                {t(
                  "Gardening and outdoor space care.",
                  "Jardinage et entretien des espaces extérieurs.",
                  "Gartenarbeit und Pflege von Außenanlagen.",
                )}
              </li>
              <li>
                {t(
                  "Transport, furniture moving and delivery.",
                  "Transport, déménagement de meubles et livraison.",
                  "Transport, Möbelumzüge und Lieferung.",
                )}
              </li>
              <li>{t("Furniture assembly and installation.", "Montage et installation de meubles.", "Montage und Aufbau von Möbeln.")}</li>
              <li>
                {t(
                  "Installation of flooring, parquet and HDF.",
                  "Pose de sols, de parquet et de HDF.",
                  "Verlegung von Bodenbelägen, Parkett und HDF.",
                )}
              </li>
              <li>
                {t(
                  "Plastering, painting and construction work.",
                  "Plâtrerie, peinture et travaux de construction.",
                  "Verputz-, Maler- und Bauarbeiten.",
                )}
              </li>
              <li>{t("Car services.", "Services automobiles.", "Kfz-Dienstleistungen.")}</li>
              <li>{t("Tool and equipment rental.", "Location d’outils et de matériel.", "Vermietung von Werkzeugen und Geräten.")}</li>
              <li>
                {t(
                  "Additional everyday services announced through the website.",
                  "Autres services du quotidien annoncés sur le site.",
                  "Weitere Alltagsdienstleistungen, die über die Website bekannt gegeben werden.",
                )}
              </li>
            </ul>
            <p>
              {t(
                "Available services vary by location, availability and specialisation. Listing a service on the website does not confirm that it is available in every area or at all times.",
                "Les services disponibles varient selon le lieu, la disponibilité et la spécialisation. La présence d’un service sur le site ne confirme pas qu’il est disponible dans toutes les zones ni à tout moment.",
                "Die verfügbaren Dienstleistungen variieren je nach Standort, Verfügbarkeit und Fachgebiet. Die Aufführung einer Dienstleistung auf der Website bestätigt nicht, dass sie in allen Gebieten oder jederzeit verfügbar ist.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">5</b>
                <span>{t("Submitting a Service Request", "Soumission d’une demande de service", "Einreichen einer Dienstleistungsanfrage")}</span>
              </span>
            </summary>
            <p>
              {t(
                "When submitting a request, the user undertakes to provide accurate and sufficient information to understand the requested service, including the location, a description of the task and a suitable date.",
                "En soumettant une demande, l’utilisateur s’engage à fournir des informations exactes et suffisantes pour comprendre le service demandé, notamment le lieu, une description de la tâche et une date appropriée.",
                "Beim Einreichen einer Anfrage verpflichtet sich der Nutzer, zutreffende und ausreichende Angaben zu machen, damit die angefragte Dienstleistung nachvollzogen werden kann, einschließlich des Ortes, einer Beschreibung der Aufgabe und eines geeigneten Termins.",
              )}
            </p>
            <p>
              {t(
                "LIVO may contact the user to ask for additional details, photos or information needed to estimate the service.",
                "LIVO peut contacter l’utilisateur pour demander des précisions, des photos ou des informations supplémentaires nécessaires à l’estimation du service.",
                "LIVO kann den Nutzer kontaktieren, um zusätzliche Einzelheiten, Fotos oder Informationen anzufordern, die für die Einschätzung der Dienstleistung erforderlich sind.",
              )}
            </p>
            <p>
              {t(
                "Submitting a request is a request for contact or for a price quote. It does not necessarily mean confirmation of a booking, acceptance of a price, or a guarantee that a service provider is available.",
                "Soumettre une demande revient à demander un contact ou un devis. Cela ne signifie pas nécessairement la confirmation d’une réservation, l’acceptation d’un prix ou la garantie qu’un prestataire est disponible.",
                "Das Einreichen einer Anfrage stellt eine Bitte um Kontaktaufnahme oder um einen Kostenvoranschlag dar. Es bedeutet nicht zwingend die Bestätigung einer Buchung, die Annahme eines Preises oder eine Garantie dafür, dass ein Dienstleister verfügbar ist.",
              )}
            </p>
            <p>
              {t(
                "The request becomes confirmed when the user is notified of its acceptance and its details are confirmed through the approved booking mechanism.",
                "La demande est confirmée lorsque l’utilisateur est informé de son acceptation et que ses détails sont confirmés par le mécanisme de réservation approuvé.",
                "Die Anfrage gilt als bestätigt, wenn der Nutzer über ihre Annahme benachrichtigt wird und ihre Einzelheiten über das zugelassene Buchungsverfahren bestätigt werden.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">6</b>
                <span>{t("Prices and Quotes", "Prix et devis", "Preise und Kostenvoranschläge")}</span>
              </span>
            </summary>
            <p>
              {t(
                "Prices are determined according to the type of service, the scope of work, the materials required, the time, the location and any legitimate additional costs.",
                "Les prix sont déterminés selon le type de service, l’étendue des travaux, les matériaux nécessaires, la durée, le lieu et d’éventuels frais supplémentaires légitimes.",
                "Die Preise richten sich nach der Art der Dienstleistung, dem Arbeitsumfang, den benötigten Materialien, dem Zeitaufwand, dem Ort sowie etwaigen berechtigten Zusatzkosten.",
              )}
            </p>
            <p>
              {t(
                "The customer must be informed of the total price or the method of calculating it, and of the applicable taxes, fees and additional costs, before being bound to the contract or before any additional work is carried out.",
                "Le client doit être informé du prix total ou de son mode de calcul, ainsi que des taxes, frais et coûts supplémentaires applicables, avant d’être lié par le contrat ou avant l’exécution de tout travail supplémentaire.",
                "Der Kunde muss über den Gesamtpreis oder die Art seiner Berechnung sowie über die anfallenden Steuern, Gebühren und Zusatzkosten informiert werden, bevor er vertraglich gebunden ist oder bevor zusätzliche Arbeiten ausgeführt werden.",
              )}
            </p>
            <p>
              {t(
                "If the scope of work changes after inspection, the change in price must be explained and the customer’s approval obtained before the additional work is carried out, unless a specific legal exception applies.",
                "Si l’étendue des travaux change après inspection, la modification du prix doit être expliquée et l’accord du client obtenu avant l’exécution des travaux supplémentaires, sauf exception légale spécifique.",
                "Ändert sich der Arbeitsumfang nach einer Besichtigung, muss die Preisänderung erläutert und die Zustimmung des Kunden eingeholt werden, bevor die zusätzlichen Arbeiten ausgeführt werden, sofern keine besondere gesetzliche Ausnahme greift.",
              )}
            </p>
            <p>
              {t(
                "Estimated prices are not final unless this is expressly stated in the quote.",
                "Les prix estimatifs ne sont pas définitifs, sauf mention expresse dans le devis.",
                "Geschätzte Preise sind nicht endgültig, es sei denn, dies ist im Kostenvoranschlag ausdrücklich angegeben.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">7</b>
                <span>{t("Payment and Invoices", "Paiement et factures", "Zahlung und Rechnungen")}</span>
              </span>
            </summary>
            <p>
              {t(
                "Available payment methods and their conditions are explained before the request is confirmed.",
                "Les modes de paiement disponibles et leurs conditions sont expliqués avant la confirmation de la demande.",
                "Die verfügbaren Zahlungsmethoden und ihre Bedingungen werden vor der Bestätigung der Anfrage erläutert.",
              )}
            </p>
            <p>
              {t(
                "If payment is made directly to the service provider, the payment method and invoice are subject to the agreement with them and to legal requirements.",
                "Si le paiement est effectué directement au prestataire, le mode de paiement et la facture dépendent de l’accord conclu avec lui et des exigences légales.",
                "Erfolgt die Zahlung direkt an den Dienstleister, richten sich Zahlungsweise und Rechnung nach der mit ihm getroffenen Vereinbarung und den gesetzlichen Anforderungen.",
              )}
            </p>
            <p>
              {t(
                "If LIVO collects payments, it must be made clear who receives the funds, any fees or commissions that apply, and the mechanism for issuing invoices and refunds.",
                "Si LIVO encaisse les paiements, il doit être clairement indiqué qui reçoit les fonds, les frais ou commissions éventuels, ainsi que le mécanisme d’émission des factures et de remboursement.",
                "Zieht LIVO Zahlungen ein, muss klar angegeben werden, wer die Gelder erhält, welche Gebühren oder Provisionen gegebenenfalls anfallen und nach welchem Verfahren Rechnungen ausgestellt und Erstattungen vorgenommen werden.",
              )}
            </p>
            <p>
              {t(
                "No party may ask for payment details or confidential information outside the approved payment channels.",
                "Aucune partie ne peut demander de données de paiement ou d’informations confidentielles en dehors des canaux de paiement approuvés.",
                "Keine Partei darf Zahlungsdaten oder vertrauliche Informationen außerhalb der zugelassenen Zahlungskanäle anfordern.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">8</b>
                <span>{t("Customer Obligations", "Obligations du client", "Pflichten des Kunden")}</span>
              </span>
            </summary>
            <p>{t("The customer undertakes to:", "Le client s’engage à :", "Der Kunde verpflichtet sich:")}</p>
            <ol>
              <li>
                {t(
                  "Provide accurate information about the request and the location.",
                  "Fournir des informations exactes sur la demande et le lieu.",
                  "Zutreffende Angaben zur Anfrage und zum Ort zu machen.",
                )}
              </li>
              <li>
                {t(
                  "Provide safe and reasonable access to the place where the service is to be carried out.",
                  "Donner un accès sûr et raisonnable au lieu où le service doit être réalisé.",
                  "Einen sicheren und angemessenen Zugang zu dem Ort zu gewähren, an dem die Dienstleistung erbracht werden soll.",
                )}
              </li>
              <li>
                {t(
                  "Inform the service provider of any risks or important circumstances relevant to the work.",
                  "Informer le prestataire de tout risque ou circonstance importante relatifs aux travaux.",
                  "Den Dienstleister über alle für die Arbeiten relevanten Risiken oder wesentlichen Umstände zu informieren.",
                )}
              </li>
              <li>
                {t(
                  "Respect the agreed appointments or request changes in advance.",
                  "Respecter les rendez-vous convenus ou demander les changements à l’avance.",
                  "Vereinbarte Termine einzuhalten oder Änderungen rechtzeitig im Voraus zu beantragen.",
                )}
              </li>
              <li>
                {t(
                  "Not use the platform for any fraudulent or unlawful purpose.",
                  "Ne pas utiliser la plateforme à des fins frauduleuses ou illicites.",
                  "Die Plattform nicht für betrügerische oder rechtswidrige Zwecke zu nutzen.",
                )}
              </li>
              <li>
                {t(
                  "Pay the amounts due for services that were agreed and carried out, in accordance with the law and the contract.",
                  "Payer les sommes dues pour les services convenus et réalisés, conformément à la loi et au contrat.",
                  "Die für vereinbarte und erbrachte Dienstleistungen fälligen Beträge gemäß Gesetz und Vertrag zu zahlen.",
                )}
              </li>
              <li>
                {t(
                  "Not provide misleading information or abuse service providers or platform staff.",
                  "Ne pas fournir d’informations trompeuses ni maltraiter les prestataires ou le personnel de la plateforme.",
                  "Keine irreführenden Angaben zu machen und Dienstleister oder das Personal der Plattform nicht zu beleidigen oder zu belästigen.",
                )}
              </li>
            </ol>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">9</b>
                <span>{t("Service Provider Obligations", "Obligations des prestataires", "Pflichten der Dienstleister")}</span>
              </span>
            </summary>
            <p>{t("Service providers are expected to:", "Les prestataires sont tenus de :", "Die Dienstleister sind gehalten:")}</p>
            <ul>
              <li>
                {t(
                  "Provide accurate information about their identity, experience and services.",
                  "Fournir des informations exactes sur leur identité, leur expérience et leurs services.",
                  "Zutreffende Angaben zu ihrer Identität, ihrer Erfahrung und ihren Dienstleistungen zu machen.",
                )}
              </li>
              <li>
                {t(
                  "Comply with the licences and professional qualifications required by law.",
                  "Respecter les licences et qualifications professionnelles exigées par la loi.",
                  "Die gesetzlich vorgeschriebenen Genehmigungen und beruflichen Qualifikationsanforderungen einzuhalten.",
                )}
              </li>
              <li>
                {t(
                  "Carry out the agreed work with care and professionalism.",
                  "Réaliser les travaux convenus avec soin et professionnalisme.",
                  "Die vereinbarten Arbeiten sorgfältig und fachgerecht auszuführen.",
                )}
              </li>
              <li>
                {t(
                  "Adhere to the agreed price, scope and date.",
                  "Respecter le prix, l’étendue et la date convenus.",
                  "Den vereinbarten Preis, Umfang und Termin einzuhalten.",
                )}
              </li>
              <li>
                {t(
                  "Respect customers’ privacy and property.",
                  "Respecter la vie privée et les biens des clients.",
                  "Die Privatsphäre und das Eigentum der Kunden zu respektieren.",
                )}
              </li>
              <li>
                {t(
                  "Comply with safety requirements and applicable laws.",
                  "Respecter les exigences de sécurité et les lois applicables.",
                  "Sicherheitsvorschriften und geltende Gesetze einzuhalten.",
                )}
              </li>
              <li>
                {t(
                  "Issue the invoices or documents required by law.",
                  "Émettre les factures ou documents exigés par la loi.",
                  "Die gesetzlich vorgeschriebenen Rechnungen oder Belege auszustellen.",
                )}
              </li>
              <li>
                {t(
                  "Not impose additional fees that are undisclosed or not legitimately agreed.",
                  "Ne pas imposer de frais supplémentaires non communiqués ou non légitimement convenus.",
                  "Keine zusätzlichen Gebühren zu erheben, die nicht offengelegt oder nicht rechtmäßig vereinbart wurden.",
                )}
              </li>
            </ul>
            <p>
              {t(
                "LIVO reserves the right to review the eligibility of service providers and to take appropriate action when it discovers incorrect information or violations.",
                "LIVO se réserve le droit de vérifier l’éligibilité des prestataires et de prendre les mesures appropriées lorsqu’elle découvre des informations inexactes ou des manquements.",
                "LIVO behält sich das Recht vor, die Eignung von Dienstleistern zu überprüfen und geeignete Maßnahmen zu ergreifen, wenn unzutreffende Angaben oder Verstöße festgestellt werden.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">10</b>
                <span>{t("Appointments and Delays", "Rendez-vous et retards", "Termine und Verzögerungen")}</span>
              </span>
            </summary>
            <p>
              {t(
                "Service appointments are set according to availability and operating conditions.",
                "Les rendez-vous de service sont fixés selon les disponibilités et les conditions d’exploitation.",
                "Termine für Dienstleistungen werden je nach Verfügbarkeit und betrieblichen Gegebenheiten festgelegt.",
              )}
            </p>
            <p>
              {t(
                "Appointments may be affected by factors beyond reasonable control, such as weather conditions, equipment failure, emergencies or unavailability of materials.",
                "Les rendez-vous peuvent être affectés par des facteurs échappant à un contrôle raisonnable, tels que les conditions météorologiques, une panne de matériel, des urgences ou l’indisponibilité de matériaux.",
                "Termine können durch Umstände beeinträchtigt werden, die außerhalb des zumutbaren Einflussbereichs liegen, etwa Witterungsbedingungen, Geräteausfälle, Notfälle oder fehlende Verfügbarkeit von Materialien.",
              )}
            </p>
            <p>
              {t(
                "In the event of an expected delay, the customer should be informed as soon as possible and an appropriate alternative date should be agreed.",
                "En cas de retard prévisible, le client doit en être informé dès que possible et une autre date appropriée doit être convenue.",
                "Bei einer absehbaren Verzögerung sollte der Kunde so bald wie möglich informiert und ein geeigneter Ersatztermin vereinbart werden.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">11</b>
                <span>{t("Cancellation and Rescheduling", "Annulation et report", "Stornierung und Terminverschiebung")}</span>
              </span>
            </summary>
            <p>
              {t(
                "The customer may request to cancel the service or change its date through the approved means of communication.",
                "Le client peut demander l’annulation du service ou le changement de sa date par les moyens de communication approuvés.",
                "Der Kunde kann über die zugelassenen Kommunikationswege die Stornierung der Dienstleistung oder eine Änderung des Termins beantragen.",
              )}
            </p>
            <p>
              {t(
                "The effects of cancellation, any potential fees and the refund policy are subject to what was explained before the request was confirmed, taking into account mandatory consumer rights, including any legal right of withdrawal from the contract or an exception that applies to the service.",
                "Les effets de l’annulation, les frais éventuels et la politique de remboursement dépendent de ce qui a été expliqué avant la confirmation de la demande, en tenant compte des droits impératifs des consommateurs, y compris tout droit légal de rétractation ou toute exception applicable au service.",
                "Die Folgen einer Stornierung, etwaige Gebühren und die Erstattungsregelung richten sich nach den vor der Bestätigung der Anfrage erteilten Informationen, unter Berücksichtigung zwingender Verbraucherrechte, einschließlich eines etwaigen gesetzlichen Widerrufsrechts oder einer für die Dienstleistung geltenden Ausnahme.",
              )}
            </p>
            <p>
              {t(
                "Undisclosed cancellation fees may not be applied, nor may conditions be imposed that diminish the user’s rights established by law.",
                "Des frais d’annulation non communiqués ne peuvent pas être appliqués, et il ne peut être imposé de conditions diminuant les droits de l’utilisateur établis par la loi.",
                "Nicht offengelegte Stornierungsgebühren dürfen nicht erhoben werden; ebenso wenig dürfen Bedingungen auferlegt werden, die die gesetzlichen Rechte des Nutzers schmälern.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">12</b>
                <span>{t("Complaints and Service Quality", "Réclamations et qualité de service", "Beschwerden und Servicequalität")}</span>
              </span>
            </summary>
            <p>
              {t(
                "If the service does not conform to what was agreed, the customer may contact LIVO through the support channels to lodge a complaint and provide details of the request and the problem.",
                "Si le service n’est pas conforme à ce qui avait été convenu, le client peut contacter LIVO via les canaux d’assistance pour déposer une réclamation et fournir les détails de la demande et du problème.",
                "Entspricht die Dienstleistung nicht dem Vereinbarten, kann der Kunde LIVO über die Supportkanäle kontaktieren, um eine Beschwerde einzureichen und Einzelheiten zur Anfrage und zum Problem mitzuteilen.",
              )}
            </p>
            <p>
              {t(
                "The complaint will be reviewed and an appropriate solution sought, according to LIVO’s role in the transaction and the nature of each party’s legal responsibility.",
                "La réclamation sera examinée et une solution appropriée recherchée, selon le rôle de LIVO dans la transaction et la nature de la responsabilité juridique de chaque partie.",
                "Die Beschwerde wird geprüft und eine angemessene Lösung angestrebt, entsprechend der Rolle von LIVO bei dem jeweiligen Vorgang und der Art der rechtlichen Verantwortung jeder Partei.",
              )}
            </p>
            <p>
              {t(
                "Lodging a complaint does not prevent the customer from exercising their legal rights before the competent authorities.",
                "Le dépôt d’une réclamation n’empêche pas le client d’exercer ses droits légaux devant les autorités compétentes.",
                "Die Einreichung einer Beschwerde hindert den Kunden nicht daran, seine gesetzlichen Rechte vor den zuständigen Behörden geltend zu machen.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">13</b>
                <span>{t("Safety and Emergencies", "Sécurité et urgences", "Sicherheit und Notfälle")}</span>
              </span>
            </summary>
            <p>
              {t(
                "LIVO is not a substitute for official emergency services.",
                "LIVO ne remplace pas les services d’urgence officiels.",
                "LIVO ist kein Ersatz für offizielle Notdienste.",
              )}
            </p>
            <p>
              {t(
                "In cases of immediate danger to life or property, the competent emergency services in Luxembourg must be contacted.",
                "En cas de danger immédiat pour les personnes ou les biens, il faut contacter les services d’urgence compétents au Luxembourg.",
                "Bei unmittelbarer Gefahr für Leben oder Eigentum sind die zuständigen Notdienste in Luxemburg zu verständigen.",
              )}
            </p>
            <p>
              {t(
                "It must not be assumed that all services are available around the clock or on holidays, unless this is expressly confirmed for the requested service.",
                "Il ne faut pas présumer que tous les services sont disponibles à toute heure ou les jours fériés, sauf confirmation expresse pour le service demandé.",
                "Es darf nicht davon ausgegangen werden, dass alle Dienstleistungen rund um die Uhr oder an Feiertagen verfügbar sind, sofern dies nicht für die angefragte Dienstleistung ausdrücklich bestätigt wurde.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">14</b>
                <span>{t("Limitation of Liability", "Limitation de responsabilité", "Haftungsbeschränkung")}</span>
              </span>
            </summary>
            <p>
              {t(
                "LIVO bears the responsibilities that the law imposes on it and those under the contracts to which it is a party.",
                "LIVO assume les responsabilités que la loi lui impose et celles découlant des contrats auxquels elle est partie.",
                "LIVO trägt die ihr gesetzlich auferlegte Verantwortung sowie die Verantwortung aus den Verträgen, bei denen LIVO Vertragspartei ist.",
              )}
            </p>
            <p>
              {t(
                "If LIVO is only an intermediary in a particular service, responsibility for carrying out that service is determined according to the role of the service provider, the terms of the contract and the applicable law.",
                "Si LIVO n’est qu’intermédiaire pour un service donné, la responsabilité de la réalisation de ce service est déterminée selon le rôle du prestataire, les termes du contrat et la loi applicable.",
                "Ist LIVO bei einer bestimmten Dienstleistung lediglich Vermittler, bestimmt sich die Verantwortung für die Erbringung dieser Dienstleistung nach der Rolle des Dienstleisters, den Vertragsbedingungen und dem geltenden Recht.",
              )}
            </p>
            <p>
              {t(
                "These terms are not intended to exclude or limit liability that cannot be excluded by law, mandatory consumer rights, or any right to compensation established by law.",
                "Les présentes conditions ne visent pas à exclure ou limiter une responsabilité qui ne peut l’être en droit, les droits impératifs des consommateurs ou tout droit à indemnisation établi par la loi.",
                "Diese Bedingungen sollen weder eine Haftung, die gesetzlich nicht ausgeschlossen werden kann, noch zwingende Verbraucherrechte oder gesetzlich begründete Ansprüche auf Schadensersatz ausschließen oder beschränken.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">15</b>
                <span>{t("Intellectual Property", "Propriété intellectuelle", "Geistiges Eigentum")}</span>
              </span>
            </summary>
            <p>
              {t(
                "Intellectual property rights relating to the website’s content, designs, trademarks, logos and digital elements belong to their rightful owners.",
                "Les droits de propriété intellectuelle relatifs au contenu, aux designs, aux marques, aux logos et aux éléments numériques du site appartiennent à leurs titulaires légitimes.",
                "Die Rechte des geistigen Eigentums an den Inhalten, Designs, Marken, Logos und digitalen Elementen der Website stehen ihren rechtmäßigen Inhabern zu.",
              )}
            </p>
            <p>
              {t(
                "Protected content may not be copied, republished or used for commercial purposes without appropriate permission, except to the extent permitted by law.",
                "Le contenu protégé ne peut être copié, republié ou utilisé à des fins commerciales sans autorisation appropriée, sauf dans la mesure permise par la loi.",
                "Geschützte Inhalte dürfen ohne entsprechende Genehmigung nicht kopiert, erneut veröffentlicht oder zu kommerziellen Zwecken genutzt werden, soweit dies nicht gesetzlich zulässig ist.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">16</b>
                <span>{t("Prohibited Use", "Utilisation interdite", "Unzulässige Nutzung")}</span>
              </span>
            </summary>
            <p>
              {t(
                "It is prohibited to use the website for:",
                "Il est interdit d’utiliser le site pour :",
                "Es ist untersagt, die Website für Folgendes zu nutzen:",
              )}
            </p>
            <ul>
              <li>
                {t(
                  "Any unlawful or fraudulent activity.",
                  "Toute activité illicite ou frauduleuse.",
                  "Jegliche rechtswidrige oder betrügerische Tätigkeit.",
                )}
              </li>
              <li>
                {t(
                  "Impersonating another person.",
                  "Usurper l’identité d’une autre personne.",
                  "Das Vortäuschen der Identität einer anderen Person.",
                )}
              </li>
              <li>
                {t(
                  "Deliberately submitting false data.",
                  "Soumettre délibérément de fausses données.",
                  "Die vorsätzliche Übermittlung falscher Daten.",
                )}
              </li>
              <li>
                {t(
                  "Attempting to hack or disrupt the website.",
                  "Tenter de pirater ou de perturber le site.",
                  "Versuche, die Website zu hacken oder zu stören.",
                )}
              </li>
              <li>
                {t(
                  "Misusing customer or service provider data.",
                  "Faire un usage abusif des données des clients ou des prestataires.",
                  "Die missbräuchliche Verwendung von Daten von Kunden oder Dienstleistern.",
                )}
              </li>
              <li>
                {t(
                  "Publishing content that violates the rights or privacy of others.",
                  "Publier un contenu portant atteinte aux droits ou à la vie privée d’autrui.",
                  "Die Veröffentlichung von Inhalten, die die Rechte oder die Privatsphäre Dritter verletzen.",
                )}
              </li>
            </ul>
            <p>
              {t(
                "Measures proportionate to the violation may be taken, including suspending or terminating access where there is a legitimate basis, without prejudice to the user’s legal rights.",
                "Des mesures proportionnées à la violation peuvent être prises, y compris la suspension ou la résiliation de l’accès lorsqu’il existe une base légitime, sans préjudice des droits légaux de l’utilisateur.",
                "Es können dem Verstoß angemessene Maßnahmen ergriffen werden, einschließlich der Sperrung oder Beendigung des Zugangs, sofern hierfür ein berechtigter Grund vorliegt, unbeschadet der gesetzlichen Rechte des Nutzers.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">17</b>
                <span>
                  {t("Suspension or Modification of Services", "Suspension ou modification des services", "Aussetzung oder Änderung der Dienste")}
                </span>
              </span>
            </summary>
            <p>
              {t(
                "LIVO may update the website, modify its features, add services or discontinue certain features for operational, technical or legal reasons.",
                "LIVO peut mettre à jour le site, modifier ses fonctionnalités, ajouter des services ou interrompre certaines fonctionnalités pour des raisons opérationnelles, techniques ou juridiques.",
                "LIVO kann die Website aktualisieren, ihre Funktionen ändern, Dienstleistungen hinzufügen oder bestimmte Funktionen aus betrieblichen, technischen oder rechtlichen Gründen einstellen.",
              )}
            </p>
            <p>
              {t(
                "These changes will not in themselves cancel existing contractual rights or obligations that must be respected under the law.",
                "Ces changements n’annulent pas en eux-mêmes les droits ou obligations contractuels existants qui doivent être respectés en vertu de la loi.",
                "Diese Änderungen heben für sich genommen keine bestehenden vertraglichen Rechte oder Pflichten auf, die nach dem Gesetz zu beachten sind.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">18</b>
                <span>{t("Force Majeure", "Force majeure", "Höhere Gewalt")}</span>
              </span>
            </summary>
            <p>
              {t(
                "No party is liable for delay or non-performance to the extent that it results directly from an event beyond reasonable control, and within the limits permitted by law.",
                "Aucune partie n’est responsable d’un retard ou d’une inexécution dans la mesure où ils résultent directement d’un événement échappant à un contrôle raisonnable, dans les limites permises par la loi.",
                "Keine Partei haftet für Verzögerungen oder Nichterfüllung, soweit diese unmittelbar auf ein Ereignis außerhalb ihres zumutbaren Einflussbereichs zurückzuführen sind, und nur im gesetzlich zulässigen Rahmen.",
              )}
            </p>
            <p>
              {t(
                "This clause does not relieve any party of obligations that continue by law despite the occurrence of the event.",
                "Cette clause ne dispense aucune partie des obligations qui subsistent en vertu de la loi malgré la survenance de l’événement.",
                "Diese Klausel entbindet keine Partei von Pflichten, die trotz des Eintritts des Ereignisses kraft Gesetzes fortbestehen.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">19</b>
                <span>
                  {t("Governing Law and Dispute Resolution", "Droit applicable et règlement des litiges", "Anwendbares Recht und Streitbeilegung")}
                </span>
              </span>
            </summary>
            <p>
              {t(
                "These terms are governed by the applicable laws of Luxembourg, subject to mandatory consumer protection rules and any other applicable legal rules.",
                "Les présentes conditions sont régies par les lois applicables du Luxembourg, sous réserve des règles impératives de protection des consommateurs et de toute autre règle légale applicable.",
                "Diese Bedingungen unterliegen dem geltenden luxemburgischen Recht, vorbehaltlich zwingender Verbraucherschutzvorschriften und sonstiger anwendbarer Rechtsvorschriften.",
              )}
            </p>
            <p>
              {t(
                "The parties may first try to settle disputes amicably. If that is not possible, recourse is to the competent courts in accordance with the law.",
                "Les parties peuvent d’abord tenter de régler les litiges à l’amiable. À défaut, il est fait recours aux tribunaux compétents conformément à la loi.",
                "Die Parteien können zunächst versuchen, Streitigkeiten gütlich beizulegen. Ist dies nicht möglich, sind die nach dem Gesetz zuständigen Gerichte anzurufen.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">20</b>
                <span>{t("Amendment of the Terms", "Modification des conditions", "Änderung der Bedingungen")}</span>
              </span>
            </summary>
            <p>
              {t(
                "These terms may be updated when needed. The amended version is published on the website with the last-updated date.",
                "Ces conditions peuvent être mises à jour si nécessaire. La version modifiée est publiée sur le site avec la date de dernière mise à jour.",
                "Diese Bedingungen können bei Bedarf aktualisiert werden. Die geänderte Fassung wird mit dem Datum der letzten Aktualisierung auf der Website veröffentlicht.",
              )}
            </p>
            <p>
              {t(
                "Amendments take effect in accordance with the law and may not be applied retroactively in a way that diminishes the user’s acquired rights.",
                "Les modifications prennent effet conformément à la loi et ne peuvent s’appliquer rétroactivement d’une manière qui diminue les droits acquis de l’utilisateur.",
                "Änderungen treten nach Maßgabe des Gesetzes in Kraft und dürfen nicht rückwirkend in einer Weise angewendet werden, die die erworbenen Rechte des Nutzers schmälert.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">21</b>
                <span>{t("Contact", "Contact", "Kontakt")}</span>
              </span>
            </summary>
            <p>
              {t(
                "For enquiries or complaints relating to these terms:",
                "Pour toute question ou réclamation relative aux présentes conditions :",
                "Für Fragen oder Beschwerden zu diesen Bedingungen:",
              )}
            </p>
            <ul>
              <li>{t("Email: livo.services.lu@gmail.com", "E-mail : livo.services.lu@gmail.com", "E-Mail: livo.services.lu@gmail.com")}</li>
              <li>{t("Phone: +352 661 111 353", "Téléphone : +352 661 111 353", "Telefon: +352 661 111 353")}</li>
              <li>
                {t(
                  "Service area: all of Luxembourg · bookings online only",
                  "Zone de service : tout le Luxembourg · réservation en ligne uniquement",
                  "Servicegebiet: ganz Luxemburg · Buchungen nur online",
                )}
              </li>
            </ul>
          </details>
        </div>
      </section>
    </>
  )
}
