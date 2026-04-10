import React from 'react'

/* ── PNG-backed sprites (CC0 assets from OpenGameArt.org) ───────────────── */

const Img = ({src, size, alt}) => (
  <img src={src} width={size} height={size} alt={alt} draggable={false}
    style={{imageRendering:'pixelated', display:'block'}} />
)

export const TomatoSprite       = ({size=44}) => <Img src="/sprites/tomato.png"          size={size} alt="Tomatoes" />
export const OnionSprite        = ({size=44}) => <Img src="/sprites/onion.png"           size={size} alt="Onions" />
export const LettuceSprite      = ({size=44}) => <Img src="/sprites/lettuce.png"         size={size} alt="Lettuce" />
export const LemonSprite        = ({size=44}) => <Img src="/sprites/lemon.png"           size={size} alt="Lemons" />
export const LimeSprite         = ({size=44}) => <Img src="/sprites/lime.png"            size={size} alt="Limes" />
export const OrangeSprite       = ({size=44}) => <Img src="/sprites/orange.png"          size={size} alt="Oranges" />
export const ChickenSprite      = ({size=44}) => <Img src="/sprites/chicken.png"         size={size} alt="Chicken" />
export const FishSprite         = ({size=44}) => <Img src="/sprites/fish.png"            size={size} alt="Fish" />
export const BeefBoxSprite      = ({size=44}) => <Img src="/sprites/beef_box.png"        size={size} alt="Beef Box" />
export const FlourBagSprite     = ({size=44}) => <Img src="/sprites/flour.png"           size={size} alt="Flour" />
export const RiceBagSprite      = ({size=44}) => <Img src="/sprites/rice.png"            size={size} alt="Rice" />
export const PastaBoxSprite     = ({size=44}) => <Img src="/sprites/pasta.png"           size={size} alt="Pasta" />
export const CannedTomatoesSprite = ({size=44}) => <Img src="/sprites/canned_tomatoes.png" size={size} alt="Canned Tomatoes" />
export const LiquorBottleSprite = ({size=44}) => <Img src="/sprites/liquor_bottle.png"  size={size} alt="Liquor" />
export const WineBottleSprite   = ({size=44}) => <Img src="/sprites/wine_bottle.png"    size={size} alt="Wine" />

/* ── SVG sprites (no suitable CC0 pixel-art equivalent found) ───────────── */

export const SugarSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="13" ry="3" fill="#00000050"/>
    <rect x="10" y="10" width="28" height="34" rx="2" fill="#1a2a6a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="10" y="10" width="28" height="34" rx="2" fill="#2a4aaa"/>
    <rect x="10" y="10" width="28" height="8" rx="2" fill="#1a3a9a"/>
    <rect x="12" y="20" width="24" height="20" rx="1" fill="white" opacity="0.95"/>
    <text x="24" y="28" textAnchor="middle" fontSize="5.5" fill="#1a2a8a" fontWeight="bold" fontFamily="monospace">SUGAR</text>
    <text x="24" y="34" textAnchor="middle" fontSize="4" fill="#4a6acc" fontFamily="monospace">PURE CANE</text>
    <rect x="10" y="18" width="28" height="3" fill="#4060cc" opacity="0.6"/>
    <ellipse cx="20" cy="14" rx="3" ry="2" fill="#3a5acc" opacity="0.5"/>
  </svg>
)

