/**
 * Bookings: created when the customer confirms the summary in the booking chat (or the app),
 * as a guest or signed in; "my bookings" for the account page.
 */
import "server-only"
import { randomInt } from "node:crypto"
import { Prisma, type ContactMethod } from "@prisma/client"
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/constants/upload"
import type { Localized } from "@/i18n/config"
import { bookingRepository, type BookingRow } from "@/repositories/booking.repository"
import type { CreateBookingValues } from "@/schemas/booking.schema"
import { resolveServiceId } from "./catalog.service"
import { assertUploads, storeUpload } from "./file.service"

export type BookingStatusDto = "received" | "matched" | "scheduled" | "done" | "cancelled"

/** Same shape the account page renders. */
export interface BookingDto {
  ref: string
  /** service name (English) or the visitor's own words */
  service: string
  /** service slug, null for a free-text request */
  serviceId: string | null
  /** "YYYY-MM-DD", "ASAP" or "" */
  date: string
  time: string
  status: BookingStatusDto
  createdAt: string
}

export const toBooking = (r: BookingRow): BookingDto => ({
  ref: r.ref,
  service: r.service ? (r.service.name as unknown as Localized).en : (r.customService ?? ""),
  serviceId: r.service?.slug ?? null,
  date: r.asap ? "ASAP" : (r.date ?? ""),
  time: r.time ?? "",
  status: r.status.toLowerCase() as BookingStatusDto,
  createdAt: r.createdAt.toISOString(),
})

/** "LV-4821" like the design; widens to 6 digits if the 4-digit space gets crowded. */
async function newRef(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const ref = `LV-${i < 5 ? randomInt(1000, 10000) : randomInt(100000, 1000000)}`
    if (!(await bookingRepository.refExists(ref))) return ref
  }
  return `LV-${Date.now().toString().slice(-8)}`
}

export async function createBooking(v: CreateBookingValues, userId: string | null, photos: { field: string; file: File }[]): Promise<BookingDto> {
  await assertUploads(photos, IMAGE_TYPES, MAX_IMAGE_BYTES)
  const serviceId = await resolveServiceId(v.service)
  const data = {
    userId,
    serviceId,
    // an unknown slug is kept as free text rather than lost
    customService: serviceId ? null : (v.customService ?? v.service ?? null),
    date: v.date && v.date !== "ASAP" ? v.date : null,
    asap: v.date === "ASAP",
    time: v.time ?? null,
    name: v.name,
    address: v.address,
    phone: v.phone,
    contactMethod: (v.contact ?? null) as ContactMethod | null,
    email: v.email?.toLowerCase() ?? null,
    locale: v.locale,
  }
  let row: BookingRow | null = null
  for (let attempt = 0; !row; attempt++) {
    try {
      row = await bookingRepository.create({ ...data, ref: await newRef() })
    } catch (e) {
      // two bookings drew the same ref at the same time: draw again
      if (attempt > 2 || !(e instanceof Prisma.PrismaClientKnownRequestError) || e.code !== "P2002") throw e
    }
  }
  const id = row.id
  for (const { field, file } of photos) {
    await storeUpload(file, { field, kind: "BOOKING_PHOTO", prefix: `private/bookings/${id}`, allowed: IMAGE_TYPES, maxBytes: MAX_IMAGE_BYTES, link: { bookingId: id } })
  }
  return toBooking(row)
}

export async function listMyBookings(userId: string): Promise<BookingDto[]> {
  return (await bookingRepository.findForUser(userId)).map(toBooking)
}
