/**
 * PATCH /api/admin/slides/:id — { isActive?, sortOrder? }.
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { slideUpdateSchema } from "@/schemas/admin.schema"
import { updateSlide } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/slides/[id]">>("admin.slides.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return updateSlide(id, parse(slideUpdateSchema, await readJson(request)))
})
