/**
 * Upload limits. Keep `MAX_REQUEST_BODY` in sync with `experimental.proxyClientMaxBodySize`
 * in next.config.mjs (a smaller proxy limit truncates multipart bodies).
 */
export const MB = 1024 * 1024

export const MAX_IMAGE_BYTES = 8 * MB
export const MAX_DOCUMENT_BYTES = 10 * MB
export const MAX_AVATAR_BYTES = 2 * MB
/** files per form (review photos, contact attachment, application documents) */
export const MAX_FILES_PER_FORM = 12
export const MAX_REQUEST_BODY = "40mb"

/** detected from the first bytes — never trust the browser's mime type or the extension */
export type SniffedType = "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "image/heic" | "application/pdf" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export const IMAGE_TYPES: SniffedType[] = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"]
export const DOCUMENT_TYPES: SniffedType[] = [...IMAGE_TYPES, "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
