import { z } from "zod"
import { contactMethod, locale, optional, optionalEmail, optionalPhone, required } from "./fields"

/** Account page "My details" (web) and PATCH /api/me (mobile). Field names match the design's form. */
export const updateProfileSchema = z.object({
  first: required(80),
  last: optional(80),
  email: optionalEmail,
  phone: optionalPhone,
  address_building: optional(40),
  address_street: optional(160),
  address_postcode: optional(20),
  city: optional(120),
  contact: contactMethod,
  /** a customer may switch to a professional account; nothing can grant ADMIN */
  role: z
    .union([z.literal("pro"), z.literal("customer"), z.undefined()])
    .optional(),
  locale: locale.optional(),
})
export type UpdateProfileValues = z.infer<typeof updateProfileSchema>

/** what a fresh sign-up adds on top of Clerk's fields (role, phone, pro address) */
export const signupProfileSchema = updateProfileSchema.partial({ first: true })
export type SignupProfileValues = z.infer<typeof signupProfileSchema>
