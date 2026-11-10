import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState, PageHeader } from "@/components/admin/shared"
import { PatchSwitch } from "@/components/admin/actions/controls"
import { listSlidesAdmin } from "@/services/admin.service"

export const metadata: Metadata = { title: "Hero slides" }

export default async function AdminSlidesPage() {
  const slides = await listSlidesAdmin()
  return (
    <>
      <PageHeader title="Hero slides" description="The home page slider, in order. Copy is stored in English, French and German." />
      {slides.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {slides.map((s) => (
            <Card key={s.id} className="overflow-hidden pt-0">
              {s.desktop && <img src={s.desktop} alt="" className="aspect-[16/7] w-full object-cover" />}
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    #{s.sortOrder + 1} · {s.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    Visible
                    <PatchSwitch path={`/api/admin/slides/${s.id}`} field="isActive" checked={s.isActive} label={`Slide ${s.sortOrder + 1} visible`} onLabel="Slide shown." offLabel="Slide hidden." />
                  </span>
                </div>
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3 text-xs text-muted-foreground">
                <span>Desktop {s.desktop ? "✓" : "—"}</span>
                <span>Mobile {s.mobile ? "✓" : "—"}</span>
                <span className="font-mono">{s.key}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No slides">Run npm run db:seed to load the design’s slides.</EmptyState>
      )}
    </>
  )
}
