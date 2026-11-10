/**
 * PATCH /api/admin/categories/:id — { emoji?, name?, colorFrom?, colorTo?, isActive?, sortOrder? }.
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { categoryUpdateSchema } from "@/schemas/admin.schema"
import { updateCategory } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/categories/[id]">>("admin.categories.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return updateCategory(id, parse(categoryUpdateSchema, await readJson(request)))
})
