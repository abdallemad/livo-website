/**
 * POST /api/auth/sync — the mobile app's equivalent of /auth-callback: call it once after
 * sign-in / sign-up (with the Clerk session token) to create or complete the database user.
 * Optional JSON body: { "locale": "fr" }.
 */
import { readJson, route } from "@/lib/api"
import { absoluteUrl } from "@/lib/site-url"
import { requireUserId, syncUserWithDatabase } from "@/services/auth.service"
import { toMe } from "@/services/user.service"

export const POST = route("auth.sync", async (request) => {
  const userId = await requireUserId()
  const isJson = request.headers.get("content-type")?.includes("json")
  const body = isJson ? ((await readJson(request)) as { locale?: string } | null) : null
  return toMe(await syncUserWithDatabase(userId, body?.locale), absoluteUrl)
})
