/**
 * Home hero slides (prototype: assets/js/home.js `SL`). `*word*` marks the highlighted words.
 * Slide backgrounds come from livo.css (.s1–.s4 → /img/slides/slide-N-{desktop,mobile}.webp).
 */
import type { Localized } from "@/i18n/config"

export interface SlideAction {
  kind: "pk" | "gh" | "s"
  label: Localized
  /** opens the booking chat with this preset ("" = ask) */
  chat?: string
  /** app path (locale is added) or in-page hash */
  href?: string
}

export interface HeroSlide {
  className: "s1" | "s2" | "s3" | "s4"
  art: string[]
  tag: Localized
  title: Localized
  text: Localized
  actions?: SlideAction[]
  /** service chips instead of actions */
  chips?: string[]
  more?: Localized
}

const SEE_ALL = { en: "See all services", fr: "Voir les services", de: "Alle Services" }

export const HERO_SLIDES: HeroSlide[] = [
  {
    className: "s1",
    art: ["🔍", "🏠", "🛠️", "✅"],
    tag: { en: "Free inspection", fr: "Inspection gratuite", de: "Kostenlose Besichtigung" },
    title: { en: "Free *inspection* at your door.", fr: "Inspection *gratuite* à votre porte.", de: "Kostenlose *Besichtigung* bei Ihnen." },
    text: {
      en: "A pro looks at the job and gives you a clear quote.",
      fr: "Un pro évalue le travail et vous donne un devis clair.",
      de: "Ein Profi prüft den Auftrag und macht Ihnen ein klares Angebot.",
    },
    actions: [
      { kind: "pk", label: { en: "Book my free inspection", fr: "Réserver mon inspection gratuite", de: "Kostenlose Besichtigung buchen" }, chat: "free-inspection" },
      { kind: "gh", label: SEE_ALL, href: "/services" },
    ],
  },
  {
    className: "s2",
    art: ["🔧", "🧼", "📦", "🪛"],
    tag: { en: "Top services", fr: "Services phares", de: "Top-Services" },
    title: { en: "Handyman. Cleaning. *Moving.*", fr: "Bricolage. Nettoyage. *Déménagement.*", de: "Handwerk. Reinigung. *Umzug.*" },
    text: {
      en: "Our most requested services, one tap away.",
      fr: "Nos services les plus demandés, à portée de main.",
      de: "Unsere meistgefragten Services, nur einen Tipp entfernt.",
    },
    chips: ["handyman", "cleaning", "moving"],
    more: { en: "All services", fr: "Tous les services", de: "Alle Services" },
  },
  {
    className: "s3",
    art: ["📱", "👷", "⚡", "🏡"],
    tag: { en: "One tap", fr: "Un clic", de: "Ein Tipp" },
    title: { en: "One tap. *The right pro.*", fr: "Un clic. *Le bon pro.*", de: "Ein Tipp. *Der richtige Profi.*" },
    text: {
      en: "Tell us what you need — we do the matching.",
      fr: "Dites-nous ce qu’il vous faut — on s’occupe du reste.",
      de: "Sagen Sie uns, was Sie brauchen — wir finden den Profi.",
    },
    actions: [
      { kind: "s", label: { en: "Request a service", fr: "Demander un service", de: "Service anfragen" }, chat: "" },
      { kind: "gh", label: { en: "How it works", fr: "Comment ça marche", de: "So funktioniert’s" }, href: "#how" },
    ],
  },
  {
    className: "s4",
    art: ["💶", "🛋️", "🧰", "😊"],
    tag: { en: "Fair & easy", fr: "Simple & juste", de: "Fair & einfach" },
    title: { en: "Fair prices. *Zero hassle.*", fr: "Prix justes. *Zéro tracas.*", de: "Faire Preise. *Null Stress.*" },
    text: {
      en: "Clear quotes, local pros, no surprises.",
      fr: "Devis clairs, pros locaux, aucune surprise.",
      de: "Klare Angebote, lokale Profis, keine Überraschungen.",
    },
    actions: [
      { kind: "pk", label: { en: "Get a quote", fr: "Obtenir un devis", de: "Angebot einholen" }, chat: "" },
      { kind: "gh", label: SEE_ALL, href: "/services" },
    ],
  },
]

/** The eight cards in the home "Services" section. */
export const FEATURED_SERVICE_IDS = ["handyman", "cleaning", "moving", "plumbing", "electrical", "painting", "carpentry", "construction"]
