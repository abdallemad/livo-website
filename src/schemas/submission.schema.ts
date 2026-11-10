/** Contact, provider request and review forms. Field names match the design's inputs. */
import { z } from "zod"
import { consent, email, list, locale, optional, optionalEmail, phone, required, serviceSlug, text, yesNo } from "./fields"

export const contactSchema = z.object({
  topic: z
    .string()
    .optional()
    .transform((v) => (v === "inquiry" ? "INQUIRY" : v === "complaint" ? "COMPLAINT" : "GENERAL") as "GENERAL" | "INQUIRY" | "COMPLAINT"),
  name: required(120),
  email,
  phone: optional(40),
  service: serviceSlug,
  reference: optional(40),
  message: required(5000),
  consent,
  locale,
})
export type ContactValues = z.infer<typeof contactSchema>

/** "Become a provider" (join page / professional sign-up) */
export const providerRequestSchema = z.object({
  first: required(80),
  last: required(80),
  phone,
  email: optionalEmail,
  service: serviceSlug,
  address_building: optional(40),
  address_street: optional(160),
  address_postcode: optional(20),
  city: optional(120),
  langs: list(text(16)).refine((v) => v.length > 0, "Please choose at least one language."),
  experience: optional(10),
  about: optional(3000),
  has_car: yesNo,
  id_type: optional(40),
  licence_type: optional(40),
  authorized: yesNo,
  consent: consent.optional(),
  locale,
})
export type ProviderRequestValues = z.infer<typeof providerRequestSchema>

/** document inputs of the provider form — the only file field names accepted */
export const PROVIDER_DOCUMENTS = [
  "id_front",
  "id_back",
  "passport_page",
  "authorization_front",
  "authorization_back",
  "licence_front",
  "licence_back",
  "cv",
] as const

const jsonObject = z.preprocess((v) => {
  if (typeof v !== "string") return v
  try {
    return JSON.parse(v)
  } catch {
    return undefined
  }
}, z.record(z.string(), z.number().int().min(0).max(5)).optional())

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Please choose a star rating first.").max(5),
  details: jsonObject,
  recommend: optional(20),
  tags: list(text(60)),
  comment: optional(3000),
  publish: yesNo,
  ref: optional(40),
  service: serviceSlug,
  locale,
})
export type ReviewValues = z.infer<typeof reviewSchema>
