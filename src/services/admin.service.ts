/**
 * Admin dashboard reads. The admin pages are read-only Server Component trees, so (CLAUDE.md §2's
 * documented exception) they call these services directly — never a repository. Every function
 * starts with `requireAdmin()` (layer 3 of the /admin gate), so nothing here is reachable by
 * accident from another page. Rows are mapped to plain DTOs: localised JSON becomes English text
 * and enums stay as their string values.
 */
import "server-only"
import type { Prisma } from "@prisma/client"
import type { Localized } from "@/i18n/config"
import { NotFoundError } from "@/lib/errors"
import { adminRepository, type BookingStatus, type FileKind, type ProviderRequestStatus, type Role } from "@/repositories/admin.repository"
import { requireAdmin } from "./auth.service"
import { imageUrl } from "./file.service"

export const ADMIN_PER_PAGE = 20

export const BOOKING_STATUSES: BookingStatus[] = ["RECEIVED", "MATCHED", "SCHEDULED", "DONE", "CANCELLED"]
export const PROVIDER_REQUEST_STATUSES: ProviderRequestStatus[] = ["RECEIVED", "IN_REVIEW", "APPROVED", "REJECTED"]
export const ROLES: Role[] = ["CUSTOMER", "PRO", "ADMIN"]
export const FILE_KINDS: FileKind[] = ["STATIC", "AVATAR", "BOOKING_PHOTO", "REVIEW_PHOTO", "PROVIDER_DOCUMENT", "CONTACT_ATTACHMENT"]

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  pageCount: number
}

const en = (v: Prisma.JsonValue | null | undefined) => (v && typeof v === "object" && !Array.isArray(v) ? ((v as unknown as Localized).en ?? "") : "")
const fullName = (u: { firstName: string | null; lastName: string | null } | null | undefined) => (u ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "")
const paged = <T,>(items: T[], total: number, page: number): Paginated<T> => ({ items, total, page, perPage: ADMIN_PER_PAGE, pageCount: Math.max(1, Math.ceil(total / ADMIN_PER_PAGE)) })
/** groupBy rows → { VALUE: count } */
const counts = <K extends string>(rows: readonly object[], field: string) =>
  Object.fromEntries((rows as Record<string, unknown>[]).map((r) => [r[field], (r._count as { _all: number })._all])) as Partial<Record<K, number>>
/** case-insensitive "contains" on several text columns */
const search = (q: string | undefined, fields: string[]) => (q ? { OR: fields.map((f) => ({ [f]: { contains: q, mode: "insensitive" } })) } : {})

export interface ListQuery {
  page: number
  q?: string
  status?: string
}

/* ---------------- overview ---------------- */

export async function getOverview() {
  await requireAdmin()
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000)
  const [bookings, bookingsThisWeek, byStatus, openProviderRequests, byRole, reviewsToApprove, openMessages, activeServices] = await adminRepository.overviewCounts(weekAgo)
  const [recentBookings, recentProviderRequests] = await Promise.all([adminRepository.recentBookings(6), adminRepository.recentProviderRequests(6)])
  return {
    bookings,
    bookingsThisWeek,
    bookingsByStatus: counts<BookingStatus>(byStatus, "status"),
    openProviderRequests,
    usersByRole: counts<Role>(byRole, "role"),
    reviewsToApprove,
    openMessages,
    activeServices,
    recentBookings: recentBookings.map(toBookingRow),
    recentProviderRequests: recentProviderRequests.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      service: p.service ? `${p.service.emoji} ${en(p.service.name)}` : "—",
      city: p.city ?? "",
      status: p.status,
      createdAt: p.createdAt,
    })),
  }
}

/* ---------------- bookings ---------------- */

type BookingListRow = Awaited<ReturnType<typeof adminRepository.recentBookings>>[number]

function toBookingRow(b: BookingListRow) {
  return {
    id: b.id,
    ref: b.ref,
    customer: b.name,
    email: b.email ?? "",
    phone: b.phone,
    accountId: b.user?.id ?? null,
    service: b.service ? `${b.service.emoji} ${en(b.service.name)}` : (b.customService ?? "—"),
    when: b.asap ? "ASAP" : [b.date, b.time].filter(Boolean).join(" · ") || "—",
    provider: fullName(b.provider),
    status: b.status,
    confirmedAt: b.confirmedAt,
  }
}
export type AdminBookingRow = ReturnType<typeof toBookingRow>

