import type { Metadata } from "next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState, FileLink, ListToolbar, PageHeader, Pagination, StatCard } from "@/components/admin/shared"
import { FILE_KINDS, listFiles } from "@/services/admin.service"
import { formatBytes, formatDateTime, humanize, one, parsePage } from "@/utils/admin-format"

export const metadata: Metadata = { title: "Media" }
const BASE = "/admin/storage/media"
/** objects anyone can load (served by /api/images); the rest are private */
const isPublic = (key: string) => key.startsWith("static/") || key.startsWith("avatars/")

export default async function AdminMediaPage({ searchParams }: PageProps<"/admin/storage/media">) {
  const sp = await searchParams
  const status = one(sp.status)
  const q = one(sp.q)
  const data = await listFiles({ page: parsePage(sp.page), status, q })
  const counts = Object.fromEntries(data.byKind.map((k) => [k.kind, k.count]))

  return (
    <>
      <PageHeader title="Media" description="Every object stored in Cloudflare R2, as recorded in the File table." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.byKind.map((k) => (
          <StatCard key={k.kind} label={humanize(k.kind)} value={k.count} hint={formatBytes(k.bytes)} href={`${BASE}?status=${k.kind}`} />
        ))}
      </div>
      <ListToolbar base={BASE} filters={FILE_KINDS.map((value) => ({ value }))} current={status} q={q} counts={counts} searchPlaceholder="Key or file name" />
      {data.items.length ? (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Stored</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="max-w-md">
                    {isPublic(f.key) ? (
                      <a href={`/api/images/${f.key}`} target="_blank" rel="noopener" className="font-medium text-primary hover:underline">
                        {f.name || f.key.split("/").pop()}
                      </a>
                    ) : (
                      <FileLink id={f.id} name={f.name || f.key.split("/").pop()!} />
                    )}
                    <div className="truncate font-mono text-xs text-muted-foreground">{f.key}</div>
                  </TableCell>
                  <TableCell>{humanize(f.kind)}</TableCell>
                  <TableCell className="text-muted-foreground">{f.mimeType}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBytes(f.size)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatDateTime(f.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState title="No files match" />
      )}
      <Pagination base={BASE} page={data.page} pageCount={data.pageCount} total={data.total} params={{ status, q }} />
    </>
  )
}
