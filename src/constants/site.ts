/**
 * Site identity — the ONLY place the brand, contact details and social links live (CLAUDE.md §9).
 */
export const SITE_NAME = "LIVO"

export const SITE_TAGLINE = {
  en: "All Services. One Place. Anytime.",
  fr: "Tous les services. Un seul endroit. À tout moment.",
  de: "Alle Services. Ein Ort. Jederzeit.",
} as const

export const SITE_DESCRIPTION = {
  en: "Home & daily services in Luxembourg: repairs, cleaning, moving and more. One place, one tap.",
  fr: "Services à domicile et du quotidien au Luxembourg : réparations, nettoyage, déménagement et plus.",
  de: "Services für Zuhause und Alltag in Luxemburg: Reparaturen, Reinigung, Umzug und mehr.",
} as const

export const THEME_COLOR = "#04123A"

export const CONTACT = {
  phoneDisplay: "+352 661 111 353",
  phoneHref: "tel:+352661111353",
  whatsapp: "https://wa.me/352661111353",
  email: "livo.services.lu@gmail.com",
  address: "45 Rue des États-Unis, 1477 Gare Luxembourg",
} as const

export const SOCIAL = {
  facebook: "https://www.facebook.com/profile.php?id=61590328831570",
  instagram: "https://www.instagram.com/livo.services.lu/",
  tiktok: "https://www.tiktok.com/@livoservices",
} as const

/** Pre-filled WhatsApp message behind the floating emergency (SOS) button. */
export const SOS_WHATSAPP = {
  en: "https://wa.me/352661111353?text=%F0%9F%9A%A8%20EMERGENCY%20%E2%80%93%20I%20need%20urgent%20help%20from%20LIVO.%0A%0AWhat%20happened%3A%20%0AMy%20address%3A%20",
  fr: "https://wa.me/352661111353?text=%F0%9F%9A%A8%20URGENCE%20%E2%80%93%20J%E2%80%99ai%20besoin%20de%20l%E2%80%99aide%20urgente%20de%20LIVO.%0A%0ACe%20qui%20s%E2%80%99est%20pass%C3%A9%20%3A%20%0AMon%20adresse%20%3A%20",
  de: "https://wa.me/352661111353?text=%F0%9F%9A%A8%20NOTFALL%20%E2%80%93%20Ich%20brauche%20dringend%20Hilfe%20von%20LIVO.%0A%0AWas%20ist%20passiert%3A%20%0AMeine%20Adresse%3A%20",
} as const
