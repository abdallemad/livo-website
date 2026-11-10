"use client"

/**
 * Log in / sign up (prototype: auth.html + pages.js auth tabs, social buttons, pro sign-up),
 * built with Clerk Elements so the page keeps the design's exact markup and classes.
 * See docs/auth.md.
 *
 * - Sign-in: <SignIn.Root path="/<lang>/auth">, sign-up: <SignUp.Root path="/<lang>/auth/signup">
 *   (path routing — follow-up steps such as the email code live at …/verifications,
 *   Google at …/sso-callback; the optional catch-all route renders this same view).
 * - Every panel is written once and rendered twice: with plain elements inside <ClerkLoading>
 *   (that is what the static HTML contains — both tabs — and what shows while Clerk loads) and
 *   with Elements primitives once Clerk is ready — same DOM, so nothing moves.
 * - What Clerk does not store (account type, phone, address, the professional application and
 *   its documents) is kept by lib/pending-signup.ts until the account exists, then sent by
 *   SessionSync. Passwords never leave Clerk's fields.
 * - After success Clerk goes to /auth-callback, which syncs the user into the database.
 */
import { ClerkLoading } from "@clerk/nextjs"
import * as Clerk from "@clerk/elements/common"
import * as SignIn from "@clerk/elements/sign-in"
import * as SignUp from "@clerk/elements/sign-up"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Suspense, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { PasswordInput } from "@/components/forms/PasswordInput"
import { ProFields, PRO_WATCHED_FIELDS, validateProLanguages } from "@/components/forms/ProFields"
import { WatchProvider, When, useWatchedFields } from "@/components/forms/conditional"
import { MascotSvg } from "@/components/shared/Mascot"
import { useHashTabs } from "@/hooks/use-hash-tabs"
import { savePendingSignup } from "@/lib/pending-signup"

const TABS = ["login", "signup"] as const
type Mode = (typeof TABS)[number]
type Provider = "google" | "facebook" | "apple"
const PROVIDER_NAME: Record<Provider, string> = { google: "Google", facebook: "Facebook", apple: "Apple" }
/** social providers enabled on the Clerk instance; the others keep the design's button + a notice */
const CLERK_PROVIDERS: Provider[] = ["google"]
/** sign-up inputs that belong to Clerk and must never be copied to the pending profile */
const CLERK_FIELDS = ["password", "emailAddress", "identifier", "code"]

/* ---------- one markup, two renderers: plain (fallback) or Clerk Elements (live) ---------- */

/** Clerk explains what is wrong with a field (email taken, password too weak…) under it. */
function FieldErr() {
  return (
    <Clerk.FieldError asChild>
      {(error: { message: string }) => (
        <span className="hint" style={{ color: "#b3112f" }}>
          {error.message}
        </span>
      )}
    </Clerk.FieldError>
  )
}

/**
 * A field. With `className` it is the design's `.fld` box itself; without, it only gives Clerk its
 * field context inside an existing box (a `<When className="fld">`), so live it is a
 * `display: contents` wrapper (no box) and in the fallback nothing at all.
 */
function Field({ live, name, className, children }: { live: boolean; name: string; className?: string; children: ReactNode }) {
  if (!live) return className ? <div className={className}>{children}</div> : <>{children}</>
  return (
    <Clerk.Field name={name} className={className} style={className ? undefined : { display: "contents" }}>
      {children}
      <FieldErr />
    </Clerk.Field>
  )
}

function Label({ live, htmlFor, children }: { live: boolean; htmlFor: string; children: ReactNode }) {
  return live ? <Clerk.Label>{children}</Clerk.Label> : <label htmlFor={htmlFor}>{children}</label>
}

