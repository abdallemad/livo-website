/** The signed-in person's profile (account page, mobile "me" screen). */
import "server-only"
import { clerkClient } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"
import { IMAGE_TYPES, MAX_AVATAR_BYTES } from "@/constants/upload"
import { ConflictError } from "@/lib/errors"
import { deleteObject } from "@/lib/r2.provider"
import { fileRepository } from "@/repositories/file.repository"
import { submissionRepository } from "@/repositories/submission.repository"
import { userRepository, type UserRow } from "@/repositories/user.repository"
import type { UpdateProfileValues } from "@/schemas/user.schema"
import { imageUrl, removeStoredFile, storeUpload } from "./file.service"

export type RoleDto = "customer" | "pro" | "admin"
export type ContactDto = "whatsapp" | "phone" | "email"

/** Field names follow the design's forms (and the preview session the UI was built on). */
export interface MeDto {
  id: string
  name: string
  first: string
  last: string
  email: string
  phone: string
  role: RoleDto
  since: string
  photo: string | null
  contact: ContactDto | null
  address_building: string
  address_street: string
  address_postcode: string
  city: string
  locale: string
  /** latest "become a provider" request */
  providerRequest: { service: string | null; at: string; status: string } | null
}

export async function toMe(u: UserRow, absolute?: (p: string) => string): Promise<MeDto> {
  const app = await submissionRepository.latestProviderRequestFor(u.id)
  const first = u.firstName ?? ""
  const last = u.lastName ?? ""
  return {
    id: u.id,
    name: `${first} ${last}`.trim() || (u.email ?? "").split("@")[0],
    first,
    last,
    email: u.email ?? "",
    phone: u.phone ?? "",
    role: u.role.toLowerCase() as RoleDto,
    since: u.createdAt.toISOString(),
    photo: imageUrl(u.photo?.key, absolute),
    contact: (u.contactMethod?.toLowerCase() as ContactDto | undefined) ?? null,
    address_building: u.addressBuilding ?? "",
    address_street: u.addressStreet ?? "",
    address_postcode: u.addressPostcode ?? "",
    city: u.city ?? "",
    locale: u.locale,
    providerRequest: app ? { service: app.service?.slug ?? null, at: app.createdAt.toISOString(), status: app.status.toLowerCase() } : null,
  }
}

export async function updateProfile(user: UserRow, v: Partial<UpdateProfileValues>): Promise<UserRow> {
  const data: Prisma.UserUncheckedUpdateInput = {}
  if (v.first !== undefined) data.firstName = v.first
  if ("last" in v) data.lastName = v.last ?? null
  if ("email" in v) data.email = v.email?.toLowerCase() ?? null
  if ("phone" in v) data.phone = v.phone ?? null
  if ("address_building" in v) data.addressBuilding = v.address_building ?? null
  if ("address_street" in v) data.addressStreet = v.address_street ?? null
  if ("address_postcode" in v) data.addressPostcode = v.address_postcode ?? null
  if ("city" in v) data.city = v.city ?? null
  if ("contact" in v) data.contactMethod = v.contact ?? null
  if (v.locale) data.locale = v.locale
  // customer → professional only; ADMIN is never set here and never downgraded
  if (v.role === "pro" && user.role === "CUSTOMER") data.role = "PRO"

  let updated: UserRow
  try {
    updated = await userRepository.update(user.id, data)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new ConflictError("This email is already used by another account.", { email: ["This email is already used by another account."] })
    }
    throw e
  }
  // keep the name on the Clerk account in step (best effort — the DB is what the app shows)
  if (v.first !== undefined || "last" in v) {
    const clerk = await clerkClient()
    await clerk.users.updateUser(user.id, { firstName: updated.firstName ?? undefined, lastName: updated.lastName ?? "" }).catch((e) => console.warn("[user] clerk name sync failed", e))
  }
  return updated
}

export async function setPhoto(user: UserRow, file: File): Promise<UserRow> {
  const stored = await storeUpload(file, { field: "photo", kind: "AVATAR", prefix: `avatars/${user.id}`, allowed: IMAGE_TYPES, maxBytes: MAX_AVATAR_BYTES })
  const previous = user.photoId ? await fileRepository.findById(user.photoId) : null
  const updated = await userRepository.update(user.id, { photoId: stored.id })
  if (previous) await removeStoredFile(previous.id, previous.key)
  return updated
}

/**
 * "Delete my account": the profile and the booking history go (as the page promises), then the
 * Clerk account. Stored files are removed from R2 as well.
 */
export async function deleteAccount(user: UserRow): Promise<void> {
  const keys = await fileRepository.keysOwnedBy(user.id, user.photoId)
  await userRepository.deleteWithBookings(user.id)
  await Promise.all(keys.map((key) => deleteObject(key).catch(() => {})))
  const clerk = await clerkClient()
  await clerk.users.deleteUser(user.id)
}
