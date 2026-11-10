import type { Metadata } from "next"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"
import { AccountView } from "@/components/pages/AccountView"

const TITLE = { en: "My profile – LIVO", fr: "Mon profil – LIVO", de: "Mein Profil – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/account">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/account", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "Your LIVO profile and requests.", noindex: true })
}

export default function AccountPage() {
  return <AccountView />
}
