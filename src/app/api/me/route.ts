/**
 * The signed-in account (cookie on the web, `Authorization: Bearer <Clerk session token>` in the app).
 *   GET    → profile
 *   PATCH  → update "My details" (JSON or form fields; only the keys sent are written)
 *   DELETE → delete the account, its request history and the Clerk user
 */
import { parse, readBody, route } from "@/lib/api"
import { absoluteUrl } from "@/lib/site-url"
import { updateProfileSchema } from "@/schemas/user.schema"
import { requireUser } from "@/services/auth.service"
import { deleteAccount, toMe, updateProfile } from "@/services/user.service"

export const GET = route("me.get", async () => toMe(await requireUser(), absoluteUrl))

export const PATCH = route("me.update", async (request) => {
  const user = await requireUser()
  const { fields } = await readBody(request)
  const values = parse(updateProfileSchema.partial(), fields)
  const sent = Object.fromEntries(Object.entries(values).filter(([k]) => k in fields))
  return toMe(await updateProfile(user, sent), absoluteUrl)
})

export const DELETE = route("me.delete", async () => {
  await deleteAccount(await requireUser())
  return { deleted: true }
})
