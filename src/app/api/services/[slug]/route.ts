/** GET /api/services/:slug — one visible service (public). */
import { route } from "@/lib/api"
import { absoluteUrl } from "@/lib/site-url"
import { getServiceBySlug } from "@/services/catalog.service"

export const GET = route<RouteContext<"/api/services/[slug]">>("services.get", async (_request, { params }) => {
  const { slug } = await params
  return getServiceBySlug(slug, absoluteUrl)
})
