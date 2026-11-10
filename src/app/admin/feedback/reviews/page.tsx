import type { Metadata } from "next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState, ListToolbar, PageHeader, Pagination } from "@/components/admin/shared"
import { ConfirmDelete, PatchSwitch } from "@/components/admin/actions/controls"
import { listReviews } from "@/services/admin.service"
import { formatDateTime, one, parsePage } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Reviews" }
const BASE = "/admin/feedback/reviews"

export default async function AdminReviewsPage({ searchParams }: PageProps<"/admin/feedback/reviews">) {
  const sp = await searchParams
  const status = one(sp.status)
  const q = one(sp.q)
  const data = await listReviews({ page: parsePage(sp.page), status, q })

  return (
    <>
      <PageHeader title="Reviews" description="Ratings left after a booking. Only approved reviews whose author agreed to publish can be shown publicly." />
      <ListToolbar
        base={BASE}
        filters={[
          { value: "pending", label: "To approve" },
          { value: "approved", label: "Approved" },
        ]}
        current={status}
        q={q}
        searchPlaceholder="Comment or booking ref"
      />
      {data.items.length ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Publish</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-amber-500" aria-label={`${r.rating} out of 5`}>
                    {"★".repeat(r.rating)}
                    <span className="text-muted-foreground/40">{"★".repeat(5 - r.rating)}</span>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 whitespace-normal">{r.comment || <span className="text-muted-foreground">No comment</span>}</p>
                    {r.tags.length > 0 && <div className="mt-1 text-xs text-muted-foreground">{r.tags.join(" · ")}</div>}
                  </TableCell>
                  <TableCell>
                    <div>{r.service}</div>
                    {r.bookingRef && <div className="text-xs text-muted-foreground">{r.bookingRef}</div>}
                  </TableCell>
                  <TableCell>{r.author}</TableCell>
                  <TableCell>{r.publish ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <PatchSwitch path={`/api/admin/reviews/${r.id}`} field="isApproved" checked={r.isApproved} label="Approved" onLabel="Review approved." offLabel="Review hidden." />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatDateTime(r.createdAt)}</TableCell>
                  <TableCell>
                    <ConfirmDelete path={`/api/admin/reviews/${r.id}`} what="review" description="The review and its photos are removed for good." iconOnly />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title={q || status ? "No review matches" : "No reviews yet"} />
      )}
      <Pagination base={BASE} page={data.page} pageCount={data.pageCount} total={data.total} params={{ status, q }} />
    </>
  )
}
