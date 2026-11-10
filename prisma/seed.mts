/**
 * Seeds the catalogue from the design's data files (src/data/*.ts — copied 1:1 from the
 * prototype), so the API serves exactly what the pages show. Idempotent upserts by slug/key.
 * Links each row to its artwork in `File` when `npm run assets:upload` has run.
 *
 *   npm run db:seed
 *
 * Creates no users (User.id is always a Clerk id — CLAUDE.md §6).
 *
 * The database is the catalogue's source of truth (the admin dashboard edits it), so by default
 * the seed only INSERTS missing rows and never overwrites edits. `npm run db:seed -- --reset`
 * puts every seeded row back to the design's values.
 */
import { PrismaClient, type Prisma } from "@prisma/client"
import { FEATURED_SERVICE_IDS, HERO_SLIDES } from "../src/data/home.ts"
import { SERVICE_CATEGORIES, SERVICES, TOWNS } from "../src/data/services.ts"

/** design data → Prisma JSON column */
const json = (v: unknown) => v as Prisma.InputJsonValue

const RESET = process.argv.includes("--reset")

const db = new PrismaClient({ datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL })

async function fileId(publicPath: string): Promise<string | null> {
  const row = await db.file.findUnique({ where: { key: `static${publicPath}` }, select: { id: true } })
  return row?.id ?? null
}

async function main() {
  let missingArt = 0
  const art = async (p: string) => {
    const id = await fileId(p)
    if (!id) missingArt++
    return id
  }

  const categoryIds = new Map<string, string>()
  for (const [i, c] of SERVICE_CATEGORIES.entries()) {
    const data = { emoji: c.emoji, name: json(c.name), colorFrom: c.colors[0], colorTo: c.colors[1], sortOrder: i, bannerId: await art(`/img/cats/${c.id}.webp`) }
    const row = await db.serviceCategory.upsert({ where: { slug: c.id }, create: { slug: c.id, ...data }, update: RESET ? data : {} })
    categoryIds.set(c.id, row.id)
  }

  for (const [i, s] of SERVICES.entries()) {
    const data = {
      categoryId: categoryIds.get(s.category)!,
      emoji: s.emoji,
      name: json(s.name),
      description: json(s.description),
      subServices: json(s.subServices),
      featured: FEATURED_SERVICE_IDS.includes(s.id),
      // the design's order of the home page cards
      featuredOrder: Math.max(0, FEATURED_SERVICE_IDS.indexOf(s.id)),
      sortOrder: i,
      iconId: await art(`/img/icons/${s.id}.webp`),
      imageId: await art(`/img/services/${s.id}.webp`),
    }
    await db.service.upsert({ where: { slug: s.id }, create: { slug: s.id, ...data }, update: RESET ? data : {} })
  }

  for (const [i, s] of HERO_SLIDES.entries()) {
    const n = s.className.slice(1)
    const { className, ...content } = s
    const data = {
      content: json({ ...content, className }),
      sortOrder: i,
      desktopId: await art(`/img/slides/slide-${n}-desktop.webp`),
      mobileId: await art(`/img/slides/slide-${n}-mobile.webp`),
    }
    await db.heroSlide.upsert({ where: { key: className }, create: { key: className, ...data }, update: RESET ? data : {} })
  }

  for (const [i, name] of TOWNS.entries()) {
    await db.town.upsert({ where: { name }, create: { name, sortOrder: i }, update: RESET ? { sortOrder: i, isActive: true } : {} })
  }

  console.log(`[seed] ${RESET ? "reset" : "inserted missing"}: ${SERVICE_CATEGORIES.length} categories, ${SERVICES.length} services, ${HERO_SLIDES.length} slides, ${TOWNS.length} towns`)
  if (missingArt) console.log(`[seed] ${missingArt} images not linked — run \`npm run assets:upload\` first, then seed again`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
