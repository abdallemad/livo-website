import type { Metadata } from "next"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState, ListToolbar, PageHeader, Pagination } from "@/components/admin/shared"
import { PatchSelect, enumOptions } from "@/components/admin/actions/controls"
import { PROVIDER_REQUEST_STATUSES, listProviderRequests } from "@/services/admin.service"
import { formatDateTime, one, parsePage } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Provider requests" }
const BASE = "/admin/operations/provider-requests"

export default async function AdminProviderRequestsPage({ searchParams }: PageProps<"/admin/operations/provider-requests">) {
  const sp = await searchParams
  const status = one(sp.status)
  const q = one(sp.q)
  const data = await listProviderRequests({ page: parsePage(sp.page), status, q })

  return (
    <>
      <PageHeader title="Provider requests" description="People asking to become LIVO providers — from the join page or a professional sign-up." />
      <ListToolbar base={BASE} filters={PROVIDER_REQUEST_STATUSES.map((value) => ({ value }))} current={status} q={q} counts={data.byStatus} searchPlaceholder="Name, email, phone, city" />
      {data.items.length ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Docs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link href={`${BASE}/${p.id}`} className="font-medium text-primary hover:underline">
                      {p.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{p.contact}</div>
                  </TableCell>
                  <TableCell>{p.service}</TableCell>
                  <TableCell>{p.city || "—"}</TableCell>
                  <TableCell className="uppercase">{p.languages.join(", ") || "—"}</TableCell>
                  <TableCell>{p.experience ? `${p.experience} yrs` : "—"}</TableCell>
                  <TableCell className="tabular-nums">{p.documents}</TableCell>
                  <TableCell>
                    <PatchSelect path={`/api/admin/provider-requests/${p.id}`} field="status" value={p.status} options={enumOptions(PROVIDER_REQUEST_STATUSES)} success={`${p.name}: status updated.`} ariaLabel={`Status of ${p.name}`} className="w-36" />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatDateTime(p.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title={q || status ? "No request matches" : "No provider requests yet"} />
      )}
      <Pagination base={BASE} page={data.page} pageCount={data.pageCount} total={data.total} params={{ status, q }} />
    </>
  )
}
