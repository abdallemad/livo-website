/**
 * Admin writes — the rules behind every button of the dashboard. Each function starts with
 * `requireAdmin()`; the /api/admin routes only validate and delegate here (CLAUDE.md §2).
 * Catalogue writes call `revalidateStorefront()`.
 */
import "server-only"
import type { Prisma } from "@prisma/client"
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors"
import { deleteObject } from "@/lib/r2.provider"
import { revalidateStorefront } from "@/lib/storefront-cache"
import { adminRepository } from "@/repositories/admin.repository"
import type {
  BookingUpdateValues,
  CategoryUpdateValues,
  ProviderRequestUpdateValues,
  ServiceUpdateValues,
} from "@/schemas/admin.schema"
import { requireAdmin } from "./auth.service"

const isP2025 = (e: unknown) => (e as { code?: string })?.code === "P2025"
const isP2002 = (e: unknown) => (e as { code?: string })?.code === "P2002"

/** run a write; a missing row becomes a clean 404 */
async function orNotFound<T>(what: string, run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (e) {
    if (isP2025(e)) throw new NotFoundError(`${what} not found.`)
    throw e
  }
}

const cleanNote = (v: string | null | undefined) => (v === undefined ? undefined : v?.trim() || null)

/* ---------------- operations ---------------- */

export async function updateBooking(id: string, v: BookingUpdateValues) {
  await requireAdmin()
  const current = await adminRepository.booking(id)
  if (!current) throw new NotFoundError("Booking not found.")

  const data: Prisma.BookingUncheckedUpdateInput = {}
  if (v.providerId !== undefined) {
    if (v.providerId) {
      const pro = await adminRepository.userRole(v.providerId)
      if (pro?.role !== "PRO") throw new ValidationError("Choose a professional account.", { providerId: ["Choose a professional account."] })
    }
    data.providerId = v.providerId
  }
  if (v.status) {
    const provider = v.providerId !== undefined ? v.providerId : current.providerId
    if ((v.status === "MATCHED" || v.status === "SCHEDULED") && !provider) {
      throw new ValidationError("Assign a provider first.", { providerId: ["Assign a provider before marking it matched or scheduled."] })
    }
    data.status = v.status
  }
  if (v.adminNote !== undefined) data.adminNote = cleanNote(v.adminNote)
  return adminRepository.updateBooking(id, data)
}

