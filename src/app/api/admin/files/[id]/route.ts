/**
 * GET /api/admin/files/:id — an admin opens a stored file (provider documents, booking/review
 * photos, contact attachments — all private in R2). Admin only (layer 3). Images and PDFs open
 * inline in a sandbox; anything else downloads.
 */
import { NextResponse } from "next/server"
import { isAppError, HTTP_STATUS } from "@/lib/errors"
import { getObject } from "@/lib/r2.provider"
import { getFileForAdmin } from "@/services/admin.service"

const INLINE = /^(image\/(jpeg|png|webp|gif)|application\/pdf)$/

export async function GET(_request: Request, { params }: RouteContext<"/api/admin/files/[id]">) {
  const { id } = await params
  try {
    const file = await getFileForAdmin(id)
    const obj = await getObject(file.key)
    const name = (file.name || file.key.split("/").pop() || "file").replace(/[^\w.\- ]+/g, "_")
    const inline = INLINE.test(file.mimeType)
    return new NextResponse(obj.Body!.transformToWebStream(), {
      headers: {
        "Content-Type": inline ? file.mimeType : "application/octet-stream",
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${name}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox; default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
      },
    })
  } catch (e) {
    if (isAppError(e)) return new NextResponse(e.message, { status: HTTP_STATUS[e.code] })
    console.error("[api] admin.files", id, e)
    return new NextResponse("File unavailable", { status: 502 })
  }
}