export async function listBookings(query: ListQuery) {
  await requireAdmin()
  const status = BOOKING_STATUSES.find((s) => s === query.status)
  const where: Prisma.BookingWhereInput = { ...(status ? { status } : {}), ...search(query.q, ["ref", "name", "email", "phone", "address"]) }
  const [[rows, total], byStatus] = await Promise.all([adminRepository.bookingsPage(where, { page: query.page, perPage: ADMIN_PER_PAGE }), adminRepository.bookingStatusCounts()])
  return { ...paged(rows.map(toBookingRow), total, query.page), byStatus: counts<BookingStatus>(byStatus, "status") }
}

export async function getBooking(id: string) {
  await requireAdmin()
  const b = await adminRepository.booking(id)
  if (!b) throw new NotFoundError("Booking not found.")
  return {
    ...b,
    serviceName: b.service ? `${b.service.emoji} ${en(b.service.name)}` : (b.customService ?? "—"),
    accountName: fullName(b.user),
    providerName: fullName(b.provider),
  }
}

/* ---------------- provider requests ---------------- */

export async function listProviderRequests(query: ListQuery) {
  await requireAdmin()
  const status = PROVIDER_REQUEST_STATUSES.find((s) => s === query.status)
  const where: Prisma.ProviderRequestWhereInput = { ...(status ? { status } : {}), ...search(query.q, ["firstName", "lastName", "email", "phone", "city"]) }
  const [[rows, total], byStatus] = await Promise.all([
    adminRepository.providerRequestsPage(where, { page: query.page, perPage: ADMIN_PER_PAGE }),
    adminRepository.providerRequestStatusCounts(),
  ])
  const items = rows.map((p) => ({
    id: p.id,
    name: `${p.firstName} ${p.lastName}`,
    contact: [p.phone, p.email].filter(Boolean).join(" · "),
    service: p.service ? `${p.service.emoji} ${en(p.service.name)}` : "—",
    city: p.city ?? "",
    languages: p.languages,
    experience: p.experience ?? "",
    documents: p._count.documents,
    status: p.status,
    createdAt: p.createdAt,
  }))
  return { ...paged(items, total, query.page), byStatus: counts<ProviderRequestStatus>(byStatus, "status") }
}

export async function getProviderRequest(id: string) {
  await requireAdmin()
  const p = await adminRepository.providerRequest(id)
  if (!p) throw new NotFoundError("Provider request not found.")
  return { ...p, serviceName: p.service ? `${p.service.emoji} ${en(p.service.name)}` : "—", accountName: fullName(p.user) }
}

/* ---------------- users ---------------- */

export async function listUsers(query: ListQuery) {
  const me = await requireAdmin()
  const role = ROLES.find((r) => r === query.status)
  const where: Prisma.UserWhereInput = { ...(role ? { role } : {}), ...search(query.q, ["email", "firstName", "lastName", "phone", "city"]) }
  const [[rows, total], byRole] = await Promise.all([adminRepository.usersPage(where, { page: query.page, perPage: ADMIN_PER_PAGE }), adminRepository.roleCounts()])
  const items = rows.map((u) => ({
    id: u.id,
    name: fullName(u) || "—",
    email: u.email ?? "",
    phone: u.phone ?? "",
    role: u.role,
    city: u.city ?? "",
    bookings: u._count.bookings,
    providerRequests: u._count.providerRequests,
    reviews: u._count.reviews,
    createdAt: u.createdAt,
  }))
  return { ...paged(items, total, query.page), byRole: counts<Role>(byRole, "role"), meId: me.id }
}

/* ---------------- catalogue ---------------- */

export async function listCategoriesAdmin() {
  await requireAdmin()
  return (await adminRepository.categories()).map((c) => ({
    id: c.id,
    slug: c.slug,
    emoji: c.emoji,
    name: en(c.name),
    colors: [c.colorFrom, c.colorTo] as const,
    banner: imageUrl(c.banner?.key),
    services: c._count.services,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
  }))
}

