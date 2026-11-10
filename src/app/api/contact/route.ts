/** POST /api/contact — contact page (general / inquiry / complaint). Optional attachment "file". */
import { NextResponse } from "next/server"
import { parse, readBody, route } from "@/lib/api"
import { contactSchema } from "@/schemas/submission.schema"
import { getOptionalUser } from "@/services/auth.service"
import { collectFiles } from "@/services/file.service"
import { createContactMessage } from "@/services/submission.service"
import { apiSuccess } from "@/types/api"

export const POST = route("contact.create", async (request) => {
  const user = await getOptionalUser()
  const { fields, files } = await readBody(request)
  const values = parse(contactSchema, fields)
  const created = await createContactMessage(values, user, collectFiles(files, ["file"]))
  return NextResponse.json(apiSuccess(created), { status: 201 })
})
