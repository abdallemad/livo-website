"use client"

import { useState, type InputHTMLAttributes, type ReactNode } from "react"
import { useLang } from "@/components/providers/lang-provider"

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** render the input yourself (e.g. a Clerk Elements `<Clerk.Input asChild>`); gets the current type */
  renderInput?: (type: "text" | "password") => ReactNode
}

/** Password field with the 👁️ / 🙈 show toggle (`.pw` / `.pwt`). */
export function PasswordInput({ renderInput, ...props }: Props) {
  const { t } = useLang()
  const [shown, setShown] = useState(false)
  const type = shown ? "text" : "password"
  return (
    <div className="pw">
      {renderInput ? renderInput(type) : <input {...props} type={type} />}
      <button className="pwt" type="button" aria-label={t("Show password", "Afficher le mot de passe", "Passwort anzeigen")} onClick={() => setShown((s) => !s)}>
        {shown ? "🙈" : "👁️"}
      </button>
    </div>
  )
}
