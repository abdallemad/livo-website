import type { Metadata } from "next"
import { PageHeader } from "@/components/admin/shared"
import { TownsManager } from "@/components/admin/catalog/TownsManager"
import { listTownsAdmin } from "@/services/admin.service"

export const metadata: Metadata = { title: "Towns" }

export default async function AdminTownsPage() {
  const towns = await listTownsAdmin()
  return (
    <>
      <PageHeader title="Towns" description="Suggested in the booking chat’s address step (and GET /api/towns for the app). Hidden towns are not suggested." />
      <TownsManager towns={towns.map((t) => ({ id: t.id, name: t.name, isActive: t.isActive, sortOrder: t.sortOrder }))} />
    </>
  )
}
