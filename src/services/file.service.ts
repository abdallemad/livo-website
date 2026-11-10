/**
 * Stores an upload in R2 and records it in `File` (the source of truth for stored objects).
 * Validates by magic bytes and size before anything is written.
 */
import "server-only"
import { createHash, randomUUID } from "node:crypto"
import type { FileKind, Prisma } from "@prisma/client"
import { MAX_FILES_PER_FORM, type SniffedType } from "@/constants/upload"
import { TooLargeError, ValidationError } from "@/lib/errors"
import { deleteObject, publicImageHost, putObject } from "@/lib/r2.provider"
import { fileRepository } from "@/repositories/file.repository"
import { EXTENSION, sniffFileType } from "@/utils/file-type"

interface StoreOptions {
  /** form field name, for field errors */
  field: string
  kind: FileKind
  /** key prefix, e.g. `private/requests/<id>` */
  prefix: string
  allowed: SniffedType[]
  maxBytes: number
  link?: Omit<Prisma.FileUncheckedCreateInput, "key" | "kind" | "mimeType" | "size" | "sha256" | "name">
}

export async function storeUpload(file: File, opts: StoreOptions) {
  if (file.size > opts.maxBytes) throw new TooLargeError(undefined, { [opts.field]: [`Max ${Math.round(opts.maxBytes / 1024 / 1024)} MB per file.`] })
  const bytes = new Uint8Array(await file.arrayBuffer())
  const type = sniffFileType(bytes, file.name)
  if (!type || !opts.allowed.includes(type)) throw new ValidationError("That file type is not accepted.", { [opts.field]: ["That file type is not accepted."] })
  const key = `${opts.prefix}/${randomUUID()}.${EXTENSION[type]}`
  const sha256 = createHash("sha256").update(bytes).digest("hex")
  const isPublic = opts.prefix.startsWith("avatars/")
  await putObject(key, bytes, type, isPublic ? "public, max-age=31536000, immutable" : "private, no-store")
  try {
    return await fileRepository.create({ ...opts.link, key, kind: opts.kind, mimeType: type, size: bytes.byteLength, sha256, name: file.name.slice(0, 200) || null })
  } catch (e) {
    await deleteObject(key).catch(() => {}) // no orphan object without a row
    throw e
  }
}

/** Check size + type before any row is written, so a bad file never leaves a half-saved form. */
export async function assertUploads(items: { field: string; file: File }[], allowed: SniffedType[], maxBytes: number) {
  for (const { field, file } of items) {
    if (file.size > maxBytes) throw new TooLargeError(undefined, { [field]: [`Max ${Math.round(maxBytes / 1024 / 1024)} MB per file.`] })
    const head = new Uint8Array(await file.slice(0, 16).arrayBuffer())
    const type = sniffFileType(head, file.name)
    if (!type || !allowed.includes(type)) throw new ValidationError("That file type is not accepted.", { [field]: ["That file type is not accepted."] })
  }
}

/** Every file of a multipart form, in field order, capped at MAX_FILES_PER_FORM. */
export function collectFiles(files: Map<string, File[]>, accept: readonly string[]): { field: string; file: File }[] {
  const out: { field: string; file: File }[] = []
  for (const [field, list] of files) {
    if (!accept.includes(field)) continue
    for (const file of list) out.push({ field, file })
  }
  if (out.length > MAX_FILES_PER_FORM) throw new ValidationError(`At most ${MAX_FILES_PER_FORM} files.`)
  return out
}

export async function removeStoredFile(id: string, key: string) {
  await fileRepository.delete(id).catch(() => {})
  await deleteObject(key).catch(() => {})
}

/**
 * URL of a public object (static artwork, avatars): the public R2 host when there is one,
 * else the app's streaming route. Relative unless `absolute` (the mobile app needs absolute URLs).
 */
export function imageUrl(key: string | null | undefined, absolute?: (path: string) => string): string | null {
  if (!key) return null
  const host = publicImageHost()
  if (host) return `${host}/${key}`
  const path = `/api/images/${key}`
  return absolute ? absolute(path) : path
}