export const BeerKegSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="14" ry="3" fill="#00000050"/>
    <rect x="12" y="12" width="24" height="30" rx="8" fill="#4a4a5a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="12" y="12" width="24" height="30" rx="8" fill="#6a6a7a"/>
    <rect x="14" y="14" width="20" height="26" rx="7" fill="#7a7a8a"/>
    <line x1="12" y1="22" x2="36" y2="22" stroke="#4a4a5a" strokeWidth="1.5"/>
    <line x1="12" y1="32" x2="36" y2="32" stroke="#4a4a5a" strokeWidth="1.5"/>
    <ellipse cx="24" cy="22" rx="10" ry="2" fill="#5a5a6a" opacity="0.5"/>
    <ellipse cx="24" cy="12" rx="12" ry="4" fill="#5a5a6a" stroke="#1a1a2e" strokeWidth="1"/>
    <ellipse cx="24" cy="12" rx="10" ry="3" fill="#7a7a8a"/>
    <rect x="21" y="6" width="6" height="8" rx="2" fill="#4a4a5a" stroke="#1a1a2e" strokeWidth="1"/>
    <circle cx="24" cy="9" r="2" fill="#8a8a9a"/>
    <ellipse cx="19" cy="26" rx="3" ry="4" fill="white" opacity="0.15"/>
  </svg>
)

export const SanitizerSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="9" ry="3" fill="#00000050"/>
    <rect x="16" y="14" width="16" height="30" rx="4" fill="#1a3a6a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="16" y="14" width="16" height="30" rx="4" fill="#2a5aaa"/>
    <rect x="17" y="15" width="14" height="28" rx="3" fill="#3a6acc" opacity="0.8"/>
    <rect x="18" y="20" width="12" height="16" fill="white" opacity="0.9"/>
    <text x="24" y="26" textAnchor="middle" fontSize="4" fill="#1a3a8a" fontWeight="bold" fontFamily="monospace">SANI</text>
    <text x="24" y="30" textAnchor="middle" fontSize="3" fill="#2a4a9a" fontFamily="monospace">SPRAY</text>
    <text x="24" y="33" textAnchor="middle" fontSize="3" fill="#4a6ab0" fontFamily="monospace">4QT</text>
    <path d="M22 14 L22 10 Q24 8 26 10 L26 14" fill="#2a5aaa" stroke="#1a1a2e" strokeWidth="1"/>
    <rect x="24" y="7" width="6" height="4" rx="1" fill="#1a3a6a" stroke="#1a1a2e" strokeWidth="0.8"/>
    <path d="M30 9 Q34 8 34 11 L32 12" fill="#1a3a6a" stroke="#1a1a2e" strokeWidth="0.8" strokeLinecap="round"/>
  </svg>
)

export const DishSoapSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="9" ry="3" fill="#00000050"/>
    <path d="M16 18 Q14 22 14 34 Q14 44 24 44 Q34 44 34 34 Q34 22 32 18Z" fill="#0a4a1a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <path d="M17 18 Q15 22 15 34 Q15 43 24 43 Q33 43 33 34 Q33 22 31 18Z" fill="#0f6a28"/>
    <path d="M18 19 Q16 23 16 34 Q16 41 24 41 Q32 41 32 34 Q32 23 30 19Z" fill="#1a8a38" opacity="0.7"/>
    <rect x="16" y="22" width="16" height="14" fill="white" opacity="0.9"/>
    <text x="24" y="27" textAnchor="middle" fontSize="4" fill="#0a4a1a" fontWeight="bold" fontFamily="monospace">DISH</text>
    <text x="24" y="31" textAnchor="middle" fontSize="4" fill="#0a4a1a" fontWeight="bold" fontFamily="monospace">SOAP</text>
    <path d="M18 18 Q24 14 30 18" fill="#0f6a28" stroke="#1a1a2e" strokeWidth="1.2"/>
    <rect x="21" y="10" width="6" height="9" rx="2" fill="#0a5a20" stroke="#1a1a2e" strokeWidth="1"/>
    <circle cx="24" cy="14" r="2" fill="#1a8a38"/>
    <ellipse cx="20" cy="25" rx="2" ry="3" fill="white" opacity="0.2"/>
  </svg>
)

