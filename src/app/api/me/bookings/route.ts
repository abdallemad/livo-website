/** GET /api/me/bookings — the signed-in account's bookings, newest first. */
import { route } from "@/lib/api"
import { requireUser } from "@/services/auth.service"
import { listMyBookings } from "@/services/booking.service"

export const GET = route("me.bookings", async () => listMyBookings((await requireUser()).id))
