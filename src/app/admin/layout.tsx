/**
 * Admin dashboard root layout (its own <html>: the storefront's designer CSS never loads here,
 * and the admin's shadcn/Tailwind CSS never loads on the storefront).
 *
 * Gate, layer 2 of 3 (CLAUDE.md §5): src/proxy.ts already answered 404 to anyone who is not an
 * admin; this check exists because Next renders segments in parallel and must never stream
 * dashboard output for a non-admin. Every service the pages call checks again (layer 3).
 * Dynamic by nature (reads the session) — and noindex.
 */
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ClerkProvider } from "@clerk/nextjs"
import "@/styles/livo/fonts.css"
import "./admin.css"
import { SITE_NAME } from "@/constants/site"
import { requireAdmin } from "@/services/auth.service"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar"
import { AdminHeader } from "@/components/admin/layout/AdminHeader"

export const metadata: Metadata = {
  title: { default: `Admin – ${SITE_NAME}`, template: `%s – ${SITE_NAME} admin` },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin().catch(() => null)
  if (!admin) notFound()
  const name = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim() || admin.email || "Admin"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh font-sans">
        <ClerkProvider afterSignOutUrl="/">
          <QueryProvider>
            <TooltipProvider>
              <SidebarProvider>
                <AdminSidebar admin={{ name, email: admin.email ?? "" }} />
                <SidebarInset className="min-w-0">
                  <AdminHeader />
                  <div className="flex-1 p-4 md:p-6">{children}</div>
                </SidebarInset>
              </SidebarProvider>
              <Toaster theme="light" position="bottom-right" richColors closeButton />
            </TooltipProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