export const GlovesBoxSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="13" ry="3" fill="#00000050"/>
    <rect x="8" y="12" width="32" height="32" rx="3" fill="#0a2a6a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="8" y="12" width="32" height="32" rx="3" fill="#1a4aaa"/>
    <rect x="8" y="12" width="32" height="10" rx="3" fill="#0e3888"/>
    <rect x="18" y="12" width="12" height="5" rx="1" fill="#0a2a6a" opacity="0.8"/>
    <rect x="10" y="24" width="28" height="16" rx="1" fill="white" opacity="0.9"/>
    <text x="24" y="30" textAnchor="middle" fontSize="4" fill="#0a2a8a" fontWeight="bold" fontFamily="monospace">GLOVES</text>
    <text x="24" y="34" textAnchor="middle" fontSize="3" fill="#2a4aaa" fontFamily="monospace">NITRILE</text>
    <text x="24" y="37.5" textAnchor="middle" fontSize="3" fill="#4a6acc" fontFamily="monospace">SIZE M / 100ct</text>
    <ellipse cx="18" cy="16" rx="3" ry="2" fill="#1a4aaa" opacity="0.5"/>
  </svg>
)

export const TongsSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="8" ry="3" fill="#00000050"/>
    <path d="M18 42 L16 10 Q18 6 24 8 Q30 6 32 10 L30 42 Q24 44 18 42Z" fill="#2a2a30" stroke="#1a1a2e" strokeWidth="1.5"/>
    <path d="M19 41 L17 11 Q19 7 24 9 Q29 7 31 11 L29 41" fill="#4a4a55"/>
    <path d="M20 40 L18 12 Q20 8 24 10 Q28 8 30 12 L28 40" fill="#6a6a75" opacity="0.6"/>
    <ellipse cx="24" cy="10" rx="4" ry="3" fill="#8a8a95"/>
    <circle cx="24" cy="10" r="2.5" fill="#5a5a65" stroke="#3a3a45" strokeWidth="1"/>
    <path d="M18 38 Q16 40 17 42 Q20 44 22 43" fill="none" stroke="#4a4a55" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 38 Q32 40 31 42 Q28 44 26 43" fill="none" stroke="#4a4a55" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="21" cy="25" rx="1" ry="8" fill="#8a8a9a" opacity="0.4"/>
    <ellipse cx="27" cy="25" rx="1" ry="8" fill="#8a8a9a" opacity="0.4"/>
  </svg>
)

export const SpatulaSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="6" ry="3" fill="#00000050"/>
    <rect x="21" y="8" width="6" height="28" rx="1" fill="#3a3028" stroke="#1a1a2e" strokeWidth="1"/>
    <rect x="22" y="9" width="4" height="26" fill="#5a4a38" opacity="0.8"/>
    <path d="M14 32 Q14 38 18 40 L30 40 Q34 38 34 32 L14 32Z" fill="#2a2a30" stroke="#1a1a2e" strokeWidth="1.5"/>
    <path d="M15 33 Q15 38 18 40 L30 40 Q33 38 33 33 L15 33Z" fill="#4a4a55"/>
    <path d="M16 34 Q16 37 19 39 L29 39 Q32 37 32 34 L16 34Z" fill="#6a6a75" opacity="0.7"/>
    <ellipse cx="24" cy="36" rx="5" ry="2" fill="#8a8a9a" opacity="0.3"/>
    <path d="M20 34 Q24 33 28 34" stroke="#8a8a9a" strokeWidth="0.8" fill="none" opacity="0.5"/>
    <rect x="22" y="4" width="4" height="6" rx="2" fill="#2a1a10" stroke="#1a1a2e" strokeWidth="1"/>
  </svg>
)

export const SheetPanSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="43" rx="18" ry="4" fill="#00000070"/>
    <rect x="4" y="22" width="40" height="20" rx="2" fill="#2a2a32" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="4" y="22" width="40" height="20" rx="2" fill="#4a4a5a"/>
    <rect x="6" y="24" width="36" height="16" rx="1" fill="#5a5a6a"/>
    <rect x="6" y="24" width="36" height="2" fill="#7a7a8a"/>
    <rect x="3" y="22" width="4" height="20" rx="1" fill="#3a3a45" stroke="#1a1a2e" strokeWidth="1"/>
    <rect x="41" y="22" width="4" height="20" rx="1" fill="#3a3a45" stroke="#1a1a2e" strokeWidth="1"/>
    <line x1="6" y1="30" x2="42" y2="30" stroke="#4a4a55" strokeWidth="0.5" opacity="0.5"/>
    <line x1="6" y1="36" x2="42" y2="36" stroke="#4a4a55" strokeWidth="0.5" opacity="0.5"/>
    <ellipse cx="20" cy="26" rx="6" ry="2" fill="#7a7a8a" opacity="0.3"/>
  </svg>
)

