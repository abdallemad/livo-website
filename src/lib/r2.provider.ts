/**
 * Cloudflare R2 (S3 API), private bucket (CLAUDE.md §7).
 *
 * Key prefixes — one per purpose, so a route can never build another purpose's key:
 *   static/img/…            site artwork uploaded from public/img (scripts/upload-static-assets.mjs)
 *   avatars/<userId>/…      profile photos                         } served by /api/images
 *   private/bookings/…      booking photos                         }
 *   private/reviews/…       review photos                          } never served publicly
 *   private/provider-requests/… provider documents (IDs, licences) }
 *   private/contact/…       contact-form attachments               }
 *
 * The bucket also holds objects from an older project (uploads/, private/verification/…):
 * nothing here lists or deletes outside its own prefixes.
 */
import "server-only"
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

export const PUBLIC_PREFIXES = ["static/", "avatars/"] as const

let client: S3Client | null = null

export function r2Configured(): boolean {
  return !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME)
}

function r2(): S3Client {
  if (!r2Configured()) throw new Error("R2 is not configured (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME)")
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
  })
  return client
}

const bucket = () => process.env.R2_BUCKET_NAME!

export async function putObject(key: string, body: Uint8Array, contentType: string, cacheControl?: string) {
  await r2().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType, CacheControl: cacheControl }))
}

export async function getObject(key: string) {
  return r2().send(new GetObjectCommand({ Bucket: bucket(), Key: key }))
}

export async function deleteObject(key: string) {
  await r2().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }))
}

/**
 * Public host for images, when the bucket (or an images-only bucket) has one (r2.dev or a custom
 * domain). The S3 API endpoint (`*.r2.cloudflarestorage.com`) is NOT public — it needs signed
 * requests — so it is ignored here and images are streamed by /api/images instead.
 */
export function publicImageHost(): string | null {
  const raw = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/+$/, "")
  if (!raw) return null
  try {
    return new URL(raw).hostname.endsWith(".r2.cloudflarestorage.com") ? null : raw
  } catch {
    return null
  }
}
