import type { Metadata } from "next"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState, ListToolbar, PageHeader, Pagination } from "@/components/admin/shared"
import { PatchSelect, enumOptions } from "@/components/admin/actions/controls"
import { BOOKING_STATUSES, listBookings } from "@/services/admin.service"
import { formatDateTime, one, parsePage } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Bookings" }
const BASE = "/admin/operations/bookings"

export default async function AdminBookingsPage({ searchParams }: PageProps<"/admin/operations/bookings">) {
  const sp = await searchParams
  const status = one(sp.status)
  const q = one(sp.q)
  const data = await listBookings({ page: parsePage(sp.page), status, q })

  return (
    <>
      <PageHeader title="Bookings" description="Created when a customer confirms the summary in the booking chat (or the app)." />
      <ListToolbar base={BASE} filters={BOOKING_STATUSES.map((value) => ({ value }))} current={status} q={q} counts={data.byStatus} searchPlaceholder="Ref, name, email, phone, address" />
      {data.items.length ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Confirmed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <Link href={`${BASE}/${b.id}`} className="font-medium text-primary hover:underline">
                      {b.ref}
                    </Link>
                  </TableCell>
                  <TableCell>{b.service}</TableCell>
                  <TableCell>
                    <div>{b.customer}</div>
                    <div className="text-xs text-muted-foreground">{[b.phone, b.email].filter(Boolean).join(" · ")}</div>
                  </TableCell>
                  <TableCell>{b.when}</TableCell>
                  <TableCell>{b.provider || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    <PatchSelect path={`/api/admin/bookings/${b.id}`} field="status" value={b.status} options={enumOptions(BOOKING_STATUSES)} success={`${b.ref} updated.`} ariaLabel={`Status of ${b.ref}`} className="w-36" />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatDateTime(b.confirmedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title={q || status ? "No booking matches" : "No bookings yet"} />
      )}
      <Pagination base={BASE} page={data.page} pageCount={data.pageCount} total={data.total} params={{ status, q }} />
    </>
  )
}
