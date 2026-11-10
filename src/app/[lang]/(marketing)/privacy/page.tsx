import type { Metadata } from "next"
import Link from "next/link"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"

const TITLE = { en: "Privacy policy – LIVO", fr: "Politique de confidentialité – LIVO", de: "Datenschutzerklärung – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/privacy", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "LIVO privacy policy." })
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { t, l } = await resolvePage(params)
  return (
    <>
      <section className="pgh">
        <div className="wrap">
          <div className="crumb">
            <Link href={l("/")}>LIVO</Link>
            {" / "}
            <span>{t("Privacy", "Confidentialité", "Datenschutz")}</span>
          </div>
          <div className="sh">
            <span className="gh" aria-hidden="true">
              {t("Privacy", "Données", "Datenschutz")}
            </span>
            <div className="sh-in">
              <h1>{t("Privacy policy", "Politique de confidentialité", "Datenschutzerklärung")}</h1>
              <p>
                {t(
                  "How LIVO handles your personal information.",
                  "Comment LIVO traite vos informations personnelles.",
                  "Wie LIVO mit Ihren personenbezogenen Daten umgeht.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ paddingTop: "20px" }}>
        <div className="wrap prose legal">
          <nav className="legal-nav" aria-label={t("Legal documents", "Documents juridiques", "Rechtliche Dokumente")}>
            <Link className="on" aria-current="page" href={l("/privacy")}>
              {t("Privacy policy", "Politique de confidentialité", "Datenschutzerklärung")}
            </Link>
            <Link href={l("/terms")}>{t("Terms & conditions", "Conditions générales", "AGB")}</Link>
            <Link href={l("/refund")}>{t("Cancellation & refunds", "Annulation et remboursement", "Stornierung & Erstattung")}</Link>
          </nav>
          <p className="legal-date">
            {t("Last updated: 3 November 2026", "Dernière mise à jour : 3 novembre 2026", "Zuletzt aktualisiert: 3. November 2026")}
          </p>
          <details open>
            <summary>
              <span>
                <b className="num2">1</b>
                <span>{t("Introduction", "Introduction", "Einleitung")}</span>
              </span>
            </summary>
            <p>
              {t(
                "LIVO respects the privacy of its users and is committed to protecting their personal data and handling it transparently and securely.",
                "LIVO respecte la vie privée de ses utilisateurs et s’engage à protéger leurs données personnelles et à les traiter de manière transparente et sécurisée.",
                "LIVO respektiert die Privatsphäre seiner Nutzer und verpflichtet sich, deren personenbezogene Daten zu schützen und transparent und sicher zu verarbeiten.",
              )}
            </p>
            <p>
              {t(
                "This Privacy Policy explains how personal information is collected, used, stored, shared and protected when you visit the LIVO website, use its services, contact us, or request any of the services available through the platform.",
                "La présente politique de confidentialité explique comment les informations personnelles sont collectées, utilisées, conservées, partagées et protégées lorsque vous visitez le site LIVO, utilisez ses services, nous contactez ou demandez l’un des services disponibles via la plateforme.",
                "Diese Datenschutzerklärung erläutert, wie personenbezogene Daten erhoben, verwendet, gespeichert, weitergegeben und geschützt werden, wenn Sie die Website von LIVO besuchen, ihre Dienste nutzen, mit uns Kontakt aufnehmen oder einen der über die Plattform verfügbaren Dienste anfordern.",
              )}
            </p>
            <p>
              {t(
                "By using the website, you acknowledge that you have read this policy. This does not replace any explicit consent that the law requires for the processing of certain data.",
                "En utilisant le site, vous reconnaissez avoir lu la présente politique. Cela ne remplace pas le consentement explicite que la loi exige pour le traitement de certaines données.",
                "Durch die Nutzung der Website bestätigen Sie, dass Sie diese Datenschutzerklärung gelesen haben. Dies ersetzt keine ausdrückliche Einwilligung, die gesetzlich für die Verarbeitung bestimmter Daten erforderlich ist.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">2</b>
                <span>{t("Who We Are", "Qui sommes-nous", "Wer wir sind")}</span>
              </span>
            </summary>
            <p>
              {t(
                "LIVO is a digital platform that aims to make it easier for customers to reach providers of home and everyday services in Luxembourg, including maintenance, repairs, cleaning, gardening, transport, delivery, furniture assembly, and other services available through the platform.",
                "LIVO est une plateforme numérique qui vise à faciliter l’accès des clients aux prestataires de services à domicile et du quotidien au Luxembourg, notamment l’entretien, les réparations, le nettoyage, le jardinage, le transport, la livraison, le montage de meubles et d’autres services disponibles via la plateforme.",
                "LIVO ist eine digitale Plattform, die Kunden den Zugang zu Dienstleistern für Leistungen rund um Haus und Alltag in Luxemburg erleichtern soll, darunter Wartung, Reparaturen, Reinigung, Gartenarbeit, Transport, Lieferung, Möbelmontage und weitere über die Plattform verfügbare Dienstleistungen.",
              )}
            </p>
            <p>{t("Data controller:", "Responsable du traitement :", "Verantwortlicher:")}</p>
            <ul>
              <li>{t("Controller: LIVO", "Responsable : LIVO", "Verantwortlicher: LIVO")}</li>
              <li>{t("Email: livo.services.lu@gmail.com", "E-mail : livo.services.lu@gmail.com", "E-Mail: livo.services.lu@gmail.com")}</li>
              <li>
                {t(
                  "Bookings: online only, across Luxembourg",
                  "Réservations : en ligne uniquement, dans tout le Luxembourg",
                  "Buchungen: ausschließlich online, in ganz Luxemburg",
                )}
              </li>
            </ul>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">3</b>
                <span>{t("Information We Collect", "Informations que nous collectons", "Welche Daten wir erheben")}</span>
              </span>
            </summary>
            <p>
              {t(
                "We may collect the following categories of data, depending on how you use the website:",
                "Nous pouvons collecter les catégories de données suivantes, selon la façon dont vous utilisez le site :",
                "Je nachdem, wie Sie die Website nutzen, können wir folgende Kategorien von Daten erheben:",
              )}
            </p>
            <h4>{t("A. Identification and contact data", "A. Données d’identification et de contact", "A. Identifikations- und Kontaktdaten")}</h4>
            <ul>
              <li>{t("Full name.", "Nom et prénom.", "Vollständiger Name.")}</li>
              <li>{t("Phone number.", "Numéro de téléphone.", "Telefonnummer.")}</li>
              <li>{t("Email address.", "Adresse e-mail.", "E-Mail-Adresse.")}</li>
              <li>{t("Service address.", "Adresse du service.", "Adresse der Leistungserbringung.")}</li>
              <li>
                {t(
                  "City or area within the service coverage.",
                  "Ville ou zone dans la couverture du service.",
                  "Ort oder Gebiet innerhalb des Servicegebiets.",
                )}
              </li>
            </ul>
            <h4>{t("B. Service request data", "B. Données relatives à la demande de service", "B. Daten zur Dienstleistungsanfrage")}</h4>
            <ul>
              <li>{t("Type of service requested.", "Type de service demandé.", "Art der angefragten Dienstleistung.")}</li>
              <li>
                {t("Description of the problem or task.", "Description du problème ou de la tâche.", "Beschreibung des Problems oder der Aufgabe.")}
              </li>
              <li>
                {t(
                  "Photos or files sent by the user to clarify the request.",
                  "Photos ou fichiers envoyés par l’utilisateur pour préciser la demande.",
                  "Fotos oder Dateien, die der Nutzer zur Erläuterung der Anfrage übermittelt.",
                )}
              </li>
              <li>
                {t(
                  "Preferred date for carrying out the service.",
                  "Date souhaitée pour la réalisation du service.",
                  "Gewünschter Termin für die Ausführung der Dienstleistung.",
                )}
              </li>
              <li>
                {t("Contact details related to the request.", "Coordonnées liées à la demande.", "Kontaktdaten im Zusammenhang mit der Anfrage.")}
              </li>
              <li>
                {t(
                  "Quotes, invoices and order history, where they exist.",
                  "Devis, factures et historique des commandes, lorsqu’ils existent.",
                  "Angebote, Rechnungen und Auftragshistorie, sofern vorhanden.",
                )}
              </li>
            </ul>
            <h4>{t("C. Service provider data", "C. Données des prestataires de services", "C. Daten von Dienstleistern")}</h4>
            <p>
              {t(
                "If LIVO allows service providers to register, the data may include the business name, contact details, services offered, professional documents needed to verify eligibility, and any other data legitimately required.",
                "Si LIVO permet aux prestataires de s’inscrire, les données peuvent inclure la raison sociale, les coordonnées, les services proposés, les documents professionnels nécessaires pour vérifier l’éligibilité et toute autre donnée légitimement requise.",
                "Sofern LIVO Dienstleistern die Registrierung ermöglicht, können die Daten den Firmennamen, Kontaktdaten, angebotene Leistungen, zur Prüfung der Eignung erforderliche berufliche Nachweise sowie sonstige rechtmäßig erforderliche Daten umfassen.",
              )}
            </p>
            <h4>{t("D. Technical data", "D. Données techniques", "D. Technische Daten")}</h4>
            <p>
              {t(
                "We may collect the Internet Protocol (IP) address, device and browser type, usage data, error logs, and information necessary to operate and secure the website.",
                "Nous pouvons collecter l’adresse IP (Internet Protocol), le type d’appareil et de navigateur, les données d’utilisation, les journaux d’erreurs et les informations nécessaires au fonctionnement et à la sécurité du site.",
                "Wir können die IP-Adresse (Internet Protocol), Geräte- und Browsertyp, Nutzungsdaten, Fehlerprotokolle sowie Informationen erheben, die für den Betrieb und die Sicherheit der Website erforderlich sind.",
              )}
            </p>
            <h4>{t("E. Payment data", "E. Données de paiement", "E. Zahlungsdaten")}</h4>
            <p>
              {t(
                "Where a service is paid for, the amount, the payment status and the related invoice details may be processed.",
                "Lorsqu’un service est payant, le montant, le statut du paiement et les données de facturation correspondantes peuvent être traités.",
                "Ist eine Dienstleistung kostenpflichtig, können der Betrag, der Zahlungsstatus und die zugehörigen Rechnungsdaten verarbeitet werden.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">4</b>
                <span>{t("Why We Use Your Data", "Pourquoi nous utilisons vos données", "Wofür wir Ihre Daten verwenden")}</span>
              </span>
            </summary>
            <p>
              {t(
                "We use data for the following purposes:",
                "Nous utilisons les données aux fins suivantes :",
                "Wir verwenden Daten für folgende Zwecke:",
              )}
            </p>
            <ol>
              <li>
                {t(
                  "Receiving and managing service requests.",
                  "Recevoir et gérer les demandes de service.",
                  "Entgegennahme und Verwaltung von Dienstleistungsanfragen.",
                )}
              </li>
              <li>
                {t(
                  "Contacting customers to clarify request details.",
                  "Contacter les clients pour clarifier les détails de leur demande.",
                  "Kontaktaufnahme mit Kunden zur Klärung von Einzelheiten der Anfrage.",
                )}
              </li>
              <li>
                {t(
                  "Connecting the customer with a suitable service provider, where this is part of LIVO’s operating model.",
                  "Mettre le client en relation avec un prestataire approprié, lorsque cela fait partie du modèle de fonctionnement de LIVO.",
                  "Vermittlung des Kunden an einen geeigneten Dienstleister, sofern dies Teil des Geschäftsmodells von LIVO ist.",
                )}
              </li>
              <li>
                {t(
                  "Preparing quotes and invoices and confirming appointments.",
                  "Préparer les devis et les factures et confirmer les rendez-vous.",
                  "Erstellung von Angeboten und Rechnungen sowie Bestätigung von Terminen.",
                )}
              </li>
              <li>
                {t(
                  "Sending order updates and operational notifications.",
                  "Envoyer des informations sur les commandes et des notifications opérationnelles.",
                  "Versand von Auftragsaktualisierungen und betrieblichen Benachrichtigungen.",
                )}
              </li>
              <li>
                {t(
                  "Providing technical support and customer service and handling complaints.",
                  "Fournir une assistance technique et un service client et traiter les réclamations.",
                  "Bereitstellung von technischem Support und Kundenservice sowie Bearbeitung von Beschwerden.",
                )}
              </li>
              <li>
                {t(
                  "Protecting the platform from fraud and unlawful requests.",
                  "Protéger la plateforme contre la fraude et les demandes illicites.",
                  "Schutz der Plattform vor Betrug und rechtswidrigen Anfragen.",
                )}
              </li>
              <li>
                {t(
                  "Improving the quality of the website, the services and the user experience.",
                  "Améliorer la qualité du site, des services et de l’expérience utilisateur.",
                  "Verbesserung der Qualität der Website, der Dienstleistungen und des Nutzererlebnisses.",
                )}
              </li>
              <li>
                {t(
                  "Meeting legal and accounting obligations.",
                  "Respecter les obligations légales et comptables.",
                  "Erfüllung gesetzlicher und buchhalterischer Pflichten.",
                )}
              </li>
              <li>
                {t(
                  "Sending marketing offers where there is an appropriate legal basis, and obtaining consent where the law requires it.",
                  "Envoyer des offres commerciales lorsqu’il existe une base juridique appropriée, et obtenir le consentement lorsque la loi l’exige.",
                  "Versand von Werbeangeboten, sofern eine geeignete Rechtsgrundlage besteht, und Einholung der Einwilligung, soweit dies gesetzlich vorgeschrieben ist.",
                )}
              </li>
            </ol>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">5</b>
                <span>{t("Legal Basis for Processing", "Base juridique du traitement", "Rechtsgrundlage der Verarbeitung")}</span>
              </span>
            </summary>
            <p>
              {t(
                "Data is processed on the legal basis appropriate to each purpose, which may include:",
                "Les données sont traitées sur la base juridique adaptée à chaque finalité, qui peut inclure :",
                "Die Daten werden auf der für den jeweiligen Zweck geeigneten Rechtsgrundlage verarbeitet; hierzu können gehören:",
              )}
            </p>
            <ul>
              <li>
                {t(
                  "Performing a contract with the user or taking steps at their request before entering into a contract.",
                  "L’exécution d’un contrat avec l’utilisateur ou de mesures précontractuelles prises à sa demande.",
                  "Die Erfüllung eines Vertrags mit dem Nutzer oder die Durchführung vorvertraglicher Maßnahmen auf dessen Anfrage.",
                )}
              </li>
              <li>
                {t("Complying with a legal obligation.", "Le respect d’une obligation légale.", "Die Erfüllung einer rechtlichen Verpflichtung.")}
              </li>
              <li>
                {t(
                  "The legitimate interests of the platform, where they do not override the rights and freedoms of the user.",
                  "Les intérêts légitimes de la plateforme, lorsqu’ils ne prévalent pas sur les droits et libertés de l’utilisateur.",
                  "Die berechtigten Interessen der Plattform, sofern nicht die Rechte und Freiheiten des Nutzers überwiegen.",
                )}
              </li>
              <li>
                {t(
                  "The user’s consent, where consent is the required legal basis.",
                  "Le consentement de l’utilisateur, lorsque celui-ci est la base juridique requise.",
                  "Die Einwilligung des Nutzers, sofern die Einwilligung die erforderliche Rechtsgrundlage ist.",
                )}
              </li>
            </ul>
            <p>
              {t(
                "The user may withdraw their consent at any time where processing is based on it, without affecting the lawfulness of processing carried out before withdrawal.",
                "L’utilisateur peut retirer son consentement à tout moment lorsque le traitement est fondé sur celui-ci, sans affecter la licéité du traitement effectué avant le retrait.",
                "Der Nutzer kann seine Einwilligung jederzeit widerrufen, soweit die Verarbeitung auf ihr beruht, ohne dass die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung berührt wird.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">6</b>
                <span>{t("Sharing Data with Third Parties", "Partage des données avec des tiers", "Weitergabe von Daten an Dritte")}</span>
              </span>
            </summary>
            <p>
              {t(
                "Some data may be shared, to the extent necessary, with:",
                "Certaines données peuvent être partagées, dans la mesure nécessaire, avec :",
                "Bestimmte Daten können, soweit erforderlich, weitergegeben werden an:",
              )}
            </p>
            <ul>
              <li>
                {t(
                  "Service providers assigned to carry out the user’s request.",
                  "Les prestataires chargés de réaliser la demande de l’utilisateur.",
                  "Dienstleister, die mit der Ausführung der Anfrage des Nutzers beauftragt sind.",
                )}
              </li>
              <li>
                {t(
                  "Hosting, storage and technical infrastructure providers.",
                  "Les fournisseurs d’hébergement, de stockage et d’infrastructure technique.",
                  "Anbieter von Hosting, Speicherplatz und technischer Infrastruktur.",
                )}
              </li>
              <li>
                {t(
                  "Payment service providers, if any.",
                  "Les prestataires de services de paiement, le cas échéant.",
                  "Zahlungsdienstleister, sofern vorhanden.",
                )}
              </li>
              <li>
                {t(
                  "Email, messaging and notification service providers.",
                  "Les fournisseurs de services d’e-mail, de messagerie et de notification.",
                  "Anbieter von E-Mail-, Messaging- und Benachrichtigungsdiensten.",
                )}
              </li>
              <li>
                {t(
                  "Professional advisers and accounting service providers where needed.",
                  "Les conseillers professionnels et prestataires comptables, si nécessaire.",
                  "Externe Fachberater und Buchhaltungsdienstleister, soweit erforderlich.",
                )}
              </li>
              <li>
                {t(
                  "Competent official authorities where the law requires.",
                  "Les autorités officielles compétentes lorsque la loi l’exige.",
                  "Zuständige Behörden, soweit gesetzlich vorgeschrieben.",
                )}
              </li>
            </ul>
            <p>
              {t(
                "User data may not be used for separate purposes that are incompatible with the stated purposes without an appropriate legal basis.",
                "Les données de l’utilisateur ne peuvent pas être utilisées à d’autres fins incompatibles avec les finalités indiquées sans base juridique appropriée.",
                "Nutzerdaten dürfen ohne geeignete Rechtsgrundlage nicht für andere Zwecke verwendet werden, die mit den angegebenen Zwecken unvereinbar sind.",
              )}
            </p>
            <p>
              {t(
                "LIVO must define the roles of the parties that receive data and the contractual obligations appropriate to protect it.",
                "LIVO doit définir les rôles des parties qui reçoivent les données et les obligations contractuelles appropriées pour les protéger.",
                "LIVO muss die Rollen der Parteien, die Daten erhalten, sowie die zu deren Schutz geeigneten vertraglichen Verpflichtungen festlegen.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">7</b>
                <span>
                  {t(
                    "Transfers of Data Outside the European Economic Area",
                    "Transferts de données hors de l’Espace économique européen",
                    "Übermittlung von Daten in Länder außerhalb des Europäischen Wirtschaftsraums",
                  )}
                </span>
              </span>
            </summary>
            <p>
              {t(
                "If operating the website requires transferring personal data to a country outside the European Economic Area, this will be done in accordance with GDPR requirements, using an appropriate legal transfer mechanism and the required safeguards, where applicable.",
                "Si l’exploitation du site nécessite de transférer des données personnelles vers un pays situé hors de l’Espace économique européen, cela se fera conformément aux exigences du RGPD, au moyen d’un mécanisme de transfert juridique approprié et des garanties requises, le cas échéant.",
                "Sofern der Betrieb der Website die Übermittlung personenbezogener Daten in ein Land außerhalb des Europäischen Wirtschaftsraums erfordert, erfolgt diese gemäß den Anforderungen der DSGVO unter Verwendung eines geeigneten rechtlichen Übermittlungsmechanismus und gegebenenfalls der erforderlichen Garantien.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">8</b>
                <span>{t("Data Retention", "Conservation des données", "Speicherdauer")}</span>
              </span>
            </summary>
            <p>
              {t(
                "We keep data for as long as necessary to achieve the purpose for which it was collected, taking into account legal and accounting obligations, dispute resolution requirements, and the protection of legal rights.",
                "Nous conservons les données aussi longtemps que nécessaire pour atteindre la finalité pour laquelle elles ont été collectées, en tenant compte des obligations légales et comptables, des exigences de règlement des litiges et de la protection des droits.",
                "Wir speichern Daten so lange, wie es zur Erreichung des Zwecks, für den sie erhoben wurden, erforderlich ist, unter Berücksichtigung gesetzlicher und buchhalterischer Pflichten, der Erfordernisse der Streitbeilegung sowie des Schutzes von Rechtsansprüchen.",
              )}
            </p>
            <p>
              {t(
                "Data is deleted or anonymised when there is no longer a legitimate need to keep it, unless the law requires it to be kept for a longer period.",
                "Les données sont supprimées ou anonymisées lorsqu’il n’existe plus de besoin légitime de les conserver, sauf si la loi exige une conservation plus longue.",
                "Daten werden gelöscht oder anonymisiert, sobald kein berechtigter Bedarf an ihrer Speicherung mehr besteht, es sei denn, das Gesetz schreibt eine längere Aufbewahrung vor.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">9</b>
                <span>{t("Data Security", "Sécurité des données", "Datensicherheit")}</span>
              </span>
            </summary>
            <p>
              {t(
                "LIVO takes appropriate technical and organisational measures to protect data against unauthorised access, loss, alteration or unlawful disclosure.",
                "LIVO prend des mesures techniques et organisationnelles appropriées pour protéger les données contre l’accès non autorisé, la perte, l’altération ou la divulgation illicite.",
                "LIVO trifft geeignete technische und organisatorische Maßnahmen, um Daten vor unbefugtem Zugriff, Verlust, Veränderung oder unrechtmäßiger Offenlegung zu schützen.",
              )}
            </p>
            <p>
              {t(
                "However, absolute security cannot be guaranteed for any system connected to the internet.",
                "Toutefois, une sécurité absolue ne peut être garantie pour aucun système connecté à Internet.",
                "Eine absolute Sicherheit kann jedoch für kein mit dem Internet verbundenes System garantiert werden.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">10</b>
                <span>{t("User Rights", "Droits des utilisateurs", "Rechte der Nutzer")}</span>
              </span>
            </summary>
            <p>
              {t(
                "Subject to the conditions and exceptions set out in the law, the user may have the right to:",
                "Sous réserve des conditions et exceptions prévues par la loi, l’utilisateur peut avoir le droit de :",
                "Vorbehaltlich der gesetzlich vorgesehenen Bedingungen und Ausnahmen können dem Nutzer folgende Rechte zustehen:",
              )}
            </p>
            <ul>
              <li>
                {t(
                  "Know how their data is used.",
                  "Savoir comment ses données sont utilisées.",
                  "Information darüber, wie seine Daten verwendet werden.",
                )}
              </li>
              <li>
                {t(
                  "Request access to their data and obtain a copy.",
                  "Demander l’accès à ses données et en obtenir une copie.",
                  "Auskunft über seine Daten und Erhalt einer Kopie davon.",
                )}
              </li>
              <li>{t("Correct inaccurate data.", "Faire rectifier les données inexactes.", "Berichtigung unrichtiger Daten.")}</li>
              <li>
                {t(
                  "Request deletion of data in the cases the law permits.",
                  "Demander l’effacement de ses données dans les cas prévus par la loi.",
                  "Löschung von Daten in den gesetzlich zulässigen Fällen.",
                )}
              </li>
              <li>
                {t(
                  "Request restriction of processing in certain cases.",
                  "Demander la limitation du traitement dans certains cas.",
                  "Einschränkung der Verarbeitung in bestimmten Fällen.",
                )}
              </li>
              <li>
                {t(
                  "Object to certain processing operations.",
                  "S’opposer à certains traitements.",
                  "Widerspruch gegen bestimmte Verarbeitungsvorgänge.",
                )}
              </li>
              <li>
                {t(
                  "Request data portability where the legal right applies.",
                  "Demander la portabilité des données lorsque ce droit s’applique.",
                  "Datenübertragbarkeit, sofern dieses Recht gesetzlich besteht.",
                )}
              </li>
              <li>
                {t(
                  "Withdraw consent where processing is based on it.",
                  "Retirer son consentement lorsque le traitement est fondé sur celui-ci.",
                  "Widerruf der Einwilligung, soweit die Verarbeitung auf ihr beruht.",
                )}
              </li>
              <li>
                {t(
                  "Lodge a complaint with the competent data protection authority.",
                  "Introduire une réclamation auprès de l’autorité de protection des données compétente.",
                  "Beschwerde bei der zuständigen Datenschutzaufsichtsbehörde.",
                )}
              </li>
            </ul>
            <p>
              {t(
                "To exercise these rights, you can contact us at: livo.services.lu@gmail.com.",
                "Pour exercer ces droits, vous pouvez nous contacter à : livo.services.lu@gmail.com.",
                "Zur Ausübung dieser Rechte können Sie uns kontaktieren unter: livo.services.lu@gmail.com.",
              )}
            </p>
            <p>
              {t(
                "Requests will be handled within the applicable legal time limits and requirements.",
                "Les demandes seront traitées dans les délais et selon les exigences légales applicables.",
                "Anfragen werden innerhalb der geltenden gesetzlichen Fristen und gemäß den gesetzlichen Anforderungen bearbeitet.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">11</b>
                <span>{t("Cookies", "Cookies", "Cookies")}</span>
              </span>
            </summary>
            <p>
              {t(
                "The website may use cookies and similar technologies to operate its essential functions, analyse usage, and improve performance.",
                "Le site peut utiliser des cookies et des technologies similaires pour assurer ses fonctions essentielles, analyser l’utilisation et améliorer ses performances.",
                "Die Website kann Cookies und ähnliche Technologien einsetzen, um ihre wesentlichen Funktionen bereitzustellen, die Nutzung zu analysieren und die Leistung zu verbessern.",
              )}
            </p>
            <p>
              {t(
                "Non-essential cookies that require prior consent will not be activated before the required consent is obtained. The user can manage their preferences through the cookie settings tool available on the website.",
                "Les cookies non essentiels nécessitant un consentement préalable ne seront pas activés avant l’obtention du consentement requis. L’utilisateur peut gérer ses préférences via l’outil de paramétrage des cookies disponible sur le site.",
                "Nicht notwendige Cookies, die eine vorherige Einwilligung erfordern, werden erst aktiviert, nachdem die erforderliche Einwilligung eingeholt wurde. Der Nutzer kann seine Präferenzen über das auf der Website verfügbare Tool für Cookie-Einstellungen verwalten.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">12</b>
                <span>{t("Children’s Privacy", "Protection des mineurs", "Datenschutz von Kindern")}</span>
              </span>
            </summary>
            <p>
              {t(
                "LIVO’s services are directed at users who are legally capable of entering into the relevant transactions. The platform does not intentionally collect children’s data without the required legal basis and consents.",
                "Les services de LIVO s’adressent à des utilisateurs juridiquement capables de conclure les transactions concernées. La plateforme ne collecte pas intentionnellement de données d’enfants sans la base juridique et les consentements requis.",
                "Die Dienste von LIVO richten sich an Nutzer, die zum Abschluss der betreffenden Rechtsgeschäfte rechtlich befähigt sind. Die Plattform erhebt nicht wissentlich Daten von Kindern ohne die erforderliche Rechtsgrundlage und die erforderlichen Einwilligungen.",
              )}
            </p>
            <p>
              {t(
                "If we learn that a child’s data has been collected unlawfully, we will take appropriate steps to address it in accordance with the law.",
                "Si nous apprenons que les données d’un enfant ont été collectées de manière illicite, nous prendrons les mesures appropriées conformément à la loi.",
                "Erfahren wir, dass Daten eines Kindes unrechtmäßig erhoben wurden, ergreifen wir gemäß den gesetzlichen Bestimmungen geeignete Maßnahmen.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">13</b>
                <span>{t("External Links", "Liens externes", "Externe Links")}</span>
              </span>
            </summary>
            <p>
              {t(
                "The website may contain links to external websites or services. Those sites are subject to their own privacy policies, and LIVO is not responsible for the privacy practices of independent third parties.",
                "Le site peut contenir des liens vers des sites ou services externes. Ces sites sont soumis à leurs propres politiques de confidentialité, et LIVO n’est pas responsable des pratiques de tiers indépendants en matière de vie privée.",
                "Die Website kann Links zu externen Websites oder Diensten enthalten. Diese Websites unterliegen ihren eigenen Datenschutzerklärungen, und LIVO ist nicht für die Datenschutzpraktiken unabhängiger Dritter verantwortlich.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">14</b>
                <span>{t("Changes to This Policy", "Modifications de la présente politique", "Änderungen dieser Datenschutzerklärung")}</span>
              </span>
            </summary>
            <p>
              {t(
                "This policy may be updated when services, data processing methods or legal requirements change. The amended version will be published with an updated revision date.",
                "Cette politique peut être mise à jour lorsque les services, les méthodes de traitement des données ou les exigences légales évoluent. La version modifiée sera publiée avec une date de révision mise à jour.",
                "Diese Datenschutzerklärung kann aktualisiert werden, wenn sich die Dienstleistungen, die Methoden der Datenverarbeitung oder die gesetzlichen Anforderungen ändern. Die geänderte Fassung wird mit aktualisiertem Datum der letzten Änderung veröffentlicht.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">15</b>
                <span>{t("Contact and Complaints", "Contact et réclamations", "Kontakt und Beschwerden")}</span>
              </span>
            </summary>
            <p>
              {t(
                "For privacy enquiries or to exercise your rights, contact us at:",
                "Pour toute question relative à la vie privée ou pour exercer vos droits, contactez-nous à :",
                "Für Anfragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns unter:",
              )}
            </p>
            <p>{t("Email: livo.services.lu@gmail.com", "E-mail : livo.services.lu@gmail.com", "E-Mail: livo.services.lu@gmail.com")}</p>
            <p>
              {t(
                "If you believe that the processing of your data violates the law, you may lodge a complaint with the competent data protection authority in Luxembourg (CNPD), in accordance with the applicable procedures.",
                "Si vous estimez que le traitement de vos données enfreint la loi, vous pouvez introduire une réclamation auprès de l’autorité de protection des données compétente au Luxembourg (CNPD), conformément aux procédures applicables.",
                "Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen geltendes Recht verstößt, können Sie gemäß den geltenden Verfahren eine Beschwerde bei der zuständigen Datenschutzbehörde in Luxemburg (CNPD) einreichen.",
              )}
            </p>
          </details>
        </div>
      </section>
    </>
  )
}
