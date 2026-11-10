import type { Metadata } from "next"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EmptyState, FileLink, ListToolbar, PageHeader, Pagination, StatusBadge } from "@/components/admin/shared"
import { ConfirmDelete, PatchSwitch } from "@/components/admin/actions/controls"
import { listMessages } from "@/services/admin.service"
import { formatBytes, formatDateTime, one, parsePage } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Messages" }
const BASE = "/admin/feedback/messages"

export default async function AdminMessagesPage({ searchParams }: PageProps<"/admin/feedback/messages">) {
  const sp = await searchParams
  const status = one(sp.status)
  const q = one(sp.q)
  const data = await listMessages({ page: parsePage(sp.page), status, q })

  return (
    <>
      <PageHeader title="Messages" description="Sent from the contact page: general questions, inquiries and complaints." />
      <ListToolbar
        base={BASE}
        filters={[{ value: "open", label: "Not handled" }, { value: "GENERAL" }, { value: "INQUIRY" }, { value: "COMPLAINT" }]}
        current={status}
        q={q}
        searchPlaceholder="Name, email, message, reference"
      />
      {data.items.length ? (
        <div className="grid gap-3">
          {data.items.map((m) => (
            <Card key={m.id} size="sm">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={m.topic} />
                  <span className="font-medium">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">
                    {m.email}
                  </a>
                  {m.phone && <span className="text-sm text-muted-foreground">{m.phone}</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {formatDateTime(m.createdAt)}
                  <span className="flex items-center gap-1.5">
                    <PatchSwitch path={`/api/admin/messages/${m.id}`} field="isHandled" checked={m.isHandled} label="Handled" onLabel="Marked as handled." offLabel="Marked as not handled." />
                    {m.isHandled ? "Handled" : "Not handled"}
                  </span>
                  <ConfirmDelete path={`/api/admin/messages/${m.id}`} what="message" description="The message and its attachments are removed for good." iconOnly />
                </div>
              </CardHeader>
              <CardContent className="grid gap-2">
                {(m.service || m.reference) && (
                  <div className="text-sm text-muted-foreground">{[m.service, m.reference && `Ref. ${m.reference}`].filter(Boolean).join(" · ")}</div>
                )}
                <p className="text-sm whitespace-pre-line">{m.message}</p>
                {m.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {m.attachments.map((a) => (
                      <FileLink key={a.id} id={a.id} name={a.name} hint={formatBytes(a.size)} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title={q || status ? "No message matches" : "No messages yet"} />
      )}
      <Pagination base={BASE} page={data.page} pageCount={data.pageCount} total={data.total} params={{ status, q }} />
    </>
  )
}
