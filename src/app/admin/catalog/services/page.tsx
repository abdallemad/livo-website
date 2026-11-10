import type { Metadata } from "next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState, PageHeader } from "@/components/admin/shared"
import { PatchSwitch } from "@/components/admin/actions/controls"
import { listServicesAdmin } from "@/services/admin.service"

export const metadata: Metadata = { title: "Services" }

export default async function AdminServicesPage() {
  const services = await listServicesAdmin()
  return (
    <>
      <PageHeader title="Services" description="What customers can book (API and app). The website pages still render the design’s data file — see docs/admin.md." />
      {services.length ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Home page</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Provider req.</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-muted-foreground tabular-nums">{s.sortOrder + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {s.icon ? <img src={s.icon} alt="" className="size-9 rounded-lg bg-muted object-contain p-1" /> : <span className="text-xl">{s.emoji}</span>}
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">{s.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{s.category}</TableCell>
                  <TableCell>
                    <PatchSwitch path={`/api/admin/services/${s.id}`} field="featured" checked={s.featured} label={`${s.name} featured`} onLabel={`${s.name} is featured.`} offLabel={`${s.name} is no longer featured.`} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{s.bookings}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.providerRequests}</TableCell>
                  <TableCell>
                    <PatchSwitch path={`/api/admin/services/${s.id}`} field="isActive" checked={s.isActive} label={`${s.name} visible`} onLabel={`${s.name} is visible.`} offLabel={`${s.name} is hidden.`} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" render={<Link href={`/admin/catalog/services/${s.id}/edit`} />}>
                      <Pencil /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="No services">Run npm run db:seed to load the design’s catalogue.</EmptyState>
      )}
    </>
  )
}
