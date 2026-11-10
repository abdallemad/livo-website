/**
 * PATCH /api/admin/reviews/:id — { isApproved }   DELETE — remove it (and its photos).
 * Admin only: authorise → validate → delegate (the service checks again).
 */
import { parse, readJson, route } from "@/lib/api"
import { requireAdmin } from "@/services/auth.service"
import { reviewUpdateSchema } from "@/schemas/admin.schema"
import { deleteReview, setReviewApproved } from "@/services/admin-actions.service"

export const PATCH = route<RouteContext<"/api/admin/reviews/[id]">>("admin.reviews.update", async (request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return setReviewApproved(id, parse(reviewUpdateSchema, await readJson(request)).isApproved)
})

export const DELETE = route<RouteContext<"/api/admin/reviews/[id]">>("admin.reviews.delete", async (_request, { params }) => {
  await requireAdmin() // authorise before reading anything
  const { id } = await params
  return deleteReview(id)
})
