/** Pure magic-byte sniffing (CLAUDE.md §7: validate by content, not by mime/extension). */
import type { SniffedType } from "@/constants/upload"

const starts = (b: Uint8Array, sig: number[], offset = 0) => sig.every((v, i) => b[offset + i] === v)
const ascii = (b: Uint8Array, from: number, to: number) => String.fromCharCode(...b.subarray(from, to))

export function sniffFileType(bytes: Uint8Array, fileName = ""): SniffedType | null {
  if (starts(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg"
  if (starts(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png"
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") return "image/webp"
  if (ascii(bytes, 0, 6) === "GIF87a" || ascii(bytes, 0, 6) === "GIF89a") return "image/gif"
  if (ascii(bytes, 4, 8) === "ftyp" && /^(heic|heix|hevc|heim|heis|mif1|msf1)$/.test(ascii(bytes, 8, 12))) return "image/heic"
  if (ascii(bytes, 0, 5) === "%PDF-") return "application/pdf"
  if (starts(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) return "application/msword"
  // .docx is a zip; accept it only with the right extension (a zip could be anything)
  if (starts(bytes, [0x50, 0x4b, 0x03, 0x04]) && /\.docx$/i.test(fileName)) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  return null
}

export const EXTENSION: Record<SniffedType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}
