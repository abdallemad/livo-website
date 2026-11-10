/**
 * Who is calling, and the Clerk → database sync (CLAUDE.md §5).
 *
 * `auth()` reads the Clerk session from the cookie (web) or from `Authorization: Bearer <token>`
 * (mobile app) — both go through clerkMiddleware in src/proxy.ts. `User.id` is the Clerk user id.
 */
import "server-only"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"
import { isLocale, type Locale } from "@/i18n/config"
import { ForbiddenError, UnauthorizedError } from "@/lib/errors"
import { bookingRepository } from "@/repositories/booking.repository"
import { userRepository, type UserRow } from "@/repositories/user.repository"

export async function getSessionUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}

export async function requireUserId(): Promise<string> {
  const id = await getSessionUserId()
  if (!id) throw new UnauthorizedError()
  return id
}

/** The signed-in user's row, created on the fly if the callback never ran (e.g. mobile). */
export async function requireUser(): Promise<UserRow> {
  const id = await requireUserId()
  return (await userRepository.findById(id)) ?? syncUserWithDatabase(id)
}

/** Forms open to guests (booking chat, contact, join, review) link the account when there is one. */
export async function getOptionalUser(): Promise<UserRow | null> {
  const id = await getSessionUserId()
  if (!id) return null
  return (await userRepository.findById(id)) ?? syncUserWithDatabase(id)
}

/**
 * Emails allowed to become ADMIN (`ADMIN_EMAIL`, comma-separated). Compared ONLY with the
 * Clerk-verified primary email — never with the profile email, which the user can edit.
 */
export function isAdminEmail(verifiedEmail: string | null | undefined): boolean {
  if (!verifiedEmail) return false
  const list = (process.env.ADMIN_EMAIL ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
  return list.includes(verifiedEmail.toLowerCase())
}

/**
 * Is this Clerk user an admin? The DB role decides; a user whose verified email is in ADMIN_EMAIL
 * but not yet ADMIN (env set after their first sign-in) is promoted here, through a fresh sync.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  const user = await userRepository.findById(userId)
  if (user?.role === "ADMIN") return true
  if (!process.env.ADMIN_EMAIL) return false
  return (await syncUserWithDatabase(userId)).role === "ADMIN"
}

/** Admin pages, admin API routes. A non-admin gets 403 here (the /admin pages answer 404). */
export async function requireAdmin(): Promise<UserRow> {
  const id = await requireUserId()
  if (!(await isAdminUser(id))) throw new ForbiddenError()
  return (await userRepository.findById(id))!
}

/**
 * Create (first sign-in) or complete the database row for a Clerk user. Race-safe: two
 * concurrent first requests both try to create; the loser (P2002 on id) re-reads the row.
 * Accounts are never merged by email — if another row already holds this email (an older
 * Clerk account), the new row is created without one.
 *
 * The DB copy of names/email is a first-sign-in snapshot: later edits on the profile page win,
 * so an existing row only gets its *missing* fields filled.
 */
export async function syncUserWithDatabase(userId: string, locale?: string): Promise<UserRow> {
  const clerk = await clerkClient()
  const cu = await clerk.users.getUser(userId)
  const primary = cu.emailAddresses.find((e) => e.id === cu.primaryEmailAddressId)
  const email = primary?.verification?.status === "verified" ? primary.emailAddress.toLowerCase() : null
  const lang: Locale = isLocale(locale) ? locale : "en"

  let user = await userRepository.findById(userId)
  if (user) {
    const missing: Prisma.UserUncheckedUpdateInput = {}
    if (!user.email && email && !(await userRepository.findByEmail(email))) missing.email = email
    if (!user.firstName && cu.firstName) missing.firstName = cu.firstName
    if (!user.lastName && cu.lastName) missing.lastName = cu.lastName
    // promote only: removing an email from ADMIN_EMAIL never silently demotes (do that in the dashboard)
    if (user.role !== "ADMIN" && isAdminEmail(email)) missing.role = "ADMIN"
    if (Object.keys(missing).length) user = await userRepository.update(userId, missing)
  } else {
    const data = { id: userId, email, firstName: cu.firstName, lastName: cu.lastName, locale: lang, role: isAdminEmail(email) ? ("ADMIN" as const) : ("CUSTOMER" as const) }
    try {
      user = await userRepository.create(data)
    } catch (e) {
      if (!(e instanceof Prisma.PrismaClientKnownRequestError) || e.code !== "P2002") throw e
      const target = String((e.meta as { target?: unknown } | undefined)?.target ?? "")
      user = target.includes("email") ? await userRepository.create({ ...data, email: null }) : await userRepository.findById(userId)
      if (!user) throw e
    }
  }

  // bookings made in the chat as a guest with this verified email now belong to the account
  if (user.email) await bookingRepository.claimGuestBookings(user.id, user.email)
  return user
}
