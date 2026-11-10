/**
 * POST /api/admin/towns — { name } adds a town at the end of the list. Admin only.
 */
import { NextResponse } from "next/server"
import { parse, readJson, route } from "@/lib/api"
import { townCreateSchema } from "@/schemas/admin.schema"
import { createTown } from "@/services/admin-actions.service"
import { requireAdmin } from "@/services/auth.service"
import { apiSuccess } from "@/types/api"

export const POST = route("admin.towns.create", async (request) => {
  await requireAdmin() // authorise before reading the body
  const { name } = parse(townCreateSchema, await readJson(request))
  return NextResponse.json(apiSuccess(await createTown(name)), { status: 201 })
})
