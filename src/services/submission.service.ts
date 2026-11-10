/** Contact messages, provider requests and reviews. */
import "server-only"
import { DOCUMENT_TYPES, IMAGE_TYPES, MAX_DOCUMENT_BYTES, MAX_IMAGE_BYTES } from "@/constants/upload"
import { bookingRepository } from "@/repositories/booking.repository"
import { submissionRepository } from "@/repositories/submission.repository"
import { userRepository, type UserRow } from "@/repositories/user.repository"
import type { ProviderRequestValues, ContactValues, ReviewValues } from "@/schemas/submission.schema"
import { resolveServiceId } from "./catalog.service"
import { assertUploads, storeUpload } from "./file.service"

type Upload = { field: string; file: File }

export async function createContactMessage(v: ContactValues, user: UserRow | null, files: Upload[]) {
  await assertUploads(files, DOCUMENT_TYPES, MAX_DOCUMENT_BYTES)
  const row = await submissionRepository.createContactMessage({
    topic: v.topic,
    userId: user?.id ?? null,
    name: v.name,
    email: v.email.toLowerCase(),
    phone: v.phone ?? null,
    serviceId: await resolveServiceId(v.service),
    reference: v.reference ?? null,
    message: v.message,
    locale: v.locale,
  })
  for (const { field, file } of files) {
    await storeUpload(file, { field, kind: "CONTACT_ATTACHMENT", prefix: `private/contact/${row.id}`, allowed: DOCUMENT_TYPES, maxBytes: MAX_DOCUMENT_BYTES, link: { contactMessageId: row.id } })
  }
  return { id: row.id, createdAt: row.createdAt.toISOString() }
}

/** A user (or guest) asks to become a provider: the request row, then its documents. */
export async function createProviderRequest(v: ProviderRequestValues, user: UserRow | null, files: Upload[]) {
  await assertUploads(files, DOCUMENT_TYPES, MAX_DOCUMENT_BYTES)
  const serviceId = await resolveServiceId(v.service)
  const row = await submissionRepository.createProviderRequest({
    userId: user?.id ?? null,
    firstName: v.first,
    lastName: v.last,
    phone: v.phone,
    email: v.email?.toLowerCase() ?? user?.email ?? null,
    serviceId,
    addressBuilding: v.address_building ?? null,
    addressStreet: v.address_street ?? null,
    addressPostcode: v.address_postcode ?? null,
    city: v.city ?? null,
    languages: v.langs,
    experience: v.experience ?? null,
    about: v.about ?? null,
    hasCar: v.has_car ?? null,
    idType: v.id_type ?? null,
    licenceType: v.licence_type ?? null,
    authorized: v.authorized ?? null,
    locale: v.locale,
  })
  for (const { field, file } of files) {
    await storeUpload(file, {
      field,
      kind: "PROVIDER_DOCUMENT",
      prefix: `private/provider-requests/${row.id}`,
      allowed: DOCUMENT_TYPES,
      maxBytes: MAX_DOCUMENT_BYTES,
      link: { providerRequestId: row.id, documentType: field },
    })
  }
  // a signed-in requester becomes a professional account (the profile shows the request)
  if (user && user.role === "CUSTOMER") await userRepository.update(user.id, { role: "PRO" })
  return { id: row.id, service: v.service ?? null, at: row.createdAt.toISOString(), status: "received" }
}

export async function createReview(v: ReviewValues, user: UserRow | null, photos: Upload[]) {
  await assertUploads(photos, IMAGE_TYPES, MAX_IMAGE_BYTES)
  const booking = v.ref ? await bookingRepository.findByRef(v.ref) : null
  // a reference links the review to the booking only when it is this customer's (or a guest's)
  const ownBooking = booking && (!booking.userId || booking.userId === user?.id) ? booking : null
  const row = await submissionRepository.createReview({
    userId: user?.id ?? null,
    bookingId: ownBooking?.id ?? null,
    bookingRef: v.ref ?? null,
    serviceId: (await resolveServiceId(v.service)) ?? ownBooking?.serviceId ?? null,
    rating: v.rating,
    details: v.details ?? undefined,
    recommend: v.recommend ?? null,
    tags: v.tags,
    comment: v.comment ?? null,
    publish: v.publish ?? false,
    locale: v.locale,
  })
  for (const { field, file } of photos) {
    await storeUpload(file, { field, kind: "REVIEW_PHOTO", prefix: `private/reviews/${row.id}`, allowed: IMAGE_TYPES, maxBytes: MAX_IMAGE_BYTES, link: { reviewId: row.id } })
  }
  return { id: row.id, createdAt: row.createdAt.toISOString() }
}
