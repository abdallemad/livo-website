"use client"

/**
 * Small admin controls that write immediately: status/role selects, on/off switches,
 * a confirmed delete, a note editor. Each one calls an /api/admin route via useAdminAction.
 */
import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAdminAction } from "@/hooks/use-admin"
import { humanize } from "@/utils/admin-format"

export interface Option {
  value: string
  label: string
}

/** A select that PATCHes `{ [field]: value }` as soon as a new value is picked. */
export function PatchSelect({
  path,
  field,
  value,
  options,
  success = "Saved.",
  placeholder,
  className = "w-44",
  disabled,
  ariaLabel,
}: {
  path: string
  field: string
  value: string | null
  options: Option[]
  success?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  ariaLabel: string
}) {
  const { run, pending } = useAdminAction()
  return (
    <Select
      items={options}
      value={value}
      disabled={disabled || pending}
      onValueChange={(v) => {
        if (v === value) return
        run({ path, method: "PATCH", body: { [field]: v === "" ? null : v }, success }).catch(() => {})
      }}
    >
      <SelectTrigger className={className} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
        {pending && <Loader2 className="ml-auto animate-spin" />}
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const enumOptions = (values: readonly string[]): Option[] => values.map((v) => ({ value: v, label: humanize(v) }))

/** An on/off switch that PATCHes `{ [field]: checked }`. */
export function PatchSwitch({ path, field, checked, label, onLabel, offLabel }: { path: string; field: string; checked: boolean; label: string; onLabel?: string; offLabel?: string }) {
  const { run, pending } = useAdminAction()
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <Switch
        checked={checked}
        disabled={pending}
        aria-label={label}
        onCheckedChange={(next) => run({ path, method: "PATCH", body: { [field]: next }, success: next ? (onLabel ?? "Saved.") : (offLabel ?? "Saved.") }).catch(() => {})}
      />
      {pending ? <Loader2 className="size-3.5 animate-spin text-muted-foreground" /> : null}
    </label>
  )
}

/** A button that runs one PATCH/POST with a fixed body (e.g. "Approve"). */
export function ActionButton({
  path,
  method = "PATCH",
  body,
  success,
  children,
  variant = "outline",
  size = "sm",
}: {
  path: string
  method?: "PATCH" | "POST"
  body: unknown
  success?: string
  children: ReactNode
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "default"
}) {
  const { run, pending } = useAdminAction()
  return (
    <Button variant={variant} size={size} disabled={pending} onClick={() => run({ path, method, body, success }).catch(() => {})}>
      {pending && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  )
}

/** Delete with a confirmation dialog; optional redirect after success (from a detail page). */
export function ConfirmDelete({ path, what, description, redirectTo, size = "sm", iconOnly }: { path: string; what: string; description: string; redirectTo?: string; size?: "sm" | "icon-sm"; iconOnly?: boolean }) {
  const { run, pending } = useAdminAction()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size={iconOnly ? "icon-sm" : size} className="text-destructive hover:text-destructive" aria-label={`Delete ${what}`} />}>
        <Trash2 />
        {!iconOnly && "Delete"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this {what}?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={async () => {
              try {
                await run({ path, method: "DELETE", success: `The ${what} was deleted.` })
                setOpen(false)
                if (redirectTo) router.push(redirectTo)
              } catch {
                /* toasted */
              }
            }}
          >
            {pending && <Loader2 className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** Internal note (admins only), saved with a button. */
export function NoteEditor({ path, value }: { path: string; value: string | null }) {
  const { run, pending } = useAdminAction()
  const [text, setText] = useState(value ?? "")
  const dirty = text.trim() !== (value ?? "").trim()
  return (
    <div className="grid gap-2">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={2000} placeholder="Only admins see this note." aria-label="Internal note" />
      <div className="flex justify-end">
        <Button size="sm" disabled={!dirty || pending} onClick={() => run({ path, method: "PATCH", body: { adminNote: text }, success: "Note saved." }).catch(() => {})}>
          {pending && <Loader2 className="animate-spin" />}
          Save note
        </Button>
      </div>
    </div>
  )
}
