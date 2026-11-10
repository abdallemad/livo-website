"use client"

/** Top bar: sidebar toggle + breadcrumb (pathname-dependent, so a Client Component — CLAUDE.md §3). */
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ADMIN_NAV, adminNavItemFor } from "@/constants/admin-nav"

export function AdminHeader() {
  const pathname = usePathname()
  const item = adminNavItemFor(pathname)
  const group = ADMIN_NAV.find((g) => g.items.some((i) => i.href === item?.href))
  const isDetail = !!item && pathname !== item.href

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4!" />
      <Breadcrumb>
        <BreadcrumbList>
          {group && item?.href !== "/admin" && (
            <>
              <BreadcrumbItem className="hidden md:block">{group.label}</BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          )}
          <BreadcrumbItem>
            {isDetail ? <BreadcrumbLink render={<Link href={item.href} />}>{item.title}</BreadcrumbLink> : <BreadcrumbPage>{item?.title ?? "Admin"}</BreadcrumbPage>}
          </BreadcrumbItem>
          {isDetail && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pathname.endsWith("/edit") ? "Edit" : "Details"}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
