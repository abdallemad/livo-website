import type { Metadata } from "next"
import { resolvePage } from "@/i18n/server"
import { pageMetadata } from "@/utils/seo-metadata"
import { AuthView } from "@/components/pages/AuthView"

/**
 * /<lang>/auth (log in) and /<lang>/auth/signup are prerendered; Clerk Elements' follow-up steps
 * (/auth/factor-one, /auth/signup/verifications, /auth/sso-callback…) render the same view on demand.
 */
export function generateStaticParams() {
  return [{ step: undefined }, { step: ["signup"] }]
}

const TITLE = { en: "Log in or sign up – LIVO", fr: "Connexion ou inscription – LIVO", de: "Anmelden oder registrieren – LIVO" }

export async function generateMetadata({ params }: PageProps<"/[lang]/auth/[[...step]]">): Promise<Metadata> {
  const { lang, t } = await resolvePage(params)
  // private page: noindex (not Disallow), see CLAUDE.md §11
  return pageMetadata(lang, "/auth", { title: t(TITLE.en, TITLE.fr, TITLE.de), description: "Log in or create your LIVO account.", noindex: true })
}

export default function AuthPage() {
  return <AuthView />
}
