/** Pure lookups over the service catalogue (no DB, no env). */
import { SERVICE_CATEGORIES, SERVICES, type Service, type ServiceCategory } from "@/data/services"

export function getService(id: string | null | undefined): Service | undefined {
  return id ? SERVICES.find((s) => s.id === id) : undefined
}

export function categoryOf(service: Service): ServiceCategory {
  return SERVICE_CATEGORIES.find((c) => c.id === service.category)!
}

export function servicesInCategory(categoryId: string): Service[] {
  return SERVICES.filter((s) => s.category === categoryId)
}

/** Every name, description and sub-service in all languages, lower-cased (search haystack). */
export function serviceSearchText(s: Service, withSubs = true): string {
  const parts = [...Object.values(s.name), ...Object.values(s.description)]
  if (withSubs) parts.push(...Object.values(s.subServices).flat())
  return parts.join(" ").toLowerCase()
}

export function searchServices(query: string): Service[] {
  const q = query.trim().toLowerCase()
  if (!q) return SERVICES
  return SERVICES.filter((s) => serviceSearchText(s).includes(q))
}

export const serviceIconSrc = (id: string) => `/img/icons/${id}.webp`
export const serviceImageSrc = (id: string) => `/img/services/${id}.webp`
export const categoryImageSrc = (id: string) => `/img/cats/${id}.webp`
