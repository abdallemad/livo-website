#!/usr/bin/env node
/**
 * Uploads the design's artwork (public/img/**) to Cloudflare R2 under `static/img/…` and records
 * every object in the `File` table (kind STATIC). Idempotent: an object whose MD5 already matches
 * R2's ETag is skipped. Run after changing an image, then `npm run db:seed` links them to rows.
 *
 *   npm run assets:upload            upload + record
 *   npm run assets:upload -- --dry   list what would change
 *
 * Only touches keys under `static/` — the bucket also holds another project's objects.
 */
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { PrismaClient } from "@prisma/client"
import { createHash } from "node:crypto"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

for (const f of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(f)
  } catch {
    /* optional */
  }
}

const DRY = process.argv.includes("--dry")
const ROOT = path.resolve("public/img")
const MIME = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".gif": "image/gif", ".ico": "image/x-icon" }

for (const k of ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"]) {
  if (!process.env[k]) throw new Error(`${k} is not set`)
}
const Bucket = process.env.R2_BUCKET_NAME
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})
const db = new PrismaClient({ datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL })

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else yield p
  }
}

let uploaded = 0
let skipped = 0
for await (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/")
  const mimeType = MIME[path.extname(file).toLowerCase()]
  if (!mimeType) continue
  const body = await readFile(file)
  const key = `static/img/${rel}`
  const md5 = createHash("md5").update(body).digest("hex")
  const sha256 = createHash("sha256").update(body).digest("hex")

  let same = false
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket, Key: key }))
    same = head.ETag?.replaceAll('"', "") === md5
  } catch {
    /* not there yet */
  }
  if (same) skipped++
  else {
    console.log(`${DRY ? "would upload" : "upload"} ${key} (${(body.length / 1024).toFixed(0)} KB)`)
    if (!DRY) await s3.send(new PutObjectCommand({ Bucket, Key: key, Body: body, ContentType: mimeType, CacheControl: "public, max-age=86400, stale-while-revalidate=604800" }))
    uploaded++
  }
  if (!DRY) {
    const data = { kind: "STATIC", mimeType, size: body.length, sha256, name: `/img/${rel}` }
    await db.file.upsert({ where: { key }, create: { key, ...data }, update: data })
  }
}
await db.$disconnect()
console.log(`[assets] ${uploaded} ${DRY ? "to upload" : "uploaded"}, ${skipped} unchanged`)
