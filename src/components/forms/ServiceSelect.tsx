"use client"

import type { SelectHTMLAttributes } from "react"
import { useLang } from "@/components/providers/lang-provider"
import { SERVICES } from "@/data/services"

/** `<select>` of all services (prototype: select[data-services], filled by app.js). */
export function ServiceSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { t, pick } = useLang()
  return (
    <select defaultValue="" {...props}>
      <option value="">{t("Choose a service", "Choisir un service", "Service auswählen")}</option>
      {SERVICES.map((s) => (
        <option key={s.id} value={s.id}>
          {pick(s.name)}
        </option>
      ))}
    </select>
  )
}
