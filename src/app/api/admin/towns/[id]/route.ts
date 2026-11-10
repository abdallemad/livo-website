/**
 * PATCH /api/admin/towns/:id — { name?, isActive?, sortOrder? }   DELETE — remove it.
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { townUpdateSchema } from "@/schemas/admin.schema"
import { deleteTown, updateTown } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/towns/[id]">>("admin.towns.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return updateTown(id, parse(townUpdateSchema, await readJson(request)))
})

export const DELETE = route<RouteContext<"/api/admin/towns/[id]">>("admin.towns.delete", async (_request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return deleteTown(id)
})
