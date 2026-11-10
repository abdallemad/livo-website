/**
 * Public catalogue: categories, services, hero slides, towns.
 * Visibility is enforced here (CLAUDE.md §6) — every public read applies `VISIBLE`, so a
 * deactivated row disappears everywhere. DTOs keep the exact shape of `src/data/*.ts`, which the
 * UI already consumes, plus image URLs for the mobile app.
 */
import "server-only"
import type { Localized } from "@/i18n/config"
import { NotFoundError } from "@/lib/errors"
import { catalogRepository, type CategoryRow, type ServiceRow, type SlideRow } from "@/repositories/catalog.repository"
import { imageUrl } from "./file.service"

const VISIBLE = { isActive: true } as const
const VISIBLE_SERVICE = { isActive: true, category: { isActive: true } } as const

type Abs = (path: string) => string

export interface CategoryDto {
  id: string
  emoji: string
  name: Localized
  colors: [string, string]
  banner: string | null
}

export interface ServiceDto {
  id: string
  category: string
  emoji: string
  name: Localized
  description: Localized
  subServices: Localized<string[]>
  featured: boolean
  icon: string | null
  image: string | null
}

export const toCategory = (c: CategoryRow, abs?: Abs): CategoryDto => ({
  id: c.slug,
  emoji: c.emoji,
  name: c.name as unknown as Localized,
  colors: [c.colorFrom, c.colorTo],
  banner: imageUrl(c.banner?.key, abs),
})

export const toService = (s: ServiceRow, abs?: Abs): ServiceDto => ({
  id: s.slug,
  category: s.category.slug,
  emoji: s.emoji,
  name: s.name as unknown as Localized,
  description: s.description as unknown as Localized,
  subServices: s.subServices as unknown as Localized<string[]>,
  featured: s.featured,
  icon: imageUrl(s.icon?.key, abs),
  image: imageUrl(s.image?.key, abs),
})

export async function listCategories(abs?: Abs): Promise<CategoryDto[]> {
  return (await catalogRepository.findCategories(VISIBLE)).map((c) => toCategory(c, abs))
}

export async function listServices(opts: { category?: string; featured?: boolean } = {}, abs?: Abs): Promise<ServiceDto[]> {
  const rows = await catalogRepository.findServices({
    ...VISIBLE_SERVICE,
    ...(opts.category ? { category: { slug: opts.category, isActive: true } } : {}),
    ...(opts.featured ? { featured: true } : {}),
  })
  return rows.map((s) => toService(s, abs))
}

export async function getServiceBySlug(slug: string, abs?: Abs): Promise<ServiceDto> {
  const row = await catalogRepository.findService({ ...VISIBLE_SERVICE, slug })
  if (!row) throw new NotFoundError("That service does not exist.")
  return toService(row, abs)
}

/** id of a visible service, or null — forms store the link only when the slug is real */
export async function resolveServiceId(slug: string | undefined): Promise<string | null> {
  if (!slug) return null
  return (await catalogRepository.findServiceId(slug, VISIBLE_SERVICE))?.id ?? null
}

export async function listSlides(abs?: Abs) {
  return (await catalogRepository.findSlides(VISIBLE)).map((s: SlideRow) => ({
    ...(s.content as object),
    key: s.key,
    desktop: imageUrl(s.desktop?.key, abs),
    mobile: imageUrl(s.mobile?.key, abs),
  }))
}

export async function listTowns(): Promise<string[]> {
  return (await catalogRepository.findTowns(VISIBLE)).map((t) => t.name)
}
