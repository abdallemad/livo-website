/**
 * Admin writes (PATCH/POST/DELETE /api/admin/*). Shared by the dashboard forms and the routes.
 * Every field is optional on updates: only what is sent is written.
 */
import { z } from "zod"

const note = z.string().trim().max(2000).nullable()
const id = z.string().trim().min(1).max(64)

export const bookingUpdateSchema = z
  .object({
    status: z.enum(["RECEIVED", "MATCHED", "SCHEDULED", "DONE", "CANCELLED"]),
    /** a PRO user id, or null to unassign */
    providerId: id.nullable(),
    adminNote: note,
  })
  .partial()
export type BookingUpdateValues = z.infer<typeof bookingUpdateSchema>

export const providerRequestUpdateSchema = z
  .object({
    status: z.enum(["RECEIVED", "IN_REVIEW", "APPROVED", "REJECTED"]),
    adminNote: note,
  })
  .partial()
export type ProviderRequestUpdateValues = z.infer<typeof providerRequestUpdateSchema>

export const reviewUpdateSchema = z.object({ isApproved: z.boolean() })
export const messageUpdateSchema = z.object({ isHandled: z.boolean() })
export const userRoleSchema = z.object({ role: z.enum(["CUSTOMER", "PRO", "ADMIN"]) })

/* ---------------- catalogue ---------------- */

const label = (max: number, message = "Required in English.") =>
  z.object({
    en: z.string().trim().min(1, message).max(max),
    fr: z.string().trim().max(max).optional(),
    de: z.string().trim().max(max).optional(),
  })

const emoji = z.string().trim().min(1, "Pick an emoji.").max(16)
const hex = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #7B2FF7.")
const order = z.coerce.number().int().min(0).max(9999)

export const serviceUpdateSchema = z
  .object({
    emoji,
    name: label(80),
    description: label(300),
    /** one item per line in the form */
    subServices: z.object({ en: z.array(z.string().trim().min(1).max(120)).max(40), fr: z.array(z.string().trim().min(1).max(120)).max(40).optional(), de: z.array(z.string().trim().min(1).max(120)).max(40).optional() }),
    categoryId: id,
    featured: z.boolean(),
    isActive: z.boolean(),
    sortOrder: order,
  })
  .partial()
export type ServiceUpdateValues = z.infer<typeof serviceUpdateSchema>

export const categoryUpdateSchema = z
  .object({ emoji, name: label(60), colorFrom: hex, colorTo: hex, isActive: z.boolean(), sortOrder: order })
  .partial()
export type CategoryUpdateValues = z.infer<typeof categoryUpdateSchema>

export const slideUpdateSchema = z.object({ isActive: z.boolean(), sortOrder: order }).partial()

export const townCreateSchema = z.object({ name: z.string().trim().min(2, "Enter a town name.").max(80) })
export const townUpdateSchema = z.object({ name: townCreateSchema.shape.name, isActive: z.boolean(), sortOrder: order }).partial()
