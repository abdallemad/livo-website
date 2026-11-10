/**
 * Zod building blocks shared by every schema. Inputs arrive either as JSON (mobile app) or as
 * multipart form fields (web), where everything is a string and checkbox groups may be a single
 * value — these helpers accept both shapes.
 */
import { z } from "zod"
import { LOCALES } from "@/i18n/config"

/** trimmed text, `max` characters */
export const text = (max = 200) => z.string({ error: "This field is required." }).trim().max(max)
export const required = (max = 200, message = "This field is required.") => text(max).min(1, message)
/** optional text: "" → undefined */
export const optional = (max = 200) =>
  z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim() : ""))
    .pipe(z.string().max(max))
    .transform((v) => v || undefined)

export const optionalEmail = optional(254).refine((v) => !v || z.email().safeParse(v).success, "Please enter a valid email.")
export const email = text(254).pipe(z.email("Please enter a valid email."))
export const phone = text(40).regex(/^[+()\d\s./-]{6,}$/, "Please enter a valid phone number.")
export const optionalPhone = optional(40).refine((v) => !v || /^[+()\d\s./-]{6,}$/.test(v), "Please enter a valid phone number.")

/** "a" or ["a","b"] → string[] */
export const list = (item = text(80)) =>
  z.preprocess((v) => (v === undefined || v === null || v === "" ? [] : Array.isArray(v) ? v : [v]), z.array(item))

/** yes/no radios, checkboxes ("on"), booleans */
export const yesNo = z
  .union([z.boolean(), z.string(), z.null()])
  .optional()
  .transform((v) => (v === true || v === "yes" || v === "on" || v === "true" ? true : v === false || v === "no" || v === "false" ? false : undefined))

export const consent = z
  .union([z.boolean(), z.string()])
  .optional()
  .refine((v) => v === true || v === "on" || v === "true" || v === "yes", "Please accept to continue.")

export const locale = z
  .string()
  .optional()
  .transform((v) => ((LOCALES as readonly string[]).includes(v ?? "") ? (v as (typeof LOCALES)[number]) : "en"))

export const contactMethod = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v): "WHATSAPP" | "PHONE" | "EMAIL" | undefined => {
    const k = (v ?? "").trim().toUpperCase()
    return k === "WHATSAPP" || k === "PHONE" || k === "EMAIL" ? k : undefined
  })

/** service slug ("plumbing") — resolved to a row by the service layer */
export const serviceSlug = optional(60)
