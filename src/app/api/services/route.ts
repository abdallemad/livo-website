/** GET /api/services?category=repairs&featured=1 — visible services (public). */
import { route } from "@/lib/api"
import { absoluteUrl } from "@/lib/site-url"
import { listServices } from "@/services/catalog.service"

export const GET = route("services.list", async (request) => {
  const q = new URL(request.url).searchParams
  const featured = q.get("featured") === "1" || q.get("featured") === "true"
  return listServices({ category: q.get("category") ?? undefined, featured }, absoluteUrl)
})
