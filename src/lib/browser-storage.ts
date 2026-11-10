/**
 * Small browser-only helpers (Client Components only).
 * `prefs` is localStorage that never throws (private mode, blocked storage) — used for UI
 * preferences: cookie choice, promo dismissed, lite mode, and the `livo-authed` paint hint.
 */
export const prefs = {
  get(k: string): string | null {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v)
    } catch {
      /* private mode / quota */
    }
  },
  del(k: string) {
    try {
      localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  },
}

/** Set before paint by the boot script so cached HTML never shows "Log in" to a signed-in visitor. */
export const AUTHED_HINT = "livo-authed"

/** Centre-crop an image to a 320×320 JPEG before upload (the avatar is shown at ≤ 96px). */
export function cropPhoto(file: File, size = 320): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.onload = () => {
      const c = document.createElement("canvas")
      const s = Math.min(im.width, im.height)
      c.width = c.height = size
      c.getContext("2d")!.drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, size, size)
      URL.revokeObjectURL(url)
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("crop failed"))), "image/jpeg", 0.88)
    }
    im.onerror = reject
    im.src = url
  })
}
