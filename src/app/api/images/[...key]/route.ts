/**
 * GET /api/images/<key> — streams a PUBLIC object from the private R2 bucket (CLAUDE.md §7).
 *
 * Only keys under `static/` (site artwork) and `avatars/` can be built here, so documents,
 * request photos and contact attachments are unreachable. next.config.mjs rewrites `/img/*` to
 * `static/img/*` through this route, so the design's image URLs (including the ones in CSS) are
 * served from R2 without changing a single path.
 */
import { NextResponse } from "next/server"
import { PUBLIC_PREFIXES, getObject } from "@/lib/r2.provider"

export async function GET(request: Request, { params }: RouteContext<"/api/images/[...key]">) {
  const { key: parts } = await params
  const key = parts.map(decodeURIComponent).join("/")
  if (parts.some((p) => p === ".." || p === "." || p === "") || !PUBLIC_PREFIXES.some((p) => key.startsWith(p))) {
    return new NextResponse("Not found", { status: 404 })
  }
  try {
    const ifNoneMatch = request.headers.get("if-none-match")
    const obj = await getObject(key)
    if (ifNoneMatch && obj.ETag && ifNoneMatch === obj.ETag) {
      obj.Body?.transformToWebStream().cancel()
      return new NextResponse(null, { status: 304, headers: { ETag: obj.ETag } })
    }
    const headers = new Headers({
      "Content-Type": obj.ContentType ?? "application/octet-stream",
      // avatars have unique keys (immutable); site artwork keeps its path, so it revalidates daily
      "Cache-Control": key.startsWith("avatars/") ? "public, max-age=31536000, immutable" : "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    })
    if (obj.ETag) headers.set("ETag", obj.ETag)
    if (obj.ContentLength !== undefined) headers.set("Content-Length", String(obj.ContentLength))
    return new NextResponse(obj.Body!.transformToWebStream(), { headers })
  } catch (e) {
    const name = (e as { name?: string }).name
    if (name === "NoSuchKey" || name === "NotFound") return new NextResponse("Not found", { status: 404 })
    console.error("[api] images", key, e)
    return new NextResponse("Image unavailable", { status: 502 })
  }
}
