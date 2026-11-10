/**
 * The single switch that marks cached public pages stale after a write (CLAUDE.md §4.2).
 * Coarse on purpose: catalogue edits are rare and regeneration is lazy.
 *
 * Today the storefront renders its catalogue from src/data at build time, so this matters once
 * the pages read the database (docs/admin.md); it is already called after every catalogue write.
 */
import "server-only"
import { revalidatePath } from "next/cache"

export function revalidateStorefront(): void {
  revalidatePath("/", "layout")
  revalidatePath("/sitemap.xml")
}
