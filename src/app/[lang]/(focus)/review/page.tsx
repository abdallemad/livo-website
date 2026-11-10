import type { Metadata } from "next"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"
import { ReviewView } from "@/components/pages/ReviewView"

const TITLE = { en: "Rate your service – LIVO", fr: "Évaluez votre service – LIVO", de: "Service bewerten – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/review">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  // reached from a personal link (?service=…&ref=…): keep it out of search results
  return pageMetadata(lang, "/review", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "How was your LIVO service?", noindex: true })
}

export default function ReviewPage() {
  return <ReviewView />
}
