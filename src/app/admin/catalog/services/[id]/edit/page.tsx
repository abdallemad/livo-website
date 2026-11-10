import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/shared"
import { ServiceEditForm, type ServiceFormValues } from "@/components/admin/catalog/CatalogForms"
import type { Localized } from "@/i18n/config"
import { isAppError } from "@/lib/errors"
import { listCategoriesAdmin } from "@/services/admin.service"
import { getServiceForEdit } from "@/services/admin-actions.service"

export const metadata: Metadata = { title: "Edit service" }

export default async function AdminServiceEditPage({ params }: PageProps<"/admin/catalog/services/[id]/edit">) {
  const { id } = await params
  const [s, categories] = await Promise.all([
    getServiceForEdit(id).catch((e) => {
      if (isAppError(e) && e.code === "NOT_FOUND") notFound()
      throw e
    }),
    listCategoriesAdmin(),
  ])
  const name = s.name as unknown as Localized
  const description = s.description as unknown as Localized
  const subs = s.subServices as unknown as Localized<string[]>
  const initial: ServiceFormValues = {
    emoji: s.emoji,
    name: { en: name.en ?? "", fr: name.fr ?? "", de: name.de ?? "" },
    description: { en: description.en ?? "", fr: description.fr ?? "", de: description.de ?? "" },
    subServices: { en: (subs.en ?? []).join("\n"), fr: (subs.fr ?? []).join("\n"), de: (subs.de ?? []).join("\n") },
    categoryId: s.categoryId,
    featured: s.featured,
    isActive: s.isActive,
    sortOrder: s.sortOrder,
  }

  return (
    <>
      <PageHeader title={`${s.emoji} ${name.en}`} description={`Service “${s.slug}” — the slug stays the same (chat presets, links and the app use it).`} />
      <ServiceEditForm id={s.id} initial={initial} categories={categories.map((c) => ({ value: c.id, label: `${c.emoji} ${c.name}` }))} />
    </>
  )
}
