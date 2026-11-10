"use client"

/**
 * Form behaviour from the prototype (app.js initForms) wired to the API: native validation,
 * one status line (`.fmsg.ok` / `.fmsg.err`), then reset. `action` sends the form (usually
 * `apiFetch` to an `/api/*` route); an `ApiError` is shown in the status line, with the server's
 * field errors. Markup and classes are the design's, unchanged.
 */
import { useRef, useState, type FormHTMLAttributes, type ReactNode } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { ApiError } from "@/lib/api-client"

export type FormValues = Record<string, string | string[]>

interface SiteFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "action"> {
  children: ReactNode
  /** class of the status line (`fmsg` is always added) */
  msgClassName?: string
  /** success message, [en, fr, de] */
  ok?: [string, string?, string?]
  /** runs before validation (e.g. custom validity rules) */
  beforeValidate?: (form: HTMLFormElement) => void
  /** sends the valid form; return false to keep the values */
  action?: (form: HTMLFormElement, data: FormValues) => Promise<void | false> | void | false
  /** navigate after success */
  next?: string
  onNext?: (href: string) => void
}

export function readForm(form: HTMLFormElement): FormValues {
  const data: FormValues = {}
  new FormData(form).forEach((v, k) => {
    const value = v instanceof File ? v.name : v
    data[k] = k in data ? ([] as string[]).concat(data[k], value) : value // repeated names become a list
  })
  return data
}

export function SiteForm({ children, msgClassName = "", ok, beforeValidate, action, next, onNext, ...rest }: SiteFormProps) {
  const { t } = useLang()
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const msgRef = useRef<HTMLDivElement>(null)
  const show = (m: { kind: "ok" | "err"; text: string }) => {
    setMsg(m)
    setTimeout(() => msgRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 0)
  }

  return (
    <form
      {...rest}
      noValidate
      aria-busy={busy || undefined}
      onSubmit={async (e) => {
        e.preventDefault()
        if (busy) return
        const f = e.currentTarget
        beforeValidate?.(f)
        if (!f.checkValidity()) {
          f.reportValidity()
          show({ kind: "err", text: t("Please check the highlighted fields and try again.", "Veuillez vérifier les champs et réessayer.", "Bitte prüfen Sie die markierten Felder und versuchen Sie es erneut.") })
          return
        }
        setBusy(true)
        let keep = false
        try {
          keep = (await action?.(f, readForm(f))) === false
        } catch (err) {
          setBusy(false)
          const fields = err instanceof ApiError && err.fieldErrors ? Object.values(err.fieldErrors).flat() : []
          const offline = err instanceof ApiError && err.status === 0
          show({
            kind: "err",
            text: offline
              ? t("No connection. Please try again.", "Pas de connexion. Veuillez réessayer.", "Keine Verbindung. Bitte versuchen Sie es erneut.")
              : fields[0] ?? (err instanceof ApiError && err.status < 500 ? err.message : t("Something went wrong. Please try again.", "Une erreur est survenue. Veuillez réessayer.", "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.")),
          })
          return
        }
        setBusy(false)
        show({
          kind: "ok",
          text: t(ok?.[0] ?? "Thank you! We received it and will get back to you soon.", ok?.[1] ?? "Merci ! Nous l’avons bien reçu et revenons vers vous très vite.", ok?.[2] ?? "Vielen Dank! Wir haben es erhalten und melden uns in Kürze."),
        })
        if (next && onNext) setTimeout(() => onNext(next), 900)
        if (!keep) f.reset()
      }}
    >
      {children}
      <div ref={msgRef} className={`fmsg${msg ? ` ${msg.kind}` : ""}${msgClassName ? ` ${msgClassName}` : ""}`} role="status">
        {msg?.text}
      </div>
    </form>
  )
}
