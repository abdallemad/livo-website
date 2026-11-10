import "server-only"
import type { Prisma } from "@prisma/client"
import { db } from "@/lib/db"

const fileKey = { select: { key: true } } as const

export const serviceInclude = {
  category: { select: { slug: true } },
  icon: fileKey,
  image: fileKey,
} satisfies Prisma.ServiceInclude

export const categoryInclude = { banner: fileKey } satisfies Prisma.ServiceCategoryInclude
export const slideInclude = { desktop: fileKey, mobile: fileKey } satisfies Prisma.HeroSlideInclude

export type ServiceRow = Prisma.ServiceGetPayload<{ include: typeof serviceInclude }>
export type CategoryRow = Prisma.ServiceCategoryGetPayload<{ include: typeof categoryInclude }>
export type SlideRow = Prisma.HeroSlideGetPayload<{ include: typeof slideInclude }>

class CatalogRepository {
  findCategories(where: Prisma.ServiceCategoryWhereInput): Promise<CategoryRow[]> {
    return db.serviceCategory.findMany({ where, include: categoryInclude, orderBy: { sortOrder: "asc" } })
  }

  findServices(where: Prisma.ServiceWhereInput): Promise<ServiceRow[]> {
    return db.service.findMany({ where, include: serviceInclude, orderBy: { sortOrder: "asc" } })
  }

  findService(where: Prisma.ServiceWhereInput): Promise<ServiceRow | null> {
    return db.service.findFirst({ where, include: serviceInclude })
  }

  findServiceId(slug: string, where: Prisma.ServiceWhereInput) {
    return db.service.findFirst({ where: { ...where, slug }, select: { id: true } })
  }

  findSlides(where: Prisma.HeroSlideWhereInput): Promise<SlideRow[]> {
    return db.heroSlide.findMany({ where, include: slideInclude, orderBy: { sortOrder: "asc" } })
  }

  findTowns(where: Prisma.TownWhereInput) {
    return db.town.findMany({ where, orderBy: { sortOrder: "asc" }, select: { name: true } })
  }
}

export const catalogRepository = new CatalogRepository()
