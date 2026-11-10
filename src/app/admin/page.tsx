import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState, PageHeader, StatCard, StatusBadge } from "@/components/admin/shared"
import { BOOKING_STATUSES, getOverview } from "@/services/admin.service"
import { formatDateTime, humanize } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Overview" }

export default async function AdminOverviewPage() {
  const o = await getOverview()
  const users = (o.usersByRole.CUSTOMER ?? 0) + (o.usersByRole.PRO ?? 0) + (o.usersByRole.ADMIN ?? 0)

  return (
    <>
      <PageHeader title="Overview" description="What needs attention today." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New bookings" value={o.bookingsByStatus.RECEIVED ?? 0} hint={`${o.bookingsThisWeek} this week · ${o.bookings} in total`} href="/admin/operations/bookings?status=RECEIVED" tone={o.bookingsByStatus.RECEIVED ? "attention" : undefined} />
        <StatCard label="Provider requests to review" value={o.openProviderRequests} hint="Received or in review" href="/admin/operations/provider-requests" tone={o.openProviderRequests ? "attention" : undefined} />
        <StatCard label="Open messages" value={o.openMessages} hint="Contact form, not handled yet" href="/admin/feedback/messages?status=open" tone={o.openMessages ? "attention" : undefined} />
        <StatCard label="Reviews to approve" value={o.reviewsToApprove} href="/admin/feedback/reviews?status=pending" />
        <StatCard label="Users" value={users} hint={`${o.usersByRole.CUSTOMER ?? 0} customers · ${o.usersByRole.PRO ?? 0} pros · ${o.usersByRole.ADMIN ?? 0} admins`} href="/admin/people/users" />
        <StatCard label="Active services" value={o.activeServices} href="/admin/catalog/services" />
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookings by status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {BOOKING_STATUSES.map((s) => (
              <Link key={s} href={`/admin/operations/bookings?status=${s}`} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                <StatusBadge value={s} />
                <span className="font-semibold tabular-nums">{o.bookingsByStatus[s] ?? 0}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Latest bookings</CardTitle>
            <Link href="/admin/operations/bookings" className="text-sm text-primary hover:underline">
              See all
            </Link>
          </CardHeader>
          <CardContent>
            {o.recentBookings.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {o.recentBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <Link href={`/admin/operations/bookings/${b.id}`} className="font-medium text-primary hover:underline">
                          {b.ref}
                        </Link>
                        <div className="text-xs text-muted-foreground">{formatDateTime(b.confirmedAt)}</div>
                      </TableCell>
                      <TableCell>{b.service}</TableCell>
                      <TableCell>{b.customer}</TableCell>
                      <TableCell>
                        <StatusBadge value={b.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="No bookings yet">They appear here as soon as a customer confirms one in the chat or the app.</EmptyState>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Latest provider requests</CardTitle>
            <Link href="/admin/operations/provider-requests" className="text-sm text-primary hover:underline">
              See all
            </Link>
          </CardHeader>
          <CardContent>
            {o.recentProviderRequests.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {o.recentProviderRequests.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Link href={`/admin/operations/provider-requests/${p.id}`} className="font-medium text-primary hover:underline">
                          {p.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">{formatDateTime(p.createdAt)}</div>
                      </TableCell>
                      <TableCell>{p.service}</TableCell>
                      <TableCell>{p.city || "—"}</TableCell>
                      <TableCell>
                        <StatusBadge value={p.status} label={humanize(p.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="No provider requests yet">Sent from the “Work with LIVO” page or a professional sign-up.</EmptyState>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
