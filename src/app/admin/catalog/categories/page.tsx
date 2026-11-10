import type { Metadata } from "next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState, PageHeader } from "@/components/admin/shared"
import { PatchSwitch } from "@/components/admin/actions/controls"
import { listCategoriesAdmin } from "@/services/admin.service"

export const metadata: Metadata = { title: "Categories" }

export default async function AdminCategoriesPage() {
  const categories = await listCategoriesAdmin()
  return (
    <>
      <PageHeader title="Categories" description="Groups of services on the services page, with their banner and gradient." />
      {categories.length ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead>Gradient</TableHead>
                <TableHead className="text-right">Services</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-muted-foreground tabular-nums">{c.sortOrder + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {c.emoji} {c.name}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">{c.slug}</div>
                  </TableCell>
                  <TableCell>{c.banner ? <img src={c.banner} alt="" className="h-10 w-24 rounded-md object-cover" /> : "—"}</TableCell>
                  <TableCell>
                    <span className="block h-6 w-24 rounded-md" style={{ background: `linear-gradient(110deg, ${c.colors[0]}, ${c.colors[1]})` }} title={c.colors.join(" → ")} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{c.services}</TableCell>
                  <TableCell>
                    <PatchSwitch path={`/api/admin/categories/${c.id}`} field="isActive" checked={c.isActive} label={`${c.name} visible`} onLabel={`${c.name} is visible.`} offLabel={`${c.name} is hidden.`} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" render={<Link href={`/admin/catalog/categories/${c.id}/edit`} />}>
                      <Pencil /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="No categories">Run npm run db:seed to load the design’s catalogue.</EmptyState>
      )}
    </>
  )
}
