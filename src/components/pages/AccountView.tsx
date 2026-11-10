"use client"

/**
 * Profile page (prototype: account.html + account.js): header, first-visit offer, professional
 * application, booking-chat requests, details form, password, delete account.
 * Data: Clerk session + GET/PATCH/DELETE /api/me, POST /api/me/photo, GET /api/me/bookings;
 * the password is changed on the Clerk account.
 */
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useEffect, useRef, type ChangeEvent } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { useChat } from "@/components/providers/chat-provider"
import { SiteForm } from "@/components/forms/SiteForm"
import { ServiceIcon } from "@/components/shared/ServiceIcon"
import { CONTACT } from "@/constants/site"
import { initials, useAccountActions, useSession, type BookingStatus, type SessionBooking, type SessionUser } from "@/hooks/use-session"
import { ApiError, formBody } from "@/lib/api-client"
import { getService } from "@/utils/services"

const STATUS: Record<BookingStatus, [string, string, string]> = {
  received: ["Received", "Reçue", "Eingegangen"],
  matched: ["Pro assigned", "Pro attribué", "Profi zugewiesen"],
  scheduled: ["Scheduled", "Planifiée", "Geplant"],
  done: ["Completed", "Terminée", "Abgeschlossen"],
  cancelled: ["Cancelled", "Annulée", "Storniert"],
}

