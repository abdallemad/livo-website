"use client"

/**
 * Edit forms for the catalogue (react-hook-form + Zod, CLAUDE.md §9). The form works on plain
 * strings (sub-services one per line); on submit they are shaped for PATCH /api/admin/…, which
 * validates again with schemas/admin.schema.ts. Server field errors ("name.en") are replayed into
 * the form.
 */
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { Controller, useForm, useWatch, type FieldValues, type Path, type UseFormSetError } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAdminAction } from "@/hooks/use-admin"
import { ApiError } from "@/lib/api-client"

const LANGS = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
] as const

function Field({ label, error, children, hint }: { label: string; error?: string; children: ReactNode; hint?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function replayErrors<T extends FieldValues>(e: unknown, setError: UseFormSetError<T>) {
  if (!(e instanceof ApiError) || !e.fieldErrors) return
  for (const [key, messages] of Object.entries(e.fieldErrors)) {
    // subServices.en.3 → subServices.en (the textarea)
    setError(key.replace(/\.\d+$/, "") as Path<T>, { message: messages[0] })
  }
}

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

/* ---------------- service ---------------- */

const serviceForm = z.object({
  emoji: z.string().trim().min(1, "Pick an emoji.").max(16),
  name: z.object({ en: z.string().trim().min(1, "Required in English.").max(80), fr: z.string().trim().max(80), de: z.string().trim().max(80) }),
  description: z.object({ en: z.string().trim().min(1, "Required in English.").max(300), fr: z.string().trim().max(300), de: z.string().trim().max(300) }),
  subServices: z.object({ en: z.string(), fr: z.string(), de: z.string() }),
  categoryId: z.string().min(1, "Choose a category."),
  featured: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
})
export type ServiceFormValues = z.infer<typeof serviceForm>

export function ServiceEditForm({ id, initial, categories }: { id: string; initial: ServiceFormValues; categories: { value: string; label: string }[] }) {
  const router = useRouter()
  const { run } = useAdminAction()
  const form = useForm<ServiceFormValues>({ resolver: zodResolver(serviceForm), defaultValues: initial })
  const { register, control, handleSubmit, setError, formState } = form
  const err = formState.errors

  const onSubmit = handleSubmit(async (v) => {
    try {
      await run({
        path: `/api/admin/services/${id}`,
        method: "PATCH",
        success: "Service saved.",
        body: { ...v, subServices: { en: lines(v.subServices.en), fr: lines(v.subServices.fr), de: lines(v.subServices.de) } },
      })
      router.push("/admin/catalog/services")
    } catch (e) {
      replayErrors(e, setError)
    }
  })

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Emoji" error={err.emoji?.message}>
            <Input {...register("emoji")} className="w-24 text-lg" />
          </Field>
          <Field label="Category" error={err.categoryId?.message}>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select items={categories} value={field.value} onValueChange={(v) => field.onChange(v)}>
                  <SelectTrigger className="w-full" aria-label="Category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Position" error={err.sortOrder?.message} hint="0 = first">
            <Input type="number" min={0} {...register("sortOrder", { valueAsNumber: true })} className="w-28" />
          </Field>
          <div className="grid content-start gap-3 pt-6">
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={field.value} onCheckedChange={field.onChange} /> Visible
                </label>
              )}
            />
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={field.value} onCheckedChange={field.onChange} /> Featured on the home page
                </label>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        {LANGS.map(([lang, title]) => (
          <Card key={lang}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {lang !== "en" && <CardDescription>Leave empty to show the English text.</CardDescription>}
            </CardHeader>
            <CardContent className="grid gap-4">
              <Field label="Name" error={err.name?.[lang]?.message}>
                <Input {...register(`name.${lang}`)} />
              </Field>
              <Field label="Description" error={err.description?.[lang]?.message}>
                <Textarea rows={3} {...register(`description.${lang}`)} />
              </Field>
              <Field label="Sub-services" hint="One per line." error={err.subServices?.[lang]?.message}>
                <Textarea rows={6} {...register(`subServices.${lang}`)} />
              </Field>
            </CardContent>
          </Card>
        ))}
      </div>

      <FormActions submitting={formState.isSubmitting} cancelHref="/admin/catalog/services" />
    </form>
  )
}

/* ---------------- category ---------------- */

const hex = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a colour like #7B2FF7.")
const categoryForm = z.object({
  emoji: z.string().trim().min(1, "Pick an emoji.").max(16),
  name: z.object({ en: z.string().trim().min(1, "Required in English.").max(60), fr: z.string().trim().max(60), de: z.string().trim().max(60) }),
  colorFrom: hex,
  colorTo: hex,
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
})
export type CategoryFormValues = z.infer<typeof categoryForm>

export function CategoryEditForm({ id, initial }: { id: string; initial: CategoryFormValues }) {
  const router = useRouter()
  const { run } = useAdminAction()
  const { register, control, handleSubmit, setError, formState } = useForm<CategoryFormValues>({ resolver: zodResolver(categoryForm), defaultValues: initial })
  const err = formState.errors
  // useWatch (not watch()): compatible with the React Compiler
  const [from, to] = useWatch({ control, name: ["colorFrom", "colorTo"] })

  const onSubmit = handleSubmit(async (v) => {
    try {
      await run({ path: `/api/admin/categories/${id}`, method: "PATCH", body: v, success: "Category saved." })
      router.push("/admin/catalog/categories")
    } catch (e) {
      replayErrors(e, setError)
    }
  })

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-6" noValidate>
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Emoji" error={err.emoji?.message}>
            <Input {...register("emoji")} className="w-24 text-lg" />
          </Field>
          <Field label="Position" error={err.sortOrder?.message} hint="0 = first">
            <Input type="number" min={0} {...register("sortOrder", { valueAsNumber: true })} className="w-28" />
          </Field>
          {LANGS.map(([lang, title]) => (
            <Field key={lang} label={`Name — ${title}`} error={err.name?.[lang]?.message} hint={lang === "en" ? undefined : "Empty = English"}>
              <Input {...register(`name.${lang}`)} />
            </Field>
          ))}
          <Field label="Gradient from" error={err.colorFrom?.message}>
            <Input {...register("colorFrom")} className="font-mono" />
          </Field>
          <Field label="Gradient to" error={err.colorTo?.message}>
            <Input {...register("colorTo")} className="font-mono" />
          </Field>
          <div className="sm:col-span-2">
            <span className="block h-10 rounded-lg" style={{ background: `linear-gradient(110deg, ${from}, ${to})` }} />
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={field.value} onCheckedChange={field.onChange} /> Visible
              </label>
            )}
          />
        </CardContent>
      </Card>
      <FormActions submitting={formState.isSubmitting} cancelHref="/admin/catalog/categories" />
    </form>
  )
}

function FormActions({ submitting, cancelHref }: { submitting: boolean; cancelHref: string }) {
  const router = useRouter()
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={() => router.push(cancelHref)}>
        Cancel
      </Button>
      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2 className="animate-spin" />}
        Save changes
      </Button>
    </div>
  )
}
