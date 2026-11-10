import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailList, EmptyState, FileLink, PageHeader, StatusBadge } from "@/components/admin/shared"
import { ActionButton, NoteEditor } from "@/components/admin/actions/controls"
import { WORLD_LANGUAGES } from "@/data/languages"
import { isAppError } from "@/lib/errors"
import { getProviderRequest } from "@/services/admin.service"
import { formatBytes, formatDateTime, humanize } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Provider request" }

const DOCUMENT_LABEL: Record<string, string> = {
  id_front: "ID — front",
  id_back: "ID — back",
  passport_page: "Passport page",
  authorization_front: "Work authorisation — front",
  authorization_back: "Work authorisation — back",
  licence_front: "Driving licence — front",
  licence_back: "Driving licence — back",
  cv: "CV",
}
const yesNo = (v: boolean | null) => (v === null ? "" : v ? "Yes" : "No")

export default async function AdminProviderRequestPage({ params }: PageProps<"/admin/operations/provider-requests/[id]">) {
  const { id } = await params
  const p = await getProviderRequest(id).catch((e) => {
    if (isAppError(e) && e.code === "NOT_FOUND") notFound()
    throw e
  })
  const path = `/api/admin/provider-requests/${p.id}`
  const address = [[p.addressBuilding, p.addressStreet].filter(Boolean).join(" "), [p.addressPostcode, p.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")

  return (
    <>
      <PageHeader title={`${p.firstName} ${p.lastName}`} description={`Provider request sent ${formatDateTime(p.createdAt)}`} actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={p.status} />
            {p.status === "RECEIVED" && (
              <ActionButton path={path} body={{ status: "IN_REVIEW" }} success="Marked as in review.">
                Start review
              </ActionButton>
            )}
            {p.status !== "APPROVED" && (
              <ActionButton path={path} body={{ status: "APPROVED" }} variant="default" success={p.user ? "Approved — the account is now a professional one." : "Approved."}>
                Approve
              </ActionButton>
            )}
            {p.status !== "REJECTED" && (
              <ActionButton path={path} body={{ status: "REJECTED" }} variant="destructive" success="Rejected.">
                Reject
              </ActionButton>
            )}
          </div>
        } />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList
              rows={[
                ["Service", p.serviceName],
                ["Experience", p.experience ? `${p.experience} years` : ""],
                ["Languages", p.languages.map((c) => WORLD_LANGUAGES[c] ?? c.toUpperCase()).join(", ")],
                ["About", p.about ? <p className="whitespace-pre-line">{p.about}</p> : ""],
                ["Has a car", yesNo(p.hasCar)],
                ["ID document", p.idType ? humanize(p.idType) : ""],
                ["Driving licence", p.licenceType ?? ""],
                ["Work authorisation", yesNo(p.authorized)],
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailList
              rows={[
                ["Phone", p.phone],
                ["Email", p.email ?? ""],
                ["Address", address],
                ["Language", p.locale.toUpperCase()],
                ["Reviewed", p.reviewedAt ? formatDateTime(p.reviewedAt) : ""],
                [
                  "Account",
                  p.user ? (
                    <Link href={`/admin/people/users?q=${encodeURIComponent(p.user.email ?? p.user.id)}`} className="text-primary hover:underline">
                      {p.accountName || p.user.email} · {humanize(p.user.role)}
                    </Link>
                  ) : (
                    "Guest (no account)"
                  ),
                ],
              ]}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Internal note</CardTitle>
          </CardHeader>
          <CardContent>
            <NoteEditor path={path} value={p.adminNote} />
            {!p.user && <p className="mt-2 text-xs text-muted-foreground">Sent as a guest: approving does not create an account — the person signs up as a professional on the website.</p>}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {p.documents.length ? (
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {p.documents.map((f) => (
                  <li key={f.id} className="rounded-lg border p-3">
                    <div className="mb-1 text-xs text-muted-foreground">{DOCUMENT_LABEL[f.documentType ?? ""] ?? f.documentType ?? "Document"}</div>
                    <FileLink id={f.id} name={f.name || "file"} hint={formatBytes(f.size)} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No documents" />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