function Input({ live, id, name, ...props }: { live: boolean; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  // live, Clerk names the input after its field and links label ↔ input itself;
  // the fallback keeps the design's ids and names
  return live ? <Clerk.Input {...(props as object)} /> : <input id={id} name={name} {...props} />
}

function Password({ live, id, name, ...props }: { live: boolean; id: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  if (!live) return <PasswordInput id={id} name={name} {...props} />
  return (
    <PasswordInput
      renderInput={(type) => (
        <Clerk.Input type="password" asChild>
          <input {...props} type={type} />
        </Clerk.Input>
      )}
    />
  )
}

/** The form element of a step: Elements' step <form> when live, a plain inert one in the fallback. */
function StepForm({ live, flow, children, ...props }: { live: boolean; flow: "in" | "up"; children: ReactNode } & Omit<React.FormHTMLAttributes<HTMLFormElement>, "children">) {
  // noValidate like every form of the design: the status line reports problems, not browser bubbles
  if (!live)
    return (
      <form noValidate onSubmit={(e) => e.preventDefault()}>
        {children}
      </form>
    )
  return flow === "in" ? (
    <SignIn.Step {...props} name="start" noValidate>
      {children}
    </SignIn.Step>
  ) : (
    <SignUp.Step {...props} name="start" noValidate>
      {children}
    </SignUp.Step>
  )
}

function Submit({ live, flow, className, style, children }: { live: boolean; flow: "in" | "up"; className: string; style?: React.CSSProperties; children: string }) {
  if (!live)
    return (
      <button className={className} type="submit" style={style}>
        {children}
      </button>
    )
  return (
    <Clerk.Loading>
      {(loading) =>
        flow === "in" ? (
          <SignIn.Action submit className={className} style={style} aria-busy={loading || undefined}>
            {children}
          </SignIn.Action>
        ) : (
          <SignUp.Action submit className={className} style={style} aria-busy={loading || undefined}>
            {children}
          </SignUp.Action>
        )
      }
    </Clerk.Loading>
  )
}

/**
 * The design's status line (`.fmsg`): always there (empty); our own check and Clerk's
 * form-level errors appear inside it with the `.fmsg.err` look.
 */
function Status({ live, own, className = "" }: { live: boolean; own?: string; className?: string }) {
  return (
    <div className={`fmsg${className ? ` ${className}` : ""}`} role="status">
      {own ? <div className="fmsg err">{own}</div> : null}
      {live && <Clerk.GlobalError className="fmsg err" />}
    </div>
  )
}

/* ---------- pieces ---------- */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function SocialButton({ live, p, className, children }: { live: boolean; p: Provider; className: string; children: ReactNode }) {
  const { t } = useLang()
  const [msg, setMsg] = useState("")
  if (live && CLERK_PROVIDERS.includes(p)) {
    return (
      <Clerk.Connection name={p} className={className} data-p={p}>
        {children}
      </Clerk.Connection>
    )
  }
  const nm = PROVIDER_NAME[p]
  return (
    <>
      <button
        type="button"
        className={className}
        data-p={p}
        onClick={() =>
          setMsg(t(`Sign-in with ${nm} is not available yet.`, `La connexion avec ${nm} n’est pas encore disponible.`, `Die Anmeldung mit ${nm} ist noch nicht verfügbar.`))
        }
      >
        {children}
      </button>
      {msg ? <div className="fmsg ok">{msg}</div> : null}
    </>
  )
}

function SocialButtons({ mode, live }: { mode: Mode; live: boolean }) {
  const { t } = useLang()
  const login = mode === "login"
  return (
    <div className="soc3">
      <SocialButton live={live} p="google" className="sb g">
        <GoogleIcon />
        <span>{login ? t("Log in with Google", "Se connecter avec Google", "Mit Google anmelden") : t("Sign up with Google", "S’inscrire avec Google", "Mit Google registrieren")}</span>
      </SocialButton>
      <SocialButton live={live} p="facebook" className="sb f">
        <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
        </svg>
        <span>{login ? t("Log in with Facebook", "Se connecter avec Facebook", "Mit Facebook anmelden") : t("Sign up with Facebook", "S’inscrire avec Facebook", "Mit Facebook registrieren")}</span>
      </SocialButton>
      <SocialButton live={live} p="apple" className="sb a">
        <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M16.4 12.6c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.15-2.9.9-3.7.9s-1.9-.85-3.1-.8c-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.6-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-.95.04-2.1.64-2.8 1.4-.6.7-1.15 1.8-1 2.9 1.05.08 2.1-.55 2.8-1.3z" />
        </svg>
        <span>{login ? t("Log in with Apple", "Se connecter avec Apple", "Mit Apple anmelden") : t("Sign up with Apple", "S’inscrire avec Apple", "Mit Apple registrieren")}</span>
      </SocialButton>
      <div className="fmsg" role="status" />
    </div>
  )
}

/* ---------- log in ---------- */

/** Native checks first (required fields): a form that is not filled in never reaches Clerk. */
function useRequiredGuard(extra?: (form: HTMLFormElement) => void) {
  const { t } = useLang()
  const [own, setOwn] = useState("")
  const guard = (e: FormEvent<HTMLFormElement>) => {
    const f = e.currentTarget
    extra?.(f)
    if (!f.checkValidity()) {
      e.preventDefault()
      e.stopPropagation()
      f.reportValidity()
      setOwn(t("Please check the highlighted fields and try again.", "Veuillez vérifier les champs et réessayer.", "Bitte prüfen Sie die markierten Felder und versuchen Sie es erneut."))
      return false
    }
    setOwn("")
    return true
  }
  return { own, guard }
}

function LoginStart({ live }: { live: boolean }) {
  const { t, l } = useLang()
  const { own, guard } = useRequiredGuard()
  return (
    <StepForm live={live} flow="in" onSubmitCapture={live ? guard : undefined}>
      <h2>{t("Log in", "Se connecter", "Anmelden")}</h2>
      <p className="sub" style={{ color: "var(--muted)", margin: "6px 0 18px" }}>
        {t("Good to see you again.", "Content de vous revoir.", "Schön, Sie wiederzusehen.")}
      </p>
      <SocialButtons mode="login" live={live} />
      <div className="or">
        <span>{t("or", "ou", "oder")}</span>
      </div>
      <div className="fm">
        <Field live={live} name="identifier" className="fld">
          <Label live={live} htmlFor="l-e">
            <span>{t("Email or phone", "E-mail ou téléphone", "E-Mail oder Telefon")}</span> <i>*</i>
          </Label>
          <Input live={live} id="l-e" name="login" required autoComplete="username" />
        </Field>
        <Field live={live} name="password" className="fld">
          <Label live={live} htmlFor="l-p">
            <span>{t("Password", "Mot de passe", "Passwort")}</span> <i>*</i>
          </Label>
          <Password live={live} id="l-p" name="password" required autoComplete="current-password" />
        </Field>
        <div className="row2">
          <label className="agree">
            <input type="checkbox" name="remember" />
            <span>{t("Remember me", "Se souvenir de moi", "Angemeldet bleiben")}</span>
          </label>
          <Link href={l("/contact")}>{t("Forgot password?", "Mot de passe oublié ?", "Passwort vergessen?")}</Link>
        </div>
        <Submit live={live} flow="in" className="btn pk lg">
          {t("Log in", "Se connecter", "Anmelden")}
        </Submit>
        <Status live={live} own={own} />
      </div>
    </StepForm>
  )
}

/** Code step (email code after sign-up, or a new-device check on sign-in), in the design's vocabulary. */
function CodeStep({ flow }: { flow: "in" | "up" }) {
  const { t } = useLang()
  const Action = flow === "in" ? SignIn.Action : SignUp.Action
  return (
    <>
      <h2>{t("Check your email", "Vérifiez vos e-mails", "Prüfen Sie Ihre E-Mails")}</h2>
      <p className="sub" style={{ color: "var(--muted)", margin: "6px 0 18px" }}>
        {t("We sent you a 6-digit code. Enter it below.", "Nous vous avons envoyé un code à 6 chiffres. Saisissez-le ci-dessous.", "Wir haben Ihnen einen 6-stelligen Code gesendet. Geben Sie ihn unten ein.")}
      </p>
      <div className="fm">
        <Clerk.Field name="code" className="fld">
          <Clerk.Label>
            <span>{t("Code", "Code", "Code")}</span> <i>*</i>
          </Clerk.Label>
          <Clerk.Input type="otp" required autoComplete="one-time-code" inputMode="numeric" />
          <FieldErr />
        </Clerk.Field>
        <div className="row2">
          <Action
            resend
            className="btn gh sm"
            type="button"
            fallback={({ resendableAfter }: { resendableAfter: number }) => (
              <span style={{ color: "var(--muted)" }}>{t(`Resend the code in ${resendableAfter}s`, `Renvoyer le code dans ${resendableAfter} s`, `Code in ${resendableAfter} s erneut senden`)}</span>
            )}
          >
            {t("Resend the code", "Renvoyer le code", "Code erneut senden")}
          </Action>
        </div>
        <Clerk.Loading>
          {(loading) => (
            <Action submit className="btn pk lg" aria-busy={loading || undefined}>
              {t("Continue", "Continuer", "Weiter")}
            </Action>
          )}
        </Clerk.Loading>
        <Status live />
      </div>
    </>
  )
}

function LoginFlow() {
  const { t } = useLang()
  return (
    <>
      <LoginStart live />
      <SignIn.Step name="verifications">
        <SignIn.Strategy name="email_code">
          <CodeStep flow="in" />
        </SignIn.Strategy>
        <SignIn.Strategy name="password">
          <h2>{t("Log in", "Se connecter", "Anmelden")}</h2>
          <div className="fm">
            <Clerk.Field name="password" className="fld">
              <Clerk.Label>
                <span>{t("Password", "Mot de passe", "Passwort")}</span> <i>*</i>
              </Clerk.Label>
              <Password live id="l-p2" name="password" required autoComplete="current-password" />
              <FieldErr />
            </Clerk.Field>
            <SignIn.Action submit className="btn pk lg">
              {t("Log in", "Se connecter", "Anmelden")}
            </SignIn.Action>
            <Status live />
          </div>
        </SignIn.Strategy>
      </SignIn.Step>
      <SignIn.Step name="sso-callback">
        <SignIn.Captcha />
      </SignIn.Step>
    </>
  )
}

/* ---------- sign up ---------- */

function SignupStart({ live }: { live: boolean }) {
  const { t, l } = useLang()
  const { values, formProps } = useWatchedFields(["role", ...PRO_WATCHED_FIELDS], { role: "customer" })
  // runs before Elements' own submit: our extra fields (pro documents, languages, consent) must
  // be valid before Clerk creates anything; then the extras are parked until the account exists
  const { own, guard: check } = useRequiredGuard((f) =>
    validateProLanguages(f, t("Please choose at least one language.", "Veuillez choisir au moins une langue.", "Bitte wählen Sie mindestens eine Sprache.")),
  )
  const guard = (e: FormEvent<HTMLFormElement>) => {
    if (check(e)) void savePendingSignup(e.currentTarget, CLERK_FIELDS)
  }

  return (
    <StepForm live={live} flow="up" data-pro-form="" {...formProps} onSubmitCapture={live ? guard : undefined}>
      <h2>{t("Create your account", "Créez votre compte", "Konto erstellen")}</h2>
      <p className="sub" style={{ color: "var(--muted)", margin: "6px 0 18px" }}>
        {t("It takes a minute.", "Cela prend une minute.", "Es dauert nur eine Minute.")}
      </p>
      <SocialButtons mode="signup" live={live} />
      <div className="or">
        <span>{t("or", "ou", "oder")}</span>
      </div>
      <WatchProvider values={values}>
        <div className="fm g2">
          <div className="who full">
            <label>
              <input type="radio" name="role" value="customer" defaultChecked />
              <span>
                {"🏠 "}
                <span>{t("Customer", "Client", "Kunde")}</span>
              </span>
            </label>
            <label>
              <input type="radio" name="role" value="pro" />
              <span>
                {"🛠️ "}
                <span>{t("Professional", "Professionnel", "Fachkraft")}</span>
              </span>
            </label>
          </div>
          <Field live={live} name="firstName" className="fld">
            <Label live={live} htmlFor="s-f">
              <span>{t("First name", "Prénom", "Vorname")}</span> <i>*</i>
            </Label>
            <Input live={live} id="s-f" name="first" required autoComplete="given-name" />
          </Field>
          <Field live={live} name="lastName" className="fld">
            <Label live={live} htmlFor="s-l">
              <span>{t("Family name", "Nom de famille", "Nachname")}</span> <i>*</i>
            </Label>
            <Input live={live} id="s-l" name="last" required autoComplete="family-name" />
          </Field>
          <When field="role" is={["customer"]} className="fld full">
            <Field live={live} name="emailAddress">
              <Label live={live} htmlFor="s-e">
                <span>{t("Email", "E-mail", "E-Mail")}</span> <i>*</i>
              </Label>
              <Input live={live} id="s-e" name="email" type="email" required autoComplete="email" />
            </Field>
          </When>
          <When field="role" is={["customer"]} className="fld full">
            <label htmlFor="s-p">{t("Phone", "Téléphone", "Telefon")}</label>
            <input id="s-p" name="phone" type="tel" autoComplete="tel" placeholder="+352 …" />
          </When>
          <When field="role" is={["pro"]} className="fld full">
            <label htmlFor="s-pp">
              <span>{t("Phone", "Téléphone", "Telefon")}</span> <i>*</i>
            </label>
            <input id="s-pp" name="phone" type="tel" required autoComplete="tel" placeholder="+352 …" />
          </When>
          <When field="role" is={["pro"]} className="fld full">
            <Field live={live} name="emailAddress">
              <Label live={live} htmlFor="s-ee">
                {t("Email (optional)", "E-mail (facultatif)", "E-Mail (optional)")}
              </Label>
              <Input live={live} id="s-ee" name="email" type="email" autoComplete="email" />
            </Field>
          </When>
          <Field live={live} name="password" className="fld full">
            <Label live={live} htmlFor="s-w">
              <span>{t("Password", "Mot de passe", "Passwort")}</span> <i>*</i>
            </Label>
            <Password live={live} id="s-w" name="password" required minLength={8} autoComplete="new-password" />
            <span className="hint">{t("At least 8 characters.", "Au moins 8 caractères.", "Mindestens 8 Zeichen.")}</span>
          </Field>
          <When field="role" is={["pro"]} className="fm g2 full pro-box">
            <ProFields />
          </When>
          <label className="agree full">
            <input type="checkbox" name="consent" required />
            <span>
              <span>{t("I agree to the", "J’accepte les", "Ich akzeptiere die")}</span>{" "}
              <Link href={l("/terms")} target="_blank" rel="noopener">
                {t("Terms", "Conditions", "AGB")}
              </Link>{" "}
              <span>{t("and", "et la", "und die")}</span>{" "}
              <Link href={l("/privacy")} target="_blank" rel="noopener">
                {t("Privacy Policy", "Politique de confidentialité", "Datenschutzerklärung")}
              </Link>
              .
            </span>
          </label>
          <div className="full">
            <Submit live={live} flow="up" className="btn pk lg" style={{ width: "100%" }}>
              {t("Create account", "Créer mon compte", "Konto erstellen")}
            </Submit>
          </div>
          <Status live={live} own={own} className="full" />
        </div>
      </WatchProvider>
      {live && <SignUp.Captcha />}
    </StepForm>
  )
}

function SignupFlow() {
  const { t } = useLang()
  return (
    <>
      <SignupStart live />
      <SignUp.Step name="verifications">
        <SignUp.Strategy name="email_code">
          <CodeStep flow="up" />
        </SignUp.Strategy>
      </SignUp.Step>
      <SignUp.Step name="continue">
        <h2>{t("Almost there", "Presque fini", "Fast geschafft")}</h2>
        <div className="fm g2">
          <Clerk.Field name="firstName" className="fld">
            <Clerk.Label>{t("First name", "Prénom", "Vorname")}</Clerk.Label>
            <Clerk.Input autoComplete="given-name" />
          </Clerk.Field>
          <Clerk.Field name="lastName" className="fld">
            <Clerk.Label>{t("Family name", "Nom de famille", "Nachname")}</Clerk.Label>
            <Clerk.Input autoComplete="family-name" />
          </Clerk.Field>
          <div className="full">
            <SignUp.Action submit className="btn pk lg" style={{ width: "100%" }}>
              {t("Continue", "Continuer", "Weiter")}
            </SignUp.Action>
          </div>
          <Status live className="full" />
        </div>
      </SignUp.Step>
    </>
  )
}

/* ---------- page ---------- */

export function AuthView() {
  const { t, l } = useLang()
  const router = useRouter()
  const pathname = usePathname()
  const [hashTab, setHashTab] = useHashTabs(TABS, "login")
  // a step URL (/auth/signup/verifications, /auth/sso-callback…) decides the tab; else the hash does
  const onSignupPath = /\/auth\/signup(\/|$)/.test(pathname)
  const onLoginStep = !onSignupPath && /\/auth\/./.test(pathname)
  const tab: Mode = onSignupPath ? "signup" : onLoginStep ? "login" : hashTab
  const setTab = (k: Mode) => (onSignupPath || onLoginStep ? router.replace(`${l("/auth")}#${k}`) : setHashTab(k))

  return (
    <section style={{ padding: "0" }}>
      <div className="wrap">
        <div className="auth">
          <div className="auth-l">
            <div>
              <h2>{t("Welcome to LIVO.", "Bienvenue chez LIVO.", "Willkommen bei LIVO.")}</h2>
              <ul>
                <li>{t("Track your requests", "Suivez vos demandes", "Anfragen verfolgen")}</li>
                <li>{t("Book faster next time", "Réservez plus vite la prochaine fois", "Nächstes Mal schneller buchen")}</li>
                <li>{t("Rate your pros", "Notez vos pros", "Profis bewerten")}</li>
              </ul>
            </div>
            <div className="mm">
              <MascotSvg gradientId="mgau" />
            </div>
          </div>
          <div className="auth-r">
            <div className="tabs" id="atabs" role="tablist">
              {TABS.map((k) => (
                <button key={k} type="button" role="tab" data-t={k} className={tab === k ? "on" : undefined} aria-selected={tab === k} onClick={() => setTab(k)}>
                  {k === "login" ? t("Log in", "Connexion", "Anmelden") : t("Sign up", "Inscription", "Registrieren")}
                </button>
              ))}
            </div>

            <div data-panel="login" hidden={tab !== "login"}>
              <ClerkLoading>
                <LoginStart live={false} />
              </ClerkLoading>
              {/* Elements reads the query string: Suspense keeps the page static (CLAUDE.md §4.1 rule 8);
                  the visible fallback is the <ClerkLoading> markup above */}
              <Suspense fallback={null}>
                <SignIn.Root path={l("/auth")} routing="path">
                  <LoginFlow />
                </SignIn.Root>
              </Suspense>
            </div>

            <div data-panel="signup" hidden={tab !== "signup"}>
              <ClerkLoading>
                <SignupStart live={false} />
              </ClerkLoading>
              <Suspense fallback={null}>
                <SignUp.Root path={l("/auth/signup")} routing="path">
                  <SignupFlow />
                </SignUp.Root>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
