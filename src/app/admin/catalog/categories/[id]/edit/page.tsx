import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/shared"
import { CategoryEditForm } from "@/components/admin/catalog/CatalogForms"
import type { Localized } from "@/i18n/config"
import { isAppError } from "@/lib/errors"
import { getCategoryForEdit } from "@/services/admin-actions.service"

export const metadata: Metadata = { title: "Edit category" }

export default async function AdminCategoryEditPage({ params }: PageProps<"/admin/catalog/categories/[id]/edit">) {
  const { id } = await params
  const c = await getCategoryForEdit(id).catch((e) => {
    if (isAppError(e) && e.code === "NOT_FOUND") notFound()
    throw e
  })
  const name = c.name as unknown as Localized

  return (
    <>
      <PageHeader title={`${c.emoji} ${name.en}`} description={`Category “${c.slug}” — the slug stays the same (it is the anchor on the services page).`} />
      <CategoryEditForm
        id={c.id}
        initial={{ emoji: c.emoji, name: { en: name.en ?? "", fr: name.fr ?? "", de: name.de ?? "" }, colorFrom: c.colorFrom, colorTo: c.colorTo, isActive: c.isActive, sortOrder: c.sortOrder }}
      />
    </>
  )
}