export async function listProfessionals() {
  await requireAdmin()
  return (await adminRepository.professionals()).map((p) => ({
    id: p.id,
    name: `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || p.email || p.id,
    contact: [p.phone, p.email].filter(Boolean).join(" · "),
  }))
}

export async function updateProviderRequest(id: string, v: ProviderRequestUpdateValues) {
  await requireAdmin()
  const request = await adminRepository.providerRequestOwner(id)
  if (!request) throw new NotFoundError("Provider request not found.")
  const data: Prisma.ProviderRequestUncheckedUpdateInput = {}
  if (v.status) {
    data.status = v.status
    data.reviewedAt = v.status === "APPROVED" || v.status === "REJECTED" ? new Date() : null
  }
  if (v.adminNote !== undefined) data.adminNote = cleanNote(v.adminNote)
  // approving a request made from an account turns that account into a professional one
  const promote = v.status === "APPROVED" && request.userId && request.user?.role === "CUSTOMER" ? request.userId : undefined
  const row = await adminRepository.updateProviderRequest(id, data, promote)
  return { ...row, promotedUser: !!promote }
}

/* ---------------- people ---------------- */

export async function setUserRole(id: string, role: "CUSTOMER" | "PRO" | "ADMIN") {
  const admin = await requireAdmin()
  if (id === admin.id) throw new ForbiddenError("You cannot change your own role.")
  const user = await adminRepository.userRole(id)
  if (!user) throw new NotFoundError("User not found.")
  if (user.role === "ADMIN" && role !== "ADMIN" && (await adminRepository.countAdmins()) <= 1) {
    throw new ConflictError("Keep at least one admin.")
  }
  return adminRepository.updateUserRole(id, role)
}

/* ---------------- feedback ---------------- */

export async function setReviewApproved(id: string, isApproved: boolean) {
  await requireAdmin()
  return orNotFound("Review", () => adminRepository.updateReview(id, { isApproved }))
}

export async function deleteReview(id: string) {
  await requireAdmin()
  const keys = await adminRepository.reviewFileKeys(id)
  await orNotFound("Review", () => adminRepository.deleteReview(id))
  await Promise.all(keys.map((f) => deleteObject(f.key).catch(() => {})))
  return { deleted: true }
}

export async function setMessageHandled(id: string, isHandled: boolean) {
  await requireAdmin()
  return orNotFound("Message", () => adminRepository.updateMessage(id, { isHandled }))
}

export async function deleteMessage(id: string) {
  await requireAdmin()
  const keys = await adminRepository.messageFileKeys(id)
  await orNotFound("Message", () => adminRepository.deleteMessage(id))
  await Promise.all(keys.map((f) => deleteObject(f.key).catch(() => {})))
  return { deleted: true }
}

/* ---------------- catalogue ---------------- */

const json = (v: unknown) => v as Prisma.InputJsonValue
/** drop empty translations so the UI falls back to English */
const localized = <T,>(v: { en: T; fr?: T; de?: T }) => {
  const out: { en: T; fr?: T; de?: T } = { en: v.en }
  for (const k of ["fr", "de"] as const) {
    const x = v[k]
    if (x !== undefined && (Array.isArray(x) ? x.length : String(x).trim())) out[k] = x
  }
  return out
}

export async function getServiceForEdit(id: string) {
  await requireAdmin()
  const s = await adminRepository.service(id)
  if (!s) throw new NotFoundError("Service not found.")
  return s
}

export async function updateService(id: string, v: ServiceUpdateValues) {
  await requireAdmin()
  if (v.categoryId && !(await adminRepository.categoryExists(v.categoryId))) throw new ValidationError("Unknown category.", { categoryId: ["Unknown category."] })
  const data: Prisma.ServiceUncheckedUpdateInput = {}
  if (v.emoji !== undefined) data.emoji = v.emoji
  if (v.name) data.name = json(localized(v.name))
  if (v.description) data.description = json(localized(v.description))
  if (v.subServices) data.subServices = json(localized(v.subServices))
  if (v.categoryId) data.categoryId = v.categoryId
  if (v.featured !== undefined) data.featured = v.featured
  if (v.isActive !== undefined) data.isActive = v.isActive
  if (v.sortOrder !== undefined) data.sortOrder = v.sortOrder
  const row = await orNotFound("Service", () => adminRepository.updateService(id, data))
  revalidateStorefront()
  return row
}

export async function getCategoryForEdit(id: string) {
  await requireAdmin()
  const c = await adminRepository.category(id)
  if (!c) throw new NotFoundError("Category not found.")
  return c
}

export async function updateCategory(id: string, v: CategoryUpdateValues) {
  await requireAdmin()
  const data: Prisma.ServiceCategoryUpdateInput = {}
  if (v.emoji !== undefined) data.emoji = v.emoji
  if (v.name) data.name = json(localized(v.name))
  if (v.colorFrom) data.colorFrom = v.colorFrom
  if (v.colorTo) data.colorTo = v.colorTo
  if (v.isActive !== undefined) data.isActive = v.isActive
  if (v.sortOrder !== undefined) data.sortOrder = v.sortOrder
  const row = await orNotFound("Category", () => adminRepository.updateCategory(id, data))
  revalidateStorefront()
  return row
}

export async function updateSlide(id: string, v: { isActive?: boolean; sortOrder?: number }) {
  await requireAdmin()
  const row = await orNotFound("Slide", () => adminRepository.updateSlide(id, v))
  revalidateStorefront()
  return row
}

export async function createTown(name: string) {
  await requireAdmin()
  try {
    const row = await adminRepository.createTown({ name, sortOrder: await adminRepository.nextTownOrder() })
    revalidateStorefront()
    return row
  } catch (e) {
    if (isP2002(e)) throw new ConflictError("This town is already in the list.", { name: ["This town is already in the list."] })
    throw e
  }
}

export async function updateTown(id: string, v: { name?: string; isActive?: boolean; sortOrder?: number }) {
  await requireAdmin()
  try {
    const row = await orNotFound("Town", () => adminRepository.updateTown(id, v))
    revalidateStorefront()
    return row
  } catch (e) {
    if (isP2002(e)) throw new ConflictError("This town is already in the list.", { name: ["This town is already in the list."] })
    throw e
  }
}

export async function deleteTown(id: string) {
  await requireAdmin()
  await orNotFound("Town", () => adminRepository.deleteTown(id))
  revalidateStorefront()
  return { deleted: true }
}
