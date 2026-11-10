/** POST /api/reviews — rating after a job (/review?service=…&ref=…). Optional images in "photos". */
import { NextResponse } from "next/server"
import { parse, readBody, route } from "@/lib/api"
import { reviewSchema } from "@/schemas/submission.schema"
import { getOptionalUser } from "@/services/auth.service"
import { collectFiles } from "@/services/file.service"
import { createReview } from "@/services/submission.service"
import { apiSuccess } from "@/types/api"

export const POST = route("reviews.create", async (request) => {
  const user = await getOptionalUser()
  const { fields, files } = await readBody(request)
  const values = parse(reviewSchema, fields)
  const created = await createReview(values, user, collectFiles(files, ["photos"]))
  return NextResponse.json(apiSuccess(created), { status: 201 })
})