export const HotelPanSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="17" ry="3" fill="#00000070"/>
    <rect x="5" y="18" width="38" height="26" rx="2" fill="#1a1a22" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="5" y="18" width="38" height="26" rx="2" fill="#3a3a48"/>
    <rect x="7" y="20" width="34" height="22" rx="1" fill="#4a4a58"/>
    <rect x="5" y="18" width="38" height="4" rx="2" fill="#5a5a68"/>
    <rect x="4" y="18" width="5" height="26" rx="1" fill="#2a2a35" stroke="#1a1a2e" strokeWidth="1"/>
    <rect x="39" y="18" width="5" height="26" rx="1" fill="#2a2a35" stroke="#1a1a2e" strokeWidth="1"/>
    <line x1="7" y1="28" x2="41" y2="28" stroke="#3a3a45" strokeWidth="0.8" opacity="0.5"/>
    <line x1="7" y1="36" x2="41" y2="36" stroke="#3a3a45" strokeWidth="0.8" opacity="0.5"/>
    <ellipse cx="19" cy="23" rx="5" ry="1.5" fill="#6a6a78" opacity="0.4"/>
  </svg>
)

export const NapkinsSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="43" rx="13" ry="3" fill="#00000050"/>
    <rect x="10" y="18" width="28" height="24" rx="2" fill="#c8c8c8" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="10" y="18" width="28" height="24" rx="2" fill="#e8e8e8"/>
    <rect x="10" y="18" width="28" height="3" fill="#d0d0d0"/>
    <line x1="10" y1="22" x2="38" y2="22" stroke="#c0c0c0" strokeWidth="0.5"/>
    <line x1="10" y1="25" x2="38" y2="25" stroke="#c0c0c0" strokeWidth="0.5"/>
    <line x1="10" y1="28" x2="38" y2="28" stroke="#c0c0c0" strokeWidth="0.5"/>
    <line x1="10" y1="31" x2="38" y2="31" stroke="#c0c0c0" strokeWidth="0.5"/>
    <line x1="10" y1="34" x2="38" y2="34" stroke="#c0c0c0" strokeWidth="0.5"/>
    <line x1="10" y1="37" x2="38" y2="37" stroke="#c0c0c0" strokeWidth="0.5"/>
    <rect x="16" y="28" width="16" height="4" rx="1" fill="#888" opacity="0.8"/>
    <text x="24" y="31.5" textAnchor="middle" fontSize="3.5" fill="white" fontFamily="monospace">LINEN CO.</text>
    <ellipse cx="18" cy="20" rx="4" ry="1.5" fill="white" opacity="0.4"/>
  </svg>
)

export const ToGoContainersSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="14" ry="3" fill="#00000050"/>
    <rect x="9" y="28" width="30" height="16" rx="2" fill="#2a2a2a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="9" y="28" width="30" height="16" rx="2" fill="#4a4a4a"/>
    <rect x="9" y="18" width="30" height="12" rx="2" fill="#1a1a1a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="9" y="18" width="30" height="12" rx="2" fill="#3a3a3a"/>
    <rect x="9" y="10" width="30" height="10" rx="2" fill="#0a0a0a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="9" y="10" width="30" height="10" rx="2" fill="#2a2a2a"/>
    <line x1="9" y1="28" x2="39" y2="28" stroke="#1a1a1a" strokeWidth="1.5"/>
    <line x1="9" y1="18" x2="39" y2="18" stroke="#1a1a1a" strokeWidth="1.5"/>
    <ellipse cx="24" cy="10" rx="8" ry="2" fill="#3a3a3a" opacity="0.6"/>
    <rect x="20" y="13" width="8" height="4" rx="1" fill="#5a5a5a" opacity="0.6"/>
    <rect x="20" y="21" width="8" height="5" rx="1" fill="#5a5a5a" opacity="0.6"/>
    <rect x="20" y="31" width="8" height="6" rx="1" fill="#5a5a5a" opacity="0.6"/>
  </svg>
)

