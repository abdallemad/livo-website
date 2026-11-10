/**
 * The LIVO mascot (a pro with a wrench). Used by the floating button and the "Pros" band.
 * `gradientId` must be unique per page because both copies can be on screen together.
 */
export function MascotSvg({ gradientId }: { gradientId: string }) {
  return (
    <svg viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF3D5A" />
          <stop offset="1" stopColor="#C42B9B" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="133" rx="30" ry="6" fill="#04123A" opacity=".18" />
      <rect x="42" y="106" width="12" height="22" rx="6" fill="#04123A" />
      <rect x="66" y="106" width="12" height="22" rx="6" fill="#04123A" />
      <ellipse cx="46" cy="129" rx="11" ry="5.5" fill="#0A1F5C" />
      <ellipse cx="74" cy="129" rx="11" ry="5.5" fill="#0A1F5C" />
      <path d="M95 78 q15 4 14 22" stroke="#C42B9B" strokeWidth="9" strokeLinecap="round" fill="none" />
      <g transform="translate(108 98) rotate(28)">
        <rect x="-3" y="-2" width="6" height="30" rx="3" fill="#A9AEB8" />
        <circle cx="0" cy="-8" r="9" fill="none" stroke="#A9AEB8" strokeWidth="5.5" />
        <rect x="-4" y="-18" width="8" height="9" fill="#F3F4FB" />
      </g>
      <circle cx="109" cy="98" r="6.5" fill="#FFD3B8" />
      <rect x="24" y="48" width="72" height="66" rx="24" fill={`url(#${gradientId})`} />
      <path d="M60 96 l-14 -12 v-10 h8 v6 l6 -5 l6 5 v-6 h8 v10z" fill="#fff" opacity=".22" transform="translate(0 14)" />
      <ellipse className="m-eye" cx="45" cy="80" rx="6.5" ry="8" fill="#fff" />
      <circle cx="46.5" cy="81" r="3.8" fill="#04123A" />
      <ellipse className="m-eye" cx="75" cy="80" rx="6.5" ry="8" fill="#fff" />
      <circle cx="76.5" cy="81" r="3.8" fill="#04123A" />
      <path d="M48 94 q12 13 24 0" stroke="#fff" strokeWidth="4.2" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="92" r="5" fill="#fff" opacity=".3" />
      <circle cx="85" cy="92" r="5" fill="#fff" opacity=".3" />
      <path d="M26 56 C26 20 94 20 94 56Z" fill="#04123A" />
      <path d="M20 57 H100 Q103 64 93 64 H27 Q17 64 20 57Z" fill="#0A1F5C" />
      <image href="/img/logo-mark.webp" x="49" y="32.4" width="22" height="21.55" />
      <g className="m-arm">
        <path d="M25 78 q-19 -3 -17 -27" stroke="#C42B9B" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="8" cy="48" r="7.5" fill="#FFD3B8" />
      </g>
    </svg>
  )
}
