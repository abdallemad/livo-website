"use client"

/** Towns list with add / rename / show-hide / delete (POST, PATCH, DELETE /api/admin/towns). */
import { useState } from "react"
import { Check, Loader2, Pencil, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDelete, PatchSwitch } from "@/components/admin/actions/controls"
import { useAdminAction } from "@/hooks/use-admin"

interface Town {
  id: string
  name: string
  isActive: boolean
  sortOrder: number
}

function AddTown() {
  const { run, pending } = useAdminAction()
  const [name, setName] = useState("")
  return (
    <form
      className="mb-4 flex max-w-xl gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!name.trim()) return
        try {
          await run({ path: "/api/admin/towns", method: "POST", body: { name }, success: `${name.trim()} added.` })
          setName("")
        } catch {
          /* toasted */
        }
      }}
    >
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a town, e.g. Bettembourg" aria-label="New town" maxLength={80} />
      <Button type="submit" disabled={pending || !name.trim()}>
        {pending ? <Loader2 className="animate-spin" /> : <Plus />}
        Add
      </Button>
    </form>
  )
}

function TownName({ town }: { town: Town }) {
  const { run, pending } = useAdminAction()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(town.name)
  if (!editing)
    return (
      <span className="group inline-flex items-center gap-2 font-medium">
        {town.name}
        <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100" aria-label={`Rename ${town.name}`} onClick={() => setEditing(true)}>
          <Pencil />
        </Button>
      </span>
    )
  const save = async () => {
    if (!name.trim() || name.trim() === town.name) return setEditing(false)
    try {
      await run({ path: `/api/admin/towns/${town.id}`, method: "PATCH", body: { name }, success: "Town renamed." })
      setEditing(false)
    } catch {
      /* toasted */
    }
  }
  return (
    <span className="flex items-center gap-1">
      <Input
        value={name}
        autoFocus
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save()
          if (e.key === "Escape") setEditing(false)
        }}
        className="h-8 max-w-56"
        aria-label="Town name"
      />
      <Button variant="ghost" size="icon-sm" disabled={pending} onClick={save} aria-label="Save">
        {pending ? <Loader2 className="animate-spin" /> : <Check />}
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => setEditing(false)} aria-label="Cancel">
        <X />
      </Button>
    </span>
  )
}

export function TownsManager({ towns }: { towns: Town[] }) {
  return (
    <>
      <AddTown />
      <div className="max-w-xl rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Town</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {towns.map((t, i) => (
              <TableRow key={t.id}>
                <TableCell className="text-muted-foreground tabular-nums">{i + 1}</TableCell>
                <TableCell>
                  <TownName town={t} />
                </TableCell>
                <TableCell>
                  <PatchSwitch path={`/api/admin/towns/${t.id}`} field="isActive" checked={t.isActive} label={`${t.name} visible`} onLabel={`${t.name} is shown.`} offLabel={`${t.name} is hidden.`} />
                </TableCell>
                <TableCell>
                  <ConfirmDelete path={`/api/admin/towns/${t.id}`} what="town" description={`${t.name} will no longer be suggested in the booking chat.`} iconOnly />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
