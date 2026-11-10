/**
 * POST /api/provider-requests — a user (or guest) asks to become a provider: creates a
 * ProviderRequest with their details and documents (multipart; JSON without documents works too).
 * A signed-in requester is linked to it and switched to a professional account.
 */
import { NextResponse } from "next/server"
import { parse, readBody, route } from "@/lib/api"
import { PROVIDER_DOCUMENTS, providerRequestSchema } from "@/schemas/submission.schema"
import { getOptionalUser } from "@/services/auth.service"
import { collectFiles } from "@/services/file.service"
import { createProviderRequest } from "@/services/submission.service"
import { apiSuccess } from "@/types/api"

export const POST = route("providerRequests.create", async (request) => {
  const user = await getOptionalUser()
  const { fields, files } = await readBody(request)
  const values = parse(providerRequestSchema, fields)
  const created = await createProviderRequest(values, user, collectFiles(files, PROVIDER_DOCUMENTS))
  return NextResponse.json(apiSuccess(created), { status: 201 })
})
