/**
 * PATCH /api/admin/provider-requests/:id — { status?, adminNote? }.
 * APPROVED turns a linked customer account into a professional one.
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { providerRequestUpdateSchema } from "@/schemas/admin.schema"
import { updateProviderRequest } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/provider-requests/[id]">>("admin.providerRequests.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return updateProviderRequest(id, parse(providerRequestUpdateSchema, await readJson(request)))
})
