/**
 * PATCH /api/admin/services/:id — { emoji?, name?, description?, subServices?, categoryId?, featured?, isActive?, sortOrder? }.
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { serviceUpdateSchema } from "@/schemas/admin.schema"
import { updateService } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/services/[id]">>("admin.services.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return updateService(id, parse(serviceUpdateSchema, await readJson(request)))
})