export function AccountView() {
  const { lang, t, l, pick } = useLang()
  const router = useRouter()
  const { user, bookings, loaded, signedIn } = useSession()
  const { updateProfile, uploadPhoto, deleteAccount, signOut } = useAccountActions()
  const hadUser = useRef(false)

  // signed out (or never signed in) → leave the page
  useEffect(() => {
    if (!loaded) return
    if (signedIn) hadUser.current = true
    else router.replace(l(hadUser.current ? "/" : "/auth"))
  }, [loaded, signedIn, router, l])

  const day = (iso: string) => new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso))
  const tt = (k: BookingStatus) => t(...STATUS[k])

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (file && user) await uploadPhoto(file).catch(() => {})
  }

  const first = bookings[bookings.length - 1] // the oldest: the free first visit
  const byPhone = !!user && (user.role === "pro" || !user.email)
  const parts = (user?.name || "").split(" ")

  return (
    <>
      <section className="pgh">
        <div className="wrap">
          <div className="crumb">
            <Link href={l("/")}>LIVO</Link>
            {" / "}
            <span>{t("My profile", "Mon profil", "Mein Profil")}</span>
          </div>
          <div className="ach">
            <label className="ach-av" aria-label={t("Change photo", "Changer la photo", "Foto ändern")}>
              <span className="av-i">{user?.photo ? <img src={user.photo} alt="" /> : user ? initials(user) : null}</span>
              <input type="file" accept="image/*" hidden onChange={onPhoto} />
              <i aria-hidden="true">📷</i>
            </label>
            <div className="ach-t">
              <h1 className="acct-n">{user?.name}</h1>
              <p className="acct-e">{user?.email || user?.phone}</p>
              <span className="ach-s" id="a-since" hidden={!user?.since}>
                {user?.since ? `${t("Member since ", "Membre depuis le ", "Mitglied seit ")}${day(user.since)}` : null}
              </span>
            </div>
            <div className="ach-b">
              <button className="btn pk" type="button" data-chat="">
                {t("Request a service", "Demander un service", "Service anfragen")}
              </button>
              <button className="btn gh" type="button" onClick={() => signOut(l("/"))}>
                {t("Log out", "Déconnexion", "Abmelden")}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="wrap agrid">
          <div className="acol">
            <div className="aof" id="a-offer">
              {first ? (
                <>
                  <i aria-hidden="true">🎉</i>
                  <div>
                    <b>{t("Your free first visit is booked", "Votre première visite gratuite est réservée", "Ihr kostenloser erster Besuch ist gebucht")}</b>
                    <p>{`${t("Request ", "Demande ", "Anfrage ")}${first.ref}`}</p>
                  </div>
                </>
              ) : (
                <>
                  <i aria-hidden="true">🎁</i>
                  <div>
                    <b>{t("Your first visit is FREE", "Votre première visite est GRATUITE", "Ihr erster Besuch ist GRATIS")}</b>
                    <p>{t("Book any service and we take care of the first visit.", "Réservez un service, la première visite est pour nous.", "Buchen Sie einen Service, der erste Besuch geht auf uns.")}</p>
                  </div>
                  <button className="btn pk sm" type="button" data-chat="">
                    {t("Book now", "Réserver", "Jetzt buchen")}
                  </button>
                </>
              )}
            </div>
            <ProviderRequestCard user={user} day={day} />
            <div className="fcard">
              <h2>{t("My requests", "Mes demandes", "Meine Anfragen")}</h2>
              <p className="sub">{t("Follow what you asked for and how it is going.", "Suivez vos demandes et leur avancement.", "Verfolgen Sie Ihre Anfragen und deren Stand.")}</p>
              <div className="arqs" id="a-reqs">
                {bookings.length ? (
                  bookings.map((r, i) => <RequestRow key={`${r.ref}-${i}`} r={r} day={day} status={tt} pickName={pick} />)
                ) : (
                  <div className="arq-none">
                    <p>{t("You have no requests yet.", "Vous n’avez pas encore de demande.", "Sie haben noch keine Anfragen.")}</p>
                    <button className="btn pk sm" type="button" data-chat="">
                      {t("Request a service", "Demander un service", "Service anfragen")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="acol">
            <div className="fcard">
              <h2>{t("My details", "Mes informations", "Meine Daten")}</h2>
              <p className="sub">
                {t(
                  "We use these when you book, so the pro can reach you.",
                  "Nous les utilisons lors de vos réservations, pour que le pro puisse vous joindre.",
                  "Wir nutzen sie bei Ihren Buchungen, damit der Profi Sie erreichen kann.",
                )}
              </p>
              {/* remount with the saved values whenever the profile changes */}
              <SiteForm
                key={JSON.stringify(user ?? {})}
                className="fm g2"
                id="a-form"
                msgClassName="full"
                ok={["Your details are saved.", "Vos informations sont enregistrées.", "Ihre Daten sind gespeichert."]}
                action={async (form) => {
                  await updateProfile(formBody(form))
                  return false as const
                }}
              >
                <div className="fld">
                  <label htmlFor="a-f">
                    <span>{t("First name", "Prénom", "Vorname")}</span> <i>*</i>
                  </label>
                  <input id="a-f" name="first" required autoComplete="given-name" defaultValue={user?.first || parts[0] || ""} />
                </div>
                <div className="fld">
                  <label htmlFor="a-l">{t("Last name", "Nom", "Nachname")}</label>
                  <input id="a-l" name="last" autoComplete="family-name" defaultValue={user?.last ?? parts.slice(1).join(" ")} />
                </div>
                <div className="fld full">
                  <label htmlFor="a-e">
                    <span>{t("Email", "E-mail", "E-Mail")}</span> <i hidden={byPhone}>*</i>
                  </label>
                  <input id="a-e" name="email" type="email" required={!byPhone} autoComplete="email" defaultValue={user?.email ?? ""} />
                </div>
                <div className="fld full">
                  <label htmlFor="a-p">
                    <span>{t("Phone", "Téléphone", "Telefon")}</span> <i hidden={!byPhone}>*</i>
                  </label>
                  <input id="a-p" name="phone" type="tel" required={byPhone} autoComplete="tel" placeholder="+352 …" defaultValue={user?.phone ?? ""} />
                </div>
                <div className="fld">
                  <label htmlFor="a-ab">{t("Building number", "Numéro du bâtiment", "Hausnummer")}</label>
                  <input id="a-ab" name="address_building" autoComplete="off" defaultValue={user?.address_building ?? ""} />
                </div>
                <div className="fld">
                  <label htmlFor="a-as">{t("Street name", "Nom de la rue", "Straße")}</label>
                  <input id="a-as" name="address_street" autoComplete="address-line1" defaultValue={user?.address_street ?? ""} />
                </div>
                <div className="fld">
                  <label htmlFor="a-ap">{t("Postal code", "Code postal", "Postleitzahl")}</label>
                  <input id="a-ap" name="address_postcode" autoComplete="postal-code" defaultValue={user?.address_postcode ?? ""} />
                </div>
                <div className="fld">
                  <label htmlFor="a-c">{t("City / area", "Ville / zone", "Stadt / Gebiet")}</label>
                  <input id="a-c" name="city" autoComplete="address-level2" defaultValue={user?.city ?? ""} />
                </div>
                <div className="fld full">
                  <span className="lbl">{t("How should we contact you?", "Comment vous contacter ?", "Wie sollen wir Sie kontaktieren?")}</span>
                  <div className="pills">
                    {(
                      [
                        ["whatsapp", "WhatsApp"],
                        ["phone", t("Phone", "Téléphone", "Telefon")],
                        ["email", t("Email", "E-mail", "E-Mail")],
                      ] as const
                    ).map(([v, label]) => (
                      <label key={v}>
                        <input type="radio" name="contact" value={v} defaultChecked={user?.contact === v} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="full">
                  <button className="btn pk" type="submit" style={{ width: "100%" }}>
                    {t("Save my details", "Enregistrer", "Daten speichern")}
                  </button>
                </div>
              </SiteForm>
            </div>
            <div className="fcard">
              <h2>{t("Security & privacy", "Sécurité et confidentialité", "Sicherheit & Datenschutz")}</h2>
              <PasswordForm />
              <details className="asec">
                <summary>{t("Delete my account", "Supprimer mon compte", "Konto löschen")}</summary>
                <p>
                  {t(
                    "Your profile and your request history will be deleted. This cannot be undone.",
                    "Votre profil et l’historique de vos demandes seront supprimés. Cette action est définitive.",
                    "Ihr Profil und Ihr Anfrageverlauf werden gelöscht. Das kann nicht rückgängig gemacht werden.",
                  )}
                </p>
                <button
                  className="btn s adel"
                  type="button"
                  id="a-del"
                  onClick={() => {
                    deleteAccount().catch(() => {})
                  }}
                >
                  {t("Yes, delete my account", "Oui, supprimer mon compte", "Ja, mein Konto löschen")}
                </button>
              </details>
              <div className="alinks">
                <Link href={l("/privacy")}>{t("Privacy policy", "Politique de confidentialité", "Datenschutzerklärung")}</Link>
                <Link href={l("/terms")}>{t("Terms", "Conditions", "AGB")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/** "My application": the latest provider request of the account. */
function ProviderRequestCard({ user, day }: { user: SessionUser | null; day: (iso: string) => string }) {
  const { t, l, pick } = useLang()
  const app = user?.providerRequest
  const hidden = !user || (user.role !== "pro" && !app)
  const s = app ? getService(app.service) : undefined
  return (
    <div className="fcard" id="a-pro" hidden={hidden}>
      {!hidden && <h2>{t("My application", "Ma candidature", "Meine Bewerbung")}</h2>}
      {!hidden &&
        (app ? (
          <>
            <div className="arq-st received">{t(...STATUS.received)}</div>
            <p className="sub">
              {`${s ? `${pick(s.name)} · ` : ""}${day(app.at)}. ${t(
                "We will call you for a quick chat about your work.",
                "Nous vous appellerons pour un échange rapide sur votre métier.",
                "Wir rufen Sie für ein kurzes Gespräch über Ihre Arbeit an.",
              )}`}
            </p>
          </>
        ) : (
          <>
            <p className="sub">
              {t(
                "You have not applied yet. Fill in the form to start working with LIVO.",
                "Vous n’avez pas encore postulé. Remplissez le formulaire pour travailler avec LIVO.",
                "Sie haben sich noch nicht beworben. Füllen Sie das Formular aus, um mit LIVO zu arbeiten.",
              )}
            </p>
            <Link className="btn pk sm" href={l("/join#apply")}>
              {t("Apply now", "Postuler maintenant", "Jetzt bewerben")}
            </Link>
          </>
        ))}
    </div>
  )
}

function RequestRow({
  r,
  day,
  status,
  pickName,
}: {
  r: SessionBooking
  day: (iso: string) => string
  status: (k: BookingStatus) => string
  pickName: <T>(v: { en: T; fr?: T; de?: T }) => T
}) {
  const { t, l } = useLang()
  const { openChat } = useChat()
  const s = getService(r.serviceId)
  const st: BookingStatus = r.status in STATUS ? r.status : "received"
  const when = r.date === "ASAP" ? t("As soon as possible", "Dès que possible", "So bald wie möglich") : `${r.date ? day(r.date + "T12:00:00") : "—"}${r.time ? ` · ${r.time}` : ""}`
  const wa = `${CONTACT.whatsapp}?text=${encodeURIComponent(t("Hello LIVO, about my request ", "Bonjour LIVO, à propos de ma demande ", "Hallo LIVO, zu meiner Anfrage ") + r.ref)}`
  const review = `/review?${r.serviceId ? `service=${encodeURIComponent(r.serviceId)}&` : ""}ref=${encodeURIComponent(r.ref)}`
  return (
    <article className="arq">
      <i className="arq-i" aria-hidden="true">
        {s ? <ServiceIcon service={s} /> : "💬"}
      </i>
      <div className="arq-t">
        <h3>{s ? pickName(s.name) : r.service}</h3>
        <p>{when}</p>
        <small>{`${t("Ref. ", "Réf. ", "Ref. ")}${r.ref}`}</small>
      </div>
      <span className={`arq-st ${st}`}>{status(st)}</span>
      <div className="arq-b">
        {st === "done" && (
          <Link className="btn pk sm" href={l(review)}>
            {t("Rate the service", "Évaluer le service", "Service bewerten")}
          </Link>
        )}
        <button className="btn s sm" type="button" onClick={() => openChat(r.serviceId || { text: r.service })}>
          {t("Book again", "Réserver à nouveau", "Erneut buchen")}
        </button>
        <a className="btn s sm" href={wa} target="_blank" rel="noopener">
          WhatsApp
        </a>
      </div>
    </article>
  )
}

function PasswordForm() {
  const { t } = useLang()
  const { user } = useUser()
  const mismatch = t("The two passwords are different.", "Les deux mots de passe sont différents.", "Die beiden Passwörter sind verschieden.")
  const check = (form: HTMLFormElement) => {
    const p1 = form.elements.namedItem("password") as HTMLInputElement
    const p2 = form.elements.namedItem("confirm") as HTMLInputElement
    p2.setCustomValidity(p2.value === p1.value ? "" : mismatch)
  }
  return (
    <details className="asec">
      <summary>{t("Change my password", "Changer mon mot de passe", "Passwort ändern")}</summary>
      <SiteForm
        className="fm"
        id="a-pw"
        ok={["Your password was changed.", "Votre mot de passe a été modifié.", "Ihr Passwort wurde geändert."]}
        action={async (form) => {
          const v = (k: string) => (form.elements.namedItem(k) as HTMLInputElement).value
          try {
            await user?.updatePassword({ currentPassword: v("current"), newPassword: v("password"), signOutOfOtherSessions: true })
          } catch (e) {
            // Clerk explains what is wrong (wrong current password, too weak, found in a breach…)
            const ce = e as { errors?: { longMessage?: string; message?: string }[] }
            throw new ApiError(ce.errors?.[0]?.longMessage ?? ce.errors?.[0]?.message ?? "error", 400)
          }
        }}
        beforeValidate={check}
        onInput={(e) => check(e.currentTarget)}
      >
        <div className="fld">
          <label htmlFor="a-p0">
            <span>{t("Current password", "Mot de passe actuel", "Aktuelles Passwort")}</span> <i>*</i>
          </label>
          <input id="a-p0" name="current" type="password" required autoComplete="current-password" />
        </div>
        <div className="fld">
          <label htmlFor="a-p1">
            <span>{t("New password", "Nouveau mot de passe", "Neues Passwort")}</span> <i>*</i>
          </label>
          <input id="a-p1" name="password" type="password" required minLength={8} autoComplete="new-password" />
          <span className="hint">{t("At least 8 characters.", "Au moins 8 caractères.", "Mindestens 8 Zeichen.")}</span>
        </div>
        <div className="fld">
          <label htmlFor="a-p2">
            <span>{t("Repeat the new password", "Répétez le nouveau mot de passe", "Neues Passwort wiederholen")}</span> <i>*</i>
          </label>
          <input id="a-p2" name="confirm" type="password" required autoComplete="new-password" />
        </div>
        <button className="btn p" type="submit">
          {t("Change my password", "Changer mon mot de passe", "Passwort ändern")}
        </button>
      </SiteForm>
    </details>
  )
}
