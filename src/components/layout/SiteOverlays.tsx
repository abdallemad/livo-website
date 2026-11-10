import type { Locale } from "@/i18n/config"
import { translator } from "@/i18n/translate"
import { CONTACT, SOS_WHATSAPP } from "@/constants/site"
import { SosIcon, WhatsAppIcon } from "@/components/shared/icons"
import { MascotSvg } from "@/components/shared/Mascot"
import { CookieBanner } from "./CookieBanner"
import { PromoDialog } from "./PromoDialog"

/** Floating emergency + WhatsApp buttons, the mascot (opens the booking chat), cookie banner, welcome offer. */
export function SiteOverlays({ lang, mascot = true }: { lang: Locale; mascot?: boolean }) {
  const t = translator(lang)
  return (
    <>
      <i className="wa-r sos-r" aria-hidden="true" />
      <a
        className="wa sos"
        href={SOS_WHATSAPP[lang]}
        target="_blank"
        rel="noopener"
        title={t("Emergency", "Urgence", "Notfall")}
        aria-label={t("Emergency — message us on WhatsApp", "Urgence — écrivez-nous sur WhatsApp", "Notfall — schreiben Sie uns auf WhatsApp")}
      >
        <SosIcon />
      </a>
      <i className="wa-r" aria-hidden="true" />
      <a
        className="wa"
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noopener"
        aria-label={t("Talk to us on WhatsApp", "Parlez-nous sur WhatsApp", "Schreiben Sie uns auf WhatsApp")}
      >
        <WhatsAppIcon />
      </a>
      {mascot && (
      <div className="mas" id="mas">
        <button
          className="mas-b"
          type="button"
          data-chat=""
          aria-label={t("Free inspection — tap to chat", "Inspection gratuite — touchez pour discuter", "Kostenlose Besichtigung — zum Chatten tippen")}
        >
          <MascotSvg gradientId="mgf" />
        </button>
      </div>
      )}
      <CookieBanner />
      <PromoDialog />
    </>
  )
}
