import type { Metadata } from "next"
import Link from "next/link"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"

const TITLE = {
  en: "Cancellation & refund policy – LIVO",
  fr: "Politique d’annulation et de remboursement – LIVO",
  de: "Stornierung & Erstattung – LIVO",
}

export async function generateMetadata({ params }: PageProps<"/[lang]/refund">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/refund", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "LIVO cancellation and refund policy." })
}

export default async function RefundPage({ params }: PageProps<"/[lang]/refund">) {
  const { t, l } = await resolvePage(params)
  return (
    <>
      <section className="pgh">
        <div className="wrap">
          <div className="crumb">
            <Link href={l("/")}>LIVO</Link>
            {" / "}
            <span>{t("Refunds", "Remboursements", "Erstattungen")}</span>
          </div>
          <div className="sh">
            <span className="gh" aria-hidden="true">
              {t("Refunds", "Remboursement", "Erstattung")}
            </span>
            <div className="sh-in">
              <h1>{t("Cancellation & refund policy", "Politique d’annulation et de remboursement", "Stornierungs- und Erstattungsrichtlinie")}</h1>
              <p>
                {t(
                  "How cancellations, changes and refunds work.",
                  "Comment fonctionnent annulations, modifications et remboursements.",
                  "So funktionieren Stornierungen, Änderungen und Erstattungen.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ paddingTop: "20px" }}>
        <div className="wrap prose legal">
          <nav className="legal-nav" aria-label={t("Legal documents", "Documents juridiques", "Rechtliche Dokumente")}>
            <Link href={l("/privacy")}>{t("Privacy policy", "Politique de confidentialité", "Datenschutzerklärung")}</Link>
            <Link href={l("/terms")}>{t("Terms & conditions", "Conditions générales", "AGB")}</Link>
            <Link className="on" aria-current="page" href={l("/refund")}>
              {t("Cancellation & refunds", "Annulation et remboursement", "Stornierung & Erstattung")}
            </Link>
          </nav>
          <p className="legal-date">
            {t("Last updated: 3 November 2026", "Dernière mise à jour : 3 novembre 2026", "Zuletzt aktualisiert: 3. November 2026")}
          </p>
          <details open>
            <summary>
              <span>
                <b className="num2">1</b>
                <span>{t("Purpose", "Objet", "Zweck")}</span>
              </span>
            </summary>
            <p>
              {t(
                "This policy explains how requests to cancel services, change appointments and obtain refunds are handled for services requested through LIVO.",
                "La présente politique explique comment sont traitées les demandes d’annulation de services, de modification de rendez-vous et de remboursement pour les services demandés via LIVO.",
                "Diese Richtlinie erläutert, wie Anträge auf Stornierung von Dienstleistungen, auf Terminänderungen und auf Erstattungen für über LIVO angefragte Dienstleistungen bearbeitet werden.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">2</b>
                <span>
                  {t(
                    "Cancelling a Request Before Confirmation",
                    "Annulation d’une demande avant confirmation",
                    "Stornierung einer Anfrage vor der Bestätigung",
                  )}
                </span>
              </span>
            </summary>
            <p>
              {t(
                "If the customer has submitted a request that has not yet been confirmed, they can contact LIVO to withdraw it.",
                "Si le client a soumis une demande qui n’a pas encore été confirmée, il peut contacter LIVO pour la retirer.",
                "Hat der Kunde eine Anfrage übermittelt, die noch nicht bestätigt wurde, kann er sich an LIVO wenden, um sie zurückzuziehen.",
              )}
            </p>
            <p>
              {t(
                "If no amount has been collected, there is no paid amount to refund.",
                "Si aucune somme n’a été encaissée, il n’y a aucun montant payé à rembourser.",
                "Wurde kein Betrag eingezogen, gibt es keinen gezahlten Betrag, der zu erstatten wäre.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">3</b>
                <span>
                  {t(
                    "Cancellation After the Request Is Confirmed",
                    "Annulation après confirmation de la demande",
                    "Stornierung nach Bestätigung der Anfrage",
                  )}
                </span>
              </span>
            </summary>
            <p>
              {t(
                "The customer can request cancellation through the official communication channels.",
                "Le client peut demander l’annulation par les canaux de communication officiels.",
                "Der Kunde kann die Stornierung über die offiziellen Kommunikationskanäle beantragen.",
              )}
            </p>
            <p>
              {t(
                "The request is reviewed according to the stage of service delivery, the terms of the offer or contract, any legitimately agreed costs, and mandatory consumer rights.",
                "La demande est examinée selon l’état d’avancement du service, les termes de l’offre ou du contrat, les frais légitimement convenus et les droits impératifs des consommateurs.",
                "Der Antrag wird unter Berücksichtigung des Stands der Leistungserbringung, der Bedingungen des Angebots oder Vertrags, etwaiger rechtmäßig vereinbarter Kosten sowie zwingender Verbraucherrechte geprüft.",
              )}
            </p>
            <p>
              {t(
                "Any cancellation fees must be explained to the customer before contracting, and must not exceed what the law permits.",
                "Tout frais d’annulation doit être expliqué au client avant la conclusion du contrat et ne peut excéder ce que la loi permet.",
                "Etwaige Stornierungsgebühren müssen dem Kunden vor Vertragsschluss erläutert werden und dürfen das gesetzlich zulässige Maß nicht überschreiten.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">4</b>
                <span>{t("Changing the Appointment", "Modification du rendez-vous", "Änderung des Termins")}</span>
              </span>
            </summary>
            <p>
              {t(
                "An appointment change can be requested subject to the service provider’s availability.",
                "Un changement de rendez-vous peut être demandé sous réserve de la disponibilité du prestataire.",
                "Eine Terminänderung kann vorbehaltlich der Verfügbarkeit des Dienstleisters beantragt werden.",
              )}
            </p>
            <p>
              {t(
                "It is advisable to send the change request as soon as possible to reduce the likelihood of delays or of costs that may legitimately arise.",
                "Il est conseillé d’envoyer la demande de changement le plus tôt possible afin de réduire le risque de retards ou de frais pouvant légitimement survenir.",
                "Es empfiehlt sich, den Änderungsantrag so früh wie möglich zu stellen, um das Risiko von Verzögerungen oder von Kosten, die rechtmäßig entstehen können, zu verringern.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">5</b>
                <span>{t("If the Service Provider Cancels", "Si le prestataire annule", "Wenn der Dienstleister storniert")}</span>
              </span>
            </summary>
            <p>
              {t(
                "If the service provider is unable to carry out the request, LIVO works to inform the customer and help them find an alternative date or another service provider, where available.",
                "Si le prestataire ne peut pas réaliser la demande, LIVO s’efforce d’en informer le client et de l’aider à trouver une autre date ou un autre prestataire, lorsque c’est possible.",
                "Kann der Dienstleister die Anfrage nicht ausführen, bemüht sich LIVO, den Kunden darüber zu informieren und ihm, soweit möglich, bei der Suche nach einem anderen Termin oder einem anderen Dienstleister zu helfen.",
              )}
            </p>
            <p>
              {t(
                "If an amount has been collected for a service that was not carried out, the refund is processed in accordance with the contract, the payment method and the applicable law.",
                "Si une somme a été encaissée pour un service qui n’a pas été réalisé, le remboursement est traité conformément au contrat, au mode de paiement et à la loi applicable.",
                "Wurde für eine nicht erbrachte Dienstleistung ein Betrag eingezogen, erfolgt die Erstattung gemäß dem Vertrag, der Zahlungsmethode und dem geltenden Recht.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">6</b>
                <span>
                  {t(
                    "If the Service Is Not Carried Out as Agreed",
                    "Si le service n’est pas réalisé comme convenu",
                    "Wenn die Dienstleistung nicht wie vereinbart erbracht wird",
                  )}
                </span>
              </span>
            </summary>
            <p>
              {t(
                "The customer has the right to lodge a complaint and request a review of the case.",
                "Le client a le droit de déposer une réclamation et de demander l’examen du dossier.",
                "Der Kunde hat das Recht, eine Beschwerde einzureichen und eine Prüfung des Falls zu verlangen.",
              )}
            </p>
            <p>
              {t(
                "Appropriate solutions may include, depending on the circumstances and legal rights, redoing the affected part, correcting the problem, reducing the price, or refunding the amount due.",
                "Les solutions appropriées peuvent comprendre, selon les circonstances et les droits légaux, la reprise de la partie concernée, la correction du problème, une réduction du prix ou le remboursement du montant dû.",
                "Geeignete Abhilfen können je nach den Umständen und den gesetzlichen Rechten die erneute Ausführung des betroffenen Teils, die Behebung des Mangels, eine Minderung des Preises oder die Erstattung des geschuldeten Betrags umfassen.",
              )}
            </p>
            <p>
              {t(
                "This clause is not a waiver of any of the consumer’s legal rights.",
                "Cette clause ne constitue pas une renonciation à l’un des droits légaux du consommateur.",
                "Diese Klausel stellt keinen Verzicht auf gesetzliche Rechte des Verbrauchers dar.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">7</b>
                <span>{t("Statutory Right of Withdrawal", "Droit légal de rétractation", "Gesetzliches Widerrufsrecht")}</span>
              </span>
            </summary>
            <p>
              {t(
                "In some distance contracts, the consumer may have a right of withdrawal within the legal period, with exceptions and special conditions for certain services, including cases where the service begins at the consumer’s express request.",
                "Dans certains contrats à distance, le consommateur peut disposer d’un droit de rétractation dans le délai légal, avec des exceptions et des conditions particulières pour certains services, notamment lorsque le service commence à la demande expresse du consommateur.",
                "Bei bestimmten Fernabsatzverträgen kann dem Verbraucher innerhalb der gesetzlichen Frist ein Widerrufsrecht zustehen, wobei für bestimmte Dienstleistungen Ausnahmen und besondere Bedingungen gelten, unter anderem wenn mit der Dienstleistung auf ausdrücklichen Wunsch des Verbrauchers begonnen wird.",
              )}
            </p>
            <p>
              {t(
                "The applicable rights, procedures and exceptions are explained before the contract is concluded, in accordance with the applicable law in Luxembourg.",
                "Les droits, procédures et exceptions applicables sont expliqués avant la conclusion du contrat, conformément à la loi applicable au Luxembourg.",
                "Die geltenden Rechte, Verfahren und Ausnahmen werden vor Vertragsschluss gemäß dem in Luxemburg geltenden Recht erläutert.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">8</b>
                <span>{t("Refund Method and Timing", "Mode et délai de remboursement", "Art und Dauer der Erstattung")}</span>
              </span>
            </summary>
            <p>
              {t(
                "Amounts due, where a refund applies, are returned through the original payment method where possible, or by another method legitimately agreed.",
                "Les sommes dues, lorsqu’un remboursement s’applique, sont restituées par le mode de paiement initial lorsque c’est possible, ou par un autre moyen légitimement convenu.",
                "Fällige Beträge werden, sofern eine Erstattung erfolgt, nach Möglichkeit über die ursprüngliche Zahlungsmethode oder auf einem anderen rechtmäßig vereinbarten Weg zurückgezahlt.",
              )}
            </p>
            <p>
              {t(
                "The expected refund time is determined according to the payment method, the financial service provider and the applicable legal rules, and the customer is informed of any material delay.",
                "Le délai de remboursement prévu est déterminé selon le mode de paiement, le prestataire de services financiers et les règles légales applicables, et le client est informé de tout retard important.",
                "Die voraussichtliche Erstattungsdauer richtet sich nach der Zahlungsmethode, dem Finanzdienstleister und den geltenden gesetzlichen Vorschriften; der Kunde wird über jede wesentliche Verzögerung informiert.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">9</b>
                <span>{t("Requesting a Refund", "Demande de remboursement", "Beantragung einer Erstattung")}</span>
              </span>
            </summary>
            <p>{t("Please contact us at:", "Veuillez nous contacter à :", "Bitte kontaktieren Sie uns unter:")}</p>
            <ul>
              <li>{t("Email: livo.services.lu@gmail.com", "E-mail : livo.services.lu@gmail.com", "E-Mail: livo.services.lu@gmail.com")}</li>
              <li>{t("Phone: +352 661 111 353", "Téléphone : +352 661 111 353", "Telefon: +352 661 111 353")}</li>
            </ul>
            <p>
              {t(
                "Please state the order number, the date of the service, the reason for cancellation or the complaint, and any documents needed to verify the request.",
                "Veuillez indiquer le numéro de commande, la date du service, le motif de l’annulation ou de la réclamation, ainsi que tout document nécessaire pour vérifier la demande.",
                "Bitte geben Sie die Bestellnummer, das Datum der Dienstleistung, den Grund für die Stornierung bzw. die Beschwerde sowie alle zur Überprüfung des Antrags erforderlichen Unterlagen an.",
              )}
            </p>
          </details>
          <details open>
            <summary>
              <span>
                <b className="num2">10</b>
                <span>{t("General Provisions", "Dispositions générales", "Allgemeine Bestimmungen")}</span>
              </span>
            </summary>
            <p>
              {t(
                "This policy is to be read together with the Terms and Conditions and the Privacy Policy.",
                "La présente politique doit être lue conjointement avec les Conditions générales et la Politique de confidentialité.",
                "Diese Richtlinie ist in Verbindung mit den Allgemeinen Geschäftsbedingungen und der Datenschutzerklärung zu lesen.",
              )}
            </p>
            <p>
              {t(
                "If any clause conflicts with a mandatory right granted to the consumer, priority is given to the applicable legal right.",
                "Si une clause est contraire à un droit impératif accordé au consommateur, le droit légal applicable prévaut.",
                "Steht eine Klausel im Widerspruch zu einem zwingenden Recht, das dem Verbraucher zusteht, hat das geltende gesetzliche Recht Vorrang.",
              )}
            </p>
          </details>
        </div>
      </section>
    </>
  )
}