export const ApronSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="13" ry="3" fill="#00000050"/>
    <path d="M16 14 L12 44 Q24 46 36 44 L32 14 Q24 12 16 14Z" fill="#0a0a12" stroke="#1a1a2e" strokeWidth="1.5"/>
    <path d="M17 15 L13 43 Q24 45 35 43 L31 15 Q24 13 17 15Z" fill="#1a1a25"/>
    <rect x="18" y="24" width="12" height="8" rx="1" fill="#2a2a38" stroke="#1a1a2e" strokeWidth="0.8"/>
    <path d="M14 14 Q24 10 34 14 L32 18 Q24 16 16 18Z" fill="#1a1a25" stroke="#1a1a2e" strokeWidth="1"/>
    <path d="M16 14 Q14 12 10 14 L8 20 Q10 18 16 18Z" fill="#0a0a12" stroke="#1a1a2e" strokeWidth="1"/>
    <path d="M32 14 Q34 12 38 14 L40 20 Q38 18 32 18Z" fill="#0a0a12" stroke="#1a1a2e" strokeWidth="1"/>
    <line x1="18" y1="22" x2="30" y2="22" stroke="#2a2a38" strokeWidth="1"/>
    <rect x="21" y="26" width="6" height="4" rx="0.5" fill="#3a3a50"/>
  </svg>
)

export const TowelSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="13" ry="3" fill="#00000050"/>
    <rect x="10" y="14" width="28" height="28" rx="2" fill="#1a3a2a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <rect x="10" y="14" width="28" height="28" rx="2" fill="#2a5a3a"/>
    <line x1="10" y1="20" x2="38" y2="20" stroke="#1a4a2a" strokeWidth="2"/>
    <line x1="10" y1="26" x2="38" y2="26" stroke="#1a4a2a" strokeWidth="2"/>
    <line x1="10" y1="32" x2="38" y2="32" stroke="#1a4a2a" strokeWidth="2"/>
    <line x1="10" y1="38" x2="38" y2="38" stroke="#1a4a2a" strokeWidth="2"/>
    <rect x="10" y="14" width="28" height="5" fill="white" opacity="0.15"/>
    <rect x="10" y="34" width="28" height="5" fill="white" opacity="0.15"/>
    <ellipse cx="20" cy="18" rx="5" ry="2" fill="#4a8a5a" opacity="0.3"/>
  </svg>
)

export const TableclothSprite = ({size=44}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="44" rx="16" ry="3" fill="#00000050"/>
    <path d="M6 16 Q8 12 12 14 Q24 10 36 14 Q40 12 42 16 L40 36 Q38 42 24 42 Q10 42 8 36Z" fill="#3a1a3a" stroke="#1a1a2e" strokeWidth="1.5"/>
    <path d="M7 17 Q9 13 12 15 Q24 11 36 15 Q39 13 41 17 L39 36 Q37 41 24 41 Q11 41 9 36Z" fill="#6a2a6a"/>
    <line x1="12" y1="16" x2="10" y2="38" stroke="#4a1a4a" strokeWidth="1" opacity="0.6"/>
    <line x1="24" y1="12" x2="24" y2="40" stroke="#4a1a4a" strokeWidth="1" opacity="0.6"/>
    <line x1="36" y1="16" x2="38" y2="38" stroke="#4a1a4a" strokeWidth="1" opacity="0.6"/>
    <path d="M12 20 Q24 16 36 20" stroke="#8a4a8a" strokeWidth="1" fill="none" opacity="0.6"/>
    <path d="M10 30 Q24 26 38 30" stroke="#8a4a8a" strokeWidth="1" fill="none" opacity="0.6"/>
    <ellipse cx="20" cy="18" rx="5" ry="2" fill="#9a5a9a" opacity="0.3"/>
  </svg>
)

