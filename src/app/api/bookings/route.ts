/**
 * POST /api/bookings — creates a booking. Call it when the customer CONFIRMS the summary (the
 * web chat's "Confirm booking" button; the same in the app). Guests allowed; a signed-in caller
 * owns it. JSON, or multipart with up to 12 images in "photos". Answers 201 with the booking.
 */
import { NextResponse } from "next/server"
import { parse, readBody, route } from "@/lib/api"
import { createBookingSchema } from "@/schemas/booking.schema"
import { getOptionalUser } from "@/services/auth.service"
import { collectFiles } from "@/services/file.service"
import { createBooking } from "@/services/booking.service"
import { apiSuccess } from "@/types/api"

export const POST = route("bookings.create", async (request) => {
  const user = await getOptionalUser()
  const { fields, files } = await readBody(request)
  const values = parse(createBookingSchema, fields)
  const created = await createBooking(values, user?.id ?? null, collectFiles(files, ["photos"]))
  return NextResponse.json(apiSuccess(created), { status: 201 })
})
