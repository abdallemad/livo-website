/**
 * Admin dashboard reads (CLAUDE.md §2: repositories are the only Prisma callers, dumb queries).
 * Paged lists = findMany + count in one $transaction. Unlike the public catalogue reads these
 * return inactive rows too — the dashboard must see everything.
 */
import "server-only"
import type { BookingStatus, FileKind, Prisma, ProviderRequestStatus, Role } from "@prisma/client"
import { db } from "@/lib/db"

export interface PageArgs {
  page: number
  perPage: number
}

const skip = ({ page, perPage }: PageArgs) => ({ skip: (page - 1) * perPage, take: perPage })

const svc = { select: { slug: true, name: true, emoji: true } } as const
const fileKey = { select: { id: true, key: true, kind: true, mimeType: true, size: true, name: true, documentType: true, createdAt: true } } as const

export const bookingListSelect = {
  id: true,
  ref: true,
  name: true,
  email: true,
  phone: true,
  date: true,
  asap: true,
  time: true,
  status: true,
  customService: true,
  confirmedAt: true,
  createdAt: true,
  service: svc,
  user: { select: { id: true, firstName: true, lastName: true } },
  provider: { select: { id: true, firstName: true, lastName: true } },
} satisfies Prisma.BookingSelect

class AdminRepository {
  /* ---------- overview ---------- */
  overviewCounts(since: Date) {
    return db.$transaction([
      db.booking.count(),
      db.booking.count({ where: { createdAt: { gte: since } } }),
      db.booking.groupBy({ by: ["status"], _count: { _all: true }, orderBy: { status: "asc" } }),
      db.providerRequest.count({ where: { status: { in: ["RECEIVED", "IN_REVIEW"] } } }),
      db.user.groupBy({ by: ["role"], _count: { _all: true }, orderBy: { role: "asc" } }),
      db.review.count({ where: { isApproved: false } }),
      db.contactMessage.count({ where: { isHandled: false } }),
      db.service.count({ where: { isActive: true } }),
    ])
  }

  recentBookings(take: number) {
    return db.booking.findMany({ select: bookingListSelect, orderBy: { createdAt: "desc" }, take })
  }

  recentProviderRequests(take: number) {
    return db.providerRequest.findMany({
      select: { id: true, firstName: true, lastName: true, status: true, createdAt: true, city: true, service: svc },
      orderBy: { createdAt: "desc" },
      take,
    })
  }

  /* ---------- bookings ---------- */
  bookingsPage(where: Prisma.BookingWhereInput, page: PageArgs) {
    return db.$transaction([
      db.booking.findMany({ where, select: bookingListSelect, orderBy: { createdAt: "desc" }, ...skip(page) }),
      db.booking.count({ where }),
    ])
  }

  bookingStatusCounts() {
    return db.booking.groupBy({ by: ["status"], _count: { _all: true }, orderBy: { status: "asc" } })
  }

  booking(id: string) {
    return db.booking.findUnique({
      where: { id },
      include: {
        service: svc,
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        provider: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        photos: fileKey,
        reviews: { select: { id: true, rating: true, comment: true, createdAt: true } },
      },
    })
  }

