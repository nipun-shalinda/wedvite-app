/**
 * KandyanDecorations.tsx
 * Decorative elements for the traditional Kandyan wedding theme.
 * Sections 1, 2, and 6 use real artwork from /images/.
 * Remaining sections keep their original pure-SVG implementations.
 */

import type { CSSProperties } from "react";
interface Props { color: string; className?: string; style?: CSSProperties; }

/* ─────────────────────────────────────────────
   1. MANDALA  (top-centre ornament)
   Uses Header-decoration.svg artwork
───────────────────────────────────────────── */
export function Mandala({ color: _color, className = "", style }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/Header-decoration.svg"
      alt="Kandyan header decoration"
      className={className}
      style={{ objectFit: "contain", ...style }}
    />
  );
}

/* ─────────────────────────────────────────────
   2. CORNER FOLIAGE  (top-left; mirror for other corners)
   Uses up.svg artwork
───────────────────────────────────────────── */
export function CornerFoliage({ color: _color, className = "", style }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/up.svg"
      alt="Kandyan corner foliage"
      className={className}
      style={{ objectFit: "contain", ...style }}
    />
  );
}

/* ─────────────────────────────────────────────
   3. LOTUS DIVIDER  (horizontal section break)
───────────────────────────────────────────── */
export function LotusDivider({ color, className = "", style }: Props) {
  return (
    <svg viewBox="0 0 260 30" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left line */}
      <line x1="0"   y1="15" x2="108" y2="15" stroke={color} strokeWidth="0.8" opacity="0.30"/>
      {/* Right line */}
      <line x1="152" y1="15" x2="260" y2="15" stroke={color} strokeWidth="0.8" opacity="0.30"/>

      {/* Lotus centre */}
      {/* Outer petals */}
      <ellipse cx="130" cy="15" rx="5" ry="11" fill={color} opacity="0.35" />
      <ellipse cx="130" cy="15" rx="5" ry="11" fill={color} opacity="0.35" transform="rotate(45 130 15)"/>
      <ellipse cx="130" cy="15" rx="5" ry="11" fill={color} opacity="0.35" transform="rotate(-45 130 15)"/>
      <ellipse cx="130" cy="15" rx="5" ry="11" fill={color} opacity="0.35" transform="rotate(90 130 15)"/>
      {/* Inner petals */}
      <ellipse cx="130" cy="15" rx="3" ry="7" fill={color} opacity="0.50" />
      <ellipse cx="130" cy="15" rx="3" ry="7" fill={color} opacity="0.50" transform="rotate(60 130 15)"/>
      <ellipse cx="130" cy="15" rx="3" ry="7" fill={color} opacity="0.50" transform="rotate(-60 130 15)"/>
      {/* Centre dot */}
      <circle cx="130" cy="15" r="2.5" fill={color} opacity="0.65"/>

      {/* Small dot accents flanking */}
      <circle cx="115" cy="15" r="1.5" fill={color} opacity="0.35"/>
      <circle cx="145" cy="15" r="1.5" fill={color} opacity="0.35"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   4. KANDYAN COUPLE  (stylised SVG illustration placeholder)
   Groom in Kandyan headdress + bride in white saree
───────────────────────────────────────────── */
export function KandyanCouple({ color, className = "", style }: Props) {
  return (
    <svg viewBox="0 0 180 220" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── GROOM (left) ── */}
      {/* Headdress / crown */}
      <path d="M62 38 Q68 20 75 25 Q78 15 82 22 Q86 12 90 20 Q94 14 98 22 Q102 16 106 24 Q112 20 118 38"
            stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.18" opacity="0.70"/>
      <line x1="90" y1="20" x2="90" y2="38" stroke={color} strokeWidth="0.8" opacity="0.50"/>
      {/* Head */}
      <ellipse cx="82" cy="52" rx="14" ry="15" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1" opacity="0.60"/>
      {/* Body — white Kandyan cloth */}
      <path d="M68 67 Q62 110 65 145 L99 145 Q102 110 96 67 Z"
            fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.9" opacity="0.55"/>
      {/* Jacket / upper garment */}
      <path d="M68 67 Q70 90 80 95 Q90 90 96 67"
            fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.8" opacity="0.60"/>
      {/* Arms reaching toward bride */}
      <path d="M96 80 Q112 90 118 105" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.50"/>
      <path d="M68 80 Q60 95 58 110"  stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.40"/>
      {/* Legs */}
      <path d="M72 145 Q70 172 68 185" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.40"/>
      <path d="M92 145 Q94 172 96 185" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.40"/>

      {/* ── BRIDE (right) ── */}
      {/* Hair bun */}
      <circle cx="122" cy="42" r="8" fill={color} fillOpacity="0.20" stroke={color} strokeWidth="0.8" opacity="0.55"/>
      <circle cx="127" cy="38" r="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="0.6" opacity="0.50"/>
      {/* Head */}
      <ellipse cx="118" cy="55" rx="12" ry="13" fill={color} fillOpacity="0.13" stroke={color} strokeWidth="1" opacity="0.58"/>
      {/* Saree body */}
      <path d="M106 68 Q100 112 103 148 L133 148 Q136 112 130 68 Z"
            fill={color} fillOpacity="0.10" stroke={color} strokeWidth="0.9" opacity="0.50"/>
      {/* Saree drape */}
      <path d="M106 68 Q110 80 118 82 Q126 78 130 68"
            fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.7" opacity="0.55"/>
      <path d="M100 100 Q95 115 98 125 Q106 130 118 128 Q130 130 137 122 Q140 112 136 100"
            stroke={color} strokeWidth="0.7" opacity="0.35"/>
      {/* Arm toward groom */}
      <path d="M106 82 Q100 90 96 100" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.48"/>
      {/* Legs */}
      <path d="M110 148 Q108 172 107 185" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.38"/>
      <path d="M126 148 Q128 172 129 185" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.38"/>

      {/* ── Joined hands (centre) ── */}
      <circle cx="104" cy="104" r="5" fill={color} fillOpacity="0.30" stroke={color} strokeWidth="0.8" opacity="0.55"/>

      {/* ── Ground shadow ── */}
      <ellipse cx="100" cy="192" rx="38" ry="5" fill={color} opacity="0.08"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   5. PERAHERA STRIP  (bottom procession)
   Elephant + flag bearers + drummers
───────────────────────────────────────────── */
export function PeraheraStrip({ color, className = "", style }: Props) {
  return (
    <svg viewBox="0 0 400 90" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">

      {/* ── ELEPHANT (centre-right) ── */}
      {/* Body */}
      <ellipse cx="220" cy="58" rx="38" ry="26" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.1" opacity="0.55"/>
      {/* Head */}
      <ellipse cx="252" cy="44" rx="18" ry="16" fill={color} fillOpacity="0.20" stroke={color} strokeWidth="1" opacity="0.55"/>
      {/* Ear */}
      <ellipse cx="265" cy="42" rx="8" ry="11" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.8" opacity="0.40"/>
      {/* Trunk */}
      <path d="M268 52 Q280 60 278 72 Q276 80 270 78" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.50"/>
      {/* Tusk */}
      <path d="M266 56 Q282 55 284 62" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.40"/>
      {/* Eye */}
      <circle cx="260" cy="40" r="2" fill={color} opacity="0.55"/>
      {/* Legs */}
      <rect x="196" y="80" width="10" height="14" rx="3" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="212" y="80" width="10" height="14" rx="3" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="228" y="80" width="10" height="14" rx="3" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="244" y="80" width="10" height="14" rx="3" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      {/* Decorative cloth on back */}
      <path d="M200 46 Q220 36 240 40 Q235 55 220 58 Q205 60 200 46Z"
            fill={color} fillOpacity="0.28" stroke={color} strokeWidth="0.7" opacity="0.50"/>
      {/* Canopy on elephant */}
      <path d="M206 32 Q220 22 234 32 L238 46 Q220 40 202 46Z"
            fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.8" opacity="0.48"/>
      {/* Canopy pole */}
      <line x1="220" y1="22" x2="220" y2="46" stroke={color} strokeWidth="1" opacity="0.45"/>

      {/* ── FLAG BEARER LEFT 1 ── */}
      <ellipse cx="30" cy="52" rx="8" ry="9" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="26" y="61" width="8" height="22" rx="2" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.7" opacity="0.40"/>
      {/* Pole */}
      <line x1="30" y1="20" x2="30" y2="61" stroke={color} strokeWidth="1.2" opacity="0.45"/>
      {/* Fan / circular flag */}
      <circle cx="30" cy="14" r="10" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.9" opacity="0.50"/>
      {[0,60,120,180,240,300].map((a) => (
        <line key={a} x1="30" y1="14"
              x2={30 + 9*Math.cos(a*Math.PI/180)}
              y2={14 + 9*Math.sin(a*Math.PI/180)}
              stroke={color} strokeWidth="0.5" opacity="0.35"/>
      ))}

      {/* ── FLAG BEARER LEFT 2 ── */}
      <ellipse cx="70" cy="54" rx="8" ry="9" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="66" y="63" width="8" height="22" rx="2" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.7" opacity="0.40"/>
      <line x1="70" y1="22" x2="70" y2="63" stroke={color} strokeWidth="1.2" opacity="0.45"/>
      <circle cx="70" cy="15" r="10" fill={color} fillOpacity="0.20" stroke={color} strokeWidth="0.9" opacity="0.50"/>

      {/* ── DRUMMER LEFT ── */}
      <ellipse cx="110" cy="53" rx="8" ry="9" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="106" y="62" width="8" height="22" rx="2" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.7" opacity="0.40"/>
      {/* Drum */}
      <ellipse cx="118" cy="60" rx="8" ry="5" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.8" opacity="0.50"/>
      {/* Drum sticks */}
      <line x1="116" y1="58" x2="108" y2="50" stroke={color} strokeWidth="1" opacity="0.40"/>
      <line x1="120" y1="56" x2="126" y2="48" stroke={color} strokeWidth="1" opacity="0.40"/>

      {/* ── DANCER ── */}
      <ellipse cx="150" cy="52" rx="8" ry="9" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="146" y="61" width="8" height="20" rx="2" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.7" opacity="0.40"/>
      {/* Arms raised */}
      <path d="M146 65 Q138 55 134 48" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.40"/>
      <path d="M154 65 Q162 55 166 48" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.40"/>

      {/* ── FLAG BEARER RIGHT 1 ── */}
      <ellipse cx="300" cy="52" rx="8" ry="9" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="296" y="61" width="8" height="22" rx="2" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.7" opacity="0.40"/>
      <line x1="300" y1="20" x2="300" y2="61" stroke={color} strokeWidth="1.2" opacity="0.45"/>
      <circle cx="300" cy="14" r="10" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.9" opacity="0.50"/>
      {[0,60,120,180,240,300].map((a) => (
        <line key={a} x1="300" y1="14"
              x2={300 + 9*Math.cos(a*Math.PI/180)}
              y2={14 + 9*Math.sin(a*Math.PI/180)}
              stroke={color} strokeWidth="0.5" opacity="0.35"/>
      ))}

      {/* ── FLAG BEARER RIGHT 2 ── */}
      <ellipse cx="340" cy="54" rx="8" ry="9" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="336" y="63" width="8" height="22" rx="2" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.7" opacity="0.40"/>
      <line x1="340" y1="22" x2="340" y2="63" stroke={color} strokeWidth="1.2" opacity="0.45"/>
      <circle cx="340" cy="15" r="10" fill={color} fillOpacity="0.20" stroke={color} strokeWidth="0.9" opacity="0.50"/>

      {/* ── DRUMMER RIGHT ── */}
      <ellipse cx="375" cy="53" rx="8" ry="9" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.8" opacity="0.45"/>
      <rect x="371" y="62" width="8" height="22" rx="2" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.7" opacity="0.40"/>
      <ellipse cx="365" cy="60" rx="8" ry="5" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.8" opacity="0.50"/>
      <line x1="367" y1="58" x2="375" y2="50" stroke={color} strokeWidth="1" opacity="0.40"/>
      <line x1="363" y1="56" x2="357" y2="48" stroke={color} strokeWidth="1" opacity="0.40"/>

      {/* Ground line */}
      <line x1="0" y1="84" x2="400" y2="84" stroke={color} strokeWidth="0.6" opacity="0.20"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   6. SIDE ORNAMENT  (small motif for left/right margins)
   Uses bottom.svg artwork
───────────────────────────────────────────── */
export function SideOrnament({ color: _color, className = "", style }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/bottom.svg"
      alt="Kandyan side ornament"
      className={className}
      style={{ objectFit: "contain", ...style }}
    />
  );
}