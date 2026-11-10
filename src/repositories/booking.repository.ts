import "server-only"
import type { Prisma } from "@prisma/client"
import { db } from "@/lib/db"

export const bookingInclude = { service: { select: { slug: true, name: true, emoji: true } } } satisfies Prisma.BookingInclude
export type BookingRow = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>

class BookingRepository {
  create(data: Prisma.BookingUncheckedCreateInput): Promise<BookingRow> {
    return db.booking.create({ data, include: bookingInclude })
  }

  refExists(ref: string) {
    return db.booking.findUnique({ where: { ref }, select: { id: true } }).then(Boolean)
  }

  findByRef(ref: string) {
    return db.booking.findUnique({ where: { ref }, select: { id: true, userId: true, email: true, serviceId: true } })
  }

  findForUser(userId: string): Promise<BookingRow[]> {
    return db.booking.findMany({ where: { userId }, include: bookingInclude, orderBy: { createdAt: "desc" } })
  }

  /** guest bookings made with this (verified) email before the account existed */
  claimGuestBookings(userId: string, email: string) {
    return db.booking.updateMany({ where: { userId: null, email: { equals: email, mode: "insensitive" } }, data: { userId } })
  }
}

export const bookingRepository = new BookingRepository()
