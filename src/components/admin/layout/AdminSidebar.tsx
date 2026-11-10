"use client"

/** Admin sidebar: groups from constants/admin-nav.ts, active item from the pathname. */
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import {
  CalendarCheck,
  FolderTree,
  HardDrive,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Star,
  Store,
  UserRoundPlus,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ADMIN_NAV, adminNavItemFor, type AdminIcon } from "@/constants/admin-nav"
import { SITE_NAME } from "@/constants/site"

const ICONS: Record<AdminIcon, LucideIcon> = {
  overview: LayoutDashboard,
  bookings: CalendarCheck,
  providers: UserRoundPlus,
  users: Users,
  reviews: Star,
  messages: MessageSquare,
  services: Wrench,
  categories: FolderTree,
  slides: ImageIcon,
  towns: MapPin,
  media: HardDrive,
}

export function AdminSidebar({ admin }: { admin: { name: string; email: string } }) {
  const pathname = usePathname()
  const active = adminNavItemFor(pathname)?.href
  const { signOut } = useClerk()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin" />} tooltip={SITE_NAME}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white p-1">
                <img src="/img/logo-mark.webp" alt="" className="size-6 object-contain" />
              </span>
              <span className="grid text-left leading-tight">
                <span className="font-heading font-semibold">{SITE_NAME}</span>
                <span className="text-xs text-sidebar-foreground/70">Admin</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = ICONS[item.icon]
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton render={<Link href={item.href} />} isActive={active === item.href} tooltip={item.title}>
                        <Icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />} tooltip="Open the website">
              <Store />
              <span>Open the website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut({ redirectUrl: "/" })} tooltip="Log out">
              <LogOut />
              <span className="grid min-w-0 text-left leading-tight">
                <span className="truncate">{admin.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Log out</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
