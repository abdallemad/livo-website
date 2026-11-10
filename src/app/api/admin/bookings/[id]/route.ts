/**
 * PATCH /api/admin/bookings/:id — { status?, providerId? (PRO user id | null), adminNote? }.
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { bookingUpdateSchema } from "@/schemas/admin.schema"
import { updateBooking } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/bookings/[id]">>("admin.bookings.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return updateBooking(id, parse(bookingUpdateSchema, await readJson(request)))
})
