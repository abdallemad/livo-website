/**
 * Admin sidebar — one entry per area of the data model (prisma/schema.prisma).
 * Routes follow CLAUDE.md §3: /admin/<area>/<entity>. Icons are lucide names (see AdminSidebar).
 */
export type AdminIcon =
  | "overview"
  | "bookings"
  | "providers"
  | "users"
  | "reviews"
  | "messages"
  | "services"
  | "categories"
  | "slides"
  | "towns"
  | "media"

export interface AdminNavItem {
  title: string
  href: string
  icon: AdminIcon
  /** what it manages, shown as the page description */
  description: string
}

export interface AdminNavGroup {
  label: string
  items: AdminNavItem[]
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Dashboard",
    items: [{ title: "Overview", href: "/admin", icon: "overview", description: "What needs attention today." }],
  },
  {
    label: "Operations",
    items: [
      { title: "Bookings", href: "/admin/operations/bookings", icon: "bookings", description: "Bookings confirmed in the chat or the app." },
      { title: "Provider requests", href: "/admin/operations/provider-requests", icon: "providers", description: "People asking to become LIVO providers." },
    ],
  },
  {
    label: "People",
    items: [{ title: "Users", href: "/admin/people/users", icon: "users", description: "Customer, professional and admin accounts." }],
  },
  {
    label: "Feedback",
    items: [
      { title: "Reviews", href: "/admin/feedback/reviews", icon: "reviews", description: "Ratings left after a booking." },
      { title: "Messages", href: "/admin/feedback/messages", icon: "messages", description: "Contact form: general, inquiries, complaints." },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { title: "Services", href: "/admin/catalog/services", icon: "services", description: "Services customers can book." },
      { title: "Categories", href: "/admin/catalog/categories", icon: "categories", description: "Groups of services and their banners." },
      { title: "Hero slides", href: "/admin/catalog/slides", icon: "slides", description: "The home page slider." },
      { title: "Towns", href: "/admin/catalog/towns", icon: "towns", description: "Towns suggested in the booking address step." },
    ],
  },
  {
    label: "Storage",
    items: [{ title: "Media", href: "/admin/storage/media", icon: "media", description: "Every file stored in Cloudflare R2." }],
  },
]

export const ADMIN_NAV_ITEMS = ADMIN_NAV.flatMap((g) => g.items)

/** the nav item a path belongs to (longest matching href) */
export function adminNavItemFor(pathname: string): AdminNavItem | undefined {
  return [...ADMIN_NAV_ITEMS].sort((a, b) => b.href.length - a.href.length).find((i) => pathname === i.href || (i.href !== "/admin" && pathname.startsWith(`${i.href}/`)))
}
