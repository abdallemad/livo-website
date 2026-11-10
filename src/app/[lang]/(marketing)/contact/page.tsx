import type { Metadata } from "next"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"
import { ContactView } from "@/components/pages/ContactView"

const TITLE = { en: "Contact us – LIVO", fr: "Nous contacter – LIVO", de: "Kontakt – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  return pageMetadata(lang, "/contact", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "Contact LIVO: questions, inquiries and complaints." })
}

export default function ContactPage() {
  return <ContactView />
}
