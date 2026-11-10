import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailList, EmptyState, FileLink, PageHeader } from "@/components/admin/shared"
import { NoteEditor, PatchSelect, enumOptions } from "@/components/admin/actions/controls"
import { isAppError } from "@/lib/errors"
import { BOOKING_STATUSES, getBooking } from "@/services/admin.service"
import { listProfessionals } from "@/services/admin-actions.service"
import { formatBytes, formatDateTime, humanize } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Booking" }

export default async function AdminBookingPage({ params }: PageProps<"/admin/operations/bookings/[id]">) {
  const { id } = await params
  const [b, pros] = await Promise.all([
    getBooking(id).catch((e) => {
      if (isAppError(e) && e.code === "NOT_FOUND") notFound()
      throw e
    }),
    listProfessionals(),
  ])
  const path = `/api/admin/bookings/${b.id}`
  const proOptions = [{ value: "", label: "Not assigned" }, ...pros.map((p) => ({ value: p.id, label: p.name }))]

  return (
    <>
      <PageHeader title={`Booking ${b.ref}`} description={`Confirmed ${formatDateTime(b.confirmedAt)}`} actions={<PatchSelect path={path} field="status" value={b.status} options={enumOptions(BOOKING_STATUSES)} success="Status updated." ariaLabel="Booking status" />} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Job</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList
              rows={[
                ["Service", b.serviceName],
                ["When", b.asap ? "As soon as possible" : [b.date, b.time].filter(Boolean).join(" · ")],
                ["Address", b.address],
                ["Language", b.locale.toUpperCase()],
                ["Status", humanize(b.status)],
                ["Last update", formatDateTime(b.updatedAt)],
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList
              rows={[
                ["Name", b.name],
                ["Phone", b.phone],
                ["Email", b.email],
                ["Contact by", b.contactMethod ? humanize(b.contactMethod) : ""],
                [
                  "Account",
                  b.user ? (
                    <Link href={`/admin/people/users?q=${encodeURIComponent(b.user.email ?? b.user.id)}`} className="text-primary hover:underline">
                      {b.accountName || b.user.email}
                    </Link>
                  ) : (
                    "Guest"
                  ),
                ],
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provider</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <PatchSelect path={path} field="providerId" value={b.providerId ?? ""} options={proOptions} success="Provider updated." ariaLabel="Assigned provider" className="w-full" />
            {b.provider ? (
              <p className="text-sm text-muted-foreground">{[b.provider.phone, b.provider.email].filter(Boolean).join(" · ")}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{pros.length ? "Assign a professional before marking the booking matched or scheduled." : "No professional accounts yet — approve a provider request first."}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Internal note</CardTitle>
          </CardHeader>
          <CardContent>
            <NoteEditor path={path} value={b.adminNote} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {b.photos.length ? (
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {b.photos.map((f) => (
                  <li key={f.id} className="rounded-lg border p-3">
                    <FileLink id={f.id} name={f.name || "photo"} hint={formatBytes(f.size)} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No photos">The customer skipped the photo step.</EmptyState>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
