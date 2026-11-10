/**
 * PATCH /api/admin/users/:id — { role }. Not your own role; never the last admin.
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { userRoleSchema } from "@/schemas/admin.schema"
import { setUserRole } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/users/[id]">>("admin.users.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return setUserRole(id, parse(userRoleSchema, await readJson(request)).role)
})