  /* ---------- provider requests ---------- */
  providerRequestsPage(where: Prisma.ProviderRequestWhereInput, page: PageArgs) {
    return db.$transaction([
      db.providerRequest.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          city: true,
          languages: true,
          experience: true,
          status: true,
          createdAt: true,
          service: svc,
          _count: { select: { documents: true } },
        },
        orderBy: { createdAt: "desc" },
        ...skip(page),
      }),
      db.providerRequest.count({ where }),
    ])
  }

  providerRequestStatusCounts() {
    return db.providerRequest.groupBy({ by: ["status"], _count: { _all: true }, orderBy: { status: "asc" } })
  }

  providerRequest(id: string) {
    return db.providerRequest.findUnique({
      where: { id },
      include: { service: svc, user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } }, documents: fileKey },
    })
  }

  /* ---------- users ---------- */
  usersPage(where: Prisma.UserWhereInput, page: PageArgs) {
    return db.$transaction([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          city: true,
          createdAt: true,
          _count: { select: { bookings: true, providerRequests: true, reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        ...skip(page),
      }),
      db.user.count({ where }),
    ])
  }

  roleCounts() {
    return db.user.groupBy({ by: ["role"], _count: { _all: true }, orderBy: { role: "asc" } })
  }

  /* ---------- catalogue (all rows, active or not) ---------- */
  categories() {
    return db.serviceCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { banner: { select: { key: true } }, _count: { select: { services: true } } },
    })
  }

  services() {
    return db.service.findMany({
      orderBy: { sortOrder: "asc" },
      include: { category: { select: { slug: true, name: true } }, icon: { select: { key: true } }, _count: { select: { bookings: true, providerRequests: true } } },
    })
  }

  slides() {
    return db.heroSlide.findMany({ orderBy: { sortOrder: "asc" }, include: { desktop: { select: { key: true } }, mobile: { select: { key: true } } } })
  }

  towns() {
    return db.town.findMany({ orderBy: { sortOrder: "asc" } })
  }

  /* ---------- feedback ---------- */
  reviewsPage(where: Prisma.ReviewWhereInput, page: PageArgs) {
    return db.$transaction([
      db.review.findMany({
        where,
        include: { service: svc, user: { select: { firstName: true, lastName: true, email: true } }, _count: { select: { photos: true } } },
        orderBy: { createdAt: "desc" },
        ...skip(page),
      }),
      db.review.count({ where }),
    ])
  }

  messagesPage(where: Prisma.ContactMessageWhereInput, page: PageArgs) {
    return db.$transaction([
      db.contactMessage.findMany({
        where,
        include: { service: svc, attachments: fileKey },
        orderBy: { createdAt: "desc" },
        ...skip(page),
      }),
      db.contactMessage.count({ where }),
    ])
  }

  /* ---------- media ---------- */
  filesPage(where: Prisma.FileWhereInput, page: PageArgs) {
    return db.$transaction([db.file.findMany({ where, orderBy: { createdAt: "desc" }, ...skip(page) }), db.file.count({ where })])
  }

  fileKindCounts() {
    return db.file.groupBy({ by: ["kind"], _count: { _all: true }, _sum: { size: true }, orderBy: { kind: "asc" } })
  }

  file(id: string) {
    return db.file.findUnique({ where: { id } })
  }

  /* ---------- writes ---------- */
  updateBooking(id: string, data: Prisma.BookingUncheckedUpdateInput) {
    return db.booking.update({ where: { id }, data, select: { id: true, status: true, providerId: true } })
  }

  /** professionals an admin can assign to a booking */
  professionals() {
    return db.user.findMany({ where: { role: "PRO" }, select: { id: true, firstName: true, lastName: true, email: true, phone: true }, orderBy: [{ firstName: "asc" }, { lastName: "asc" }] })
  }

  userRole(id: string) {
    return db.user.findUnique({ where: { id }, select: { id: true, role: true } })
  }

  countAdmins() {
    return db.user.count({ where: { role: "ADMIN" } })
  }

  updateUserRole(id: string, role: Role) {
    return db.user.update({ where: { id }, data: { role }, select: { id: true, role: true } })
  }

  providerRequestOwner(id: string) {
    return db.providerRequest.findUnique({ where: { id }, select: { id: true, userId: true, user: { select: { role: true } } } })
  }

  /** status change + (on approval) the linked account becomes PRO — one transaction */
  updateProviderRequest(id: string, data: Prisma.ProviderRequestUncheckedUpdateInput, promoteUserId?: string) {
    return db.$transaction(async (tx) => {
      const row = await tx.providerRequest.update({ where: { id }, data, select: { id: true, status: true } })
      if (promoteUserId) await tx.user.updateMany({ where: { id: promoteUserId, role: "CUSTOMER" }, data: { role: "PRO" } })
      return row
    })
  }

  updateReview(id: string, data: Prisma.ReviewUpdateInput) {
    return db.review.update({ where: { id }, data, select: { id: true, isApproved: true } })
  }

  /** file keys to remove from R2 before deleting the row (File rows cascade) */
  reviewFileKeys(id: string) {
    return db.file.findMany({ where: { reviewId: id }, select: { key: true } })
  }

  deleteReview(id: string) {
    return db.review.delete({ where: { id }, select: { id: true } })
  }

  updateMessage(id: string, data: Prisma.ContactMessageUpdateInput) {
    return db.contactMessage.update({ where: { id }, data, select: { id: true, isHandled: true } })
  }

  messageFileKeys(id: string) {
    return db.file.findMany({ where: { contactMessageId: id }, select: { key: true } })
  }

  deleteMessage(id: string) {
    return db.contactMessage.delete({ where: { id }, select: { id: true } })
  }

  service(id: string) {
    return db.service.findUnique({ where: { id }, include: { category: { select: { id: true } } } })
  }

  updateService(id: string, data: Prisma.ServiceUncheckedUpdateInput) {
    return db.service.update({ where: { id }, data, select: { id: true } })
  }

  categoryExists(id: string) {
    return db.serviceCategory.findUnique({ where: { id }, select: { id: true } }).then(Boolean)
  }

  category(id: string) {
    return db.serviceCategory.findUnique({ where: { id } })
  }

  updateCategory(id: string, data: Prisma.ServiceCategoryUpdateInput) {
    return db.serviceCategory.update({ where: { id }, data, select: { id: true } })
  }

  updateSlide(id: string, data: Prisma.HeroSlideUpdateInput) {
    return db.heroSlide.update({ where: { id }, data, select: { id: true } })
  }

  nextTownOrder() {
    return db.town.aggregate({ _max: { sortOrder: true } }).then((r) => (r._max.sortOrder ?? -1) + 1)
  }

  createTown(data: Prisma.TownCreateInput) {
    return db.town.create({ data })
  }

  updateTown(id: string, data: Prisma.TownUpdateInput) {
    return db.town.update({ where: { id }, data })
  }

  deleteTown(id: string) {
    return db.town.delete({ where: { id }, select: { id: true } })
  }
}

export const adminRepository = new AdminRepository()
export type { BookingStatus, FileKind, ProviderRequestStatus, Role }
