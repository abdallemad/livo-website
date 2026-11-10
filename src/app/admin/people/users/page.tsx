import type { Metadata } from "next"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState, ListToolbar, PageHeader, Pagination, StatusBadge } from "@/components/admin/shared"
import { PatchSelect, enumOptions } from "@/components/admin/actions/controls"
import { ROLES, listUsers } from "@/services/admin.service"
import { formatDate, one, parsePage } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Users" }
const BASE = "/admin/people/users"

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/people/users">) {
  const sp = await searchParams
  const status = one(sp.status)
  const q = one(sp.q)
  const data = await listUsers({ page: parsePage(sp.page), status, q })

  return (
    <>
      <PageHeader title="Users" description="Accounts created through Clerk sign-up (the id is the Clerk user id). ADMIN_EMAIL becomes admin on sign-in." />
      <ListToolbar base={BASE} filters={ROLES.map((value) => ({ value }))} current={status} q={q} counts={data.byRole} searchPlaceholder="Name, email, phone, city" />
      {data.items.length ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Provider req.</TableHead>
                <TableHead className="text-right">Reviews</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium">{u.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{u.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>{u.email || "—"}</div>
                    <div className="text-xs text-muted-foreground">{u.phone}</div>
                  </TableCell>
                  <TableCell>
                    {u.id === data.meId ? (
                      <span title="You cannot change your own role">
                        <StatusBadge value={u.role} label="Admin (you)" />
                      </span>
                    ) : (
                      <PatchSelect path={`/api/admin/users/${u.id}`} field="role" value={u.role} options={enumOptions(ROLES)} success={`${u.name}: role updated.`} ariaLabel={`Role of ${u.name}`} className="w-32" />
                    )}
                  </TableCell>
                  <TableCell>{u.city || "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {u.bookings ? (
                      <Link href={`/admin/operations/bookings?q=${encodeURIComponent(u.email)}`} className="text-primary hover:underline">
                        {u.bookings}
                      </Link>
                    ) : (
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{u.providerRequests}</TableCell>
                  <TableCell className="text-right tabular-nums">{u.reviews}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title={q || status ? "No user matches" : "No users yet"} />
      )}
      <Pagination base={BASE} page={data.page} pageCount={data.pageCount} total={data.total} params={{ status, q }} />
    </>
  )
}