export async function listServicesAdmin() {
  await requireAdmin()
  return (await adminRepository.services()).map((s) => ({
    id: s.id,
    slug: s.slug,
    emoji: s.emoji,
    name: en(s.name),
    category: en(s.category.name),
    icon: imageUrl(s.icon?.key),
    featured: s.featured,
    bookings: s._count.bookings,
    providerRequests: s._count.providerRequests,
    sortOrder: s.sortOrder,
    isActive: s.isActive,
  }))
}

export async function listSlidesAdmin() {
  await requireAdmin()
  return (await adminRepository.slides()).map((s) => {
    const c = s.content as { tag?: Localized; title?: Localized }
    return {
      id: s.id,
      key: s.key,
      tag: c.tag?.en ?? "",
      title: (c.title?.en ?? "").replaceAll("*", ""),
      desktop: imageUrl(s.desktop?.key),
      mobile: imageUrl(s.mobile?.key),
      sortOrder: s.sortOrder,
      isActive: s.isActive,
    }
  })
}

export async function listTownsAdmin() {
  await requireAdmin()
  return adminRepository.towns()
}

/* ---------------- feedback ---------------- */

export async function listReviews(query: ListQuery) {
  await requireAdmin()
  const where: Prisma.ReviewWhereInput = {
    ...(query.status === "pending" ? { isApproved: false } : query.status === "approved" ? { isApproved: true } : {}),
    ...search(query.q, ["comment", "bookingRef"]),
  }
  const [rows, total] = await adminRepository.reviewsPage(where, { page: query.page, perPage: ADMIN_PER_PAGE })
  const items = rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment ?? "",
    tags: r.tags,
    service: r.service ? `${r.service.emoji} ${en(r.service.name)}` : "—",
    author: fullName(r.user) || r.user?.email || "Guest",
    bookingRef: r.bookingRef ?? "",
    publish: r.publish,
    isApproved: r.isApproved,
    photos: r._count.photos,
    createdAt: r.createdAt,
  }))
  return paged(items, total, query.page)
}

export async function listMessages(query: ListQuery) {
  await requireAdmin()
  const topic = (["GENERAL", "INQUIRY", "COMPLAINT"] as const).find((t) => t === query.status)
  const where: Prisma.ContactMessageWhereInput = {
    ...(topic ? { topic } : query.status === "open" ? { isHandled: false } : {}),
    ...search(query.q, ["name", "email", "message", "reference"]),
  }
  const [rows, total] = await adminRepository.messagesPage(where, { page: query.page, perPage: ADMIN_PER_PAGE })
  const items = rows.map((m) => ({
    id: m.id,
    topic: m.topic,
    name: m.name,
    email: m.email,
    phone: m.phone ?? "",
    service: m.service ? `${m.service.emoji} ${en(m.service.name)}` : "",
    reference: m.reference ?? "",
    message: m.message,
    attachments: m.attachments.map((a) => ({ id: a.id, name: a.name ?? a.key.split("/").pop()!, size: a.size })),
    isHandled: m.isHandled,
    createdAt: m.createdAt,
  }))
  return paged(items, total, query.page)
}

/* ---------------- media ---------------- */

export async function listFiles(query: ListQuery) {
  await requireAdmin()
  const kind = FILE_KINDS.find((k) => k === query.status)
  const where: Prisma.FileWhereInput = { ...(kind ? { kind } : {}), ...search(query.q, ["key", "name"]) }
  const [[rows, total], byKind] = await Promise.all([adminRepository.filesPage(where, { page: query.page, perPage: ADMIN_PER_PAGE }), adminRepository.fileKindCounts()])
  const items = rows.map((f) => ({
    id: f.id,
    key: f.key,
    kind: f.kind,
    name: f.name ?? "",
    mimeType: f.mimeType,
    size: f.size,
    createdAt: f.createdAt,
  }))
  return {
    ...paged(items, total, query.page),
    byKind: byKind.map((k) => ({ kind: k.kind, count: k._count._all, bytes: k._sum.size ?? 0 })),
  }
}

/** For the admin file route: the row, after the admin check. */
export async function getFileForAdmin(id: string) {
  await requireAdmin()
  const f = await adminRepository.file(id)
  if (!f) throw new NotFoundError("File not found.")
  return f
}