export const TruckSVG = () => (
  <svg width="200" height="100" viewBox="0 0 200 100" className="intro-truck">
    <rect x="20" y="30" width="120" height="55" rx="4" fill="#2a1f0e" stroke="#1a1a2e" strokeWidth="2"/>
    <rect x="20" y="30" width="120" height="55" rx="4" fill="#3d2e18"/>
    <rect x="130" y="20" width="55" height="65" rx="4" fill="#2a1f0e" stroke="#1a1a2e" strokeWidth="2"/>
    <rect x="132" y="22" width="51" height="61" rx="3" fill="#3a2e1a"/>
    <rect x="142" y="26" width="38" height="28" rx="3" fill="#1a3a5a" stroke="#1a1a2e" strokeWidth="1"/>
    <rect x="144" y="28" width="34" height="24" rx="2" fill="#2a5a8a" opacity="0.8"/>
    <ellipse cx="150" cy="34" rx="8" ry="6" fill="#3a7aaa" opacity="0.5"/>
    <rect x="180" y="44" width="14" height="30" rx="2" fill="#1a1a1a" stroke="#1a1a2e" strokeWidth="1"/>
    <line x1="180" y1="50" x2="194" y2="50" stroke="#3a3a3a" strokeWidth="1.5"/>
    <line x1="180" y1="56" x2="194" y2="56" stroke="#3a3a3a" strokeWidth="1.5"/>
    <line x1="180" y1="62" x2="194" y2="62" stroke="#3a3a3a" strokeWidth="1.5"/>
    <line x1="180" y1="68" x2="194" y2="68" stroke="#3a3a3a" strokeWidth="1.5"/>
    <ellipse cx="188" cy="40" rx="6" ry="4" fill="#ffffaa" stroke="#aa9900" strokeWidth="1"/>
    <ellipse cx="188" cy="40" rx="4" ry="2.5" fill="white" opacity="0.8"/>
    <rect x="20" y="52" width="120" height="4" fill="#ff9a3c" opacity="0.6"/>
    <text x="78" y="62" textAnchor="middle" fontSize="7" fill="#ff9a3c" fontFamily="monospace" fontWeight="bold" opacity="0.8">THE DELIVERY CO.</text>
    <rect x="21" y="31" width="6" height="53" rx="2" fill="#2a2218" stroke="#1a1a2e" strokeWidth="1"/>
    <rect x="23" y="50" width="2" height="16" rx="1" fill="#4a3828"/>
    <circle cx="55" cy="88" r="12" fill="#1a1a20" stroke="#1a1a2e" strokeWidth="2"/>
    <circle cx="55" cy="88" r="9" fill="#2a2a30"/>
    <circle cx="55" cy="88" r="5" fill="#3a3a40"/>
    <circle cx="55" cy="88" r="2" fill="#6a6a70"/>
    <circle cx="155" cy="88" r="12" fill="#1a1a20" stroke="#1a1a2e" strokeWidth="2"/>
    <circle cx="155" cy="88" r="9" fill="#2a2a30"/>
    <circle cx="155" cy="88" r="5" fill="#3a3a40"/>
    <circle cx="155" cy="88" r="2" fill="#6a6a70"/>
    <rect x="40" y="82" width="125" height="6" rx="2" fill="#1a1510" stroke="#1a1a2e" strokeWidth="1"/>
    <rect x="18" y="42" width="4" height="12" rx="2" fill="#1a1a20" stroke="#1a1a2e" strokeWidth="1"/>
    <ellipse cx="20" cy="42" rx="4" ry="3" fill="#2a2a30" opacity="0.6"/>
  </svg>
)
