/**
 * PATCH /api/admin/messages/:id — { isHandled }   DELETE — remove it (and its attachments).
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { messageUpdateSchema } from "@/schemas/admin.schema"
import { deleteMessage, setMessageHandled } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/messages/[id]">>("admin.messages.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return setMessageHandled(id, parse(messageUpdateSchema, await readJson(request)).isHandled)
})

export const DELETE = route<RouteContext<"/api/admin/messages/[id]">>("admin.messages.delete", async (_request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return deleteMessage(id)
})
