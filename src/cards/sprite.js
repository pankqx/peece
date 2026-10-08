// One hidden <svg> holds every shared definition (gradients, grain, patterns, suit glyphs)
// and a <symbol> per card face, generated on first use and reused through <use>.

/** Suit glyphs in a 100 × 100 box. Index = suit (0 ♠, 1 ♥, 2 ♦, 3 ♣). */
export const SUIT_PATHS = [
  // Spade: an inverted heart with a flared stem
  'M50 4C61 22 95 38 95 61C95 75 85 83 73 83C64 83 57 79 53.5 72C54.5 81 59 89 67 95H33C41 89 45.5 81 46.5 72C43 79 36 83 27 83C15 83 5 75 5 61C5 38 39 22 50 4Z',
  // Heart
  'M50 92C21 68 4 51 4 31C4 16 15 6 28.5 6C38.5 6 46 12 50 21C54 12 61.5 6 71.5 6C85 6 96 16 96 31C96 51 79 68 50 92Z',
  // Diamond with gently curved sides
  'M50 3C59 21 73 37 91 50C73 63 59 79 50 97C41 79 27 63 9 50C27 37 41 21 50 3Z',
  // Club: three lobes, a knot and a flared stem (all sub-paths wound the same way)
  'M31 30a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM9 58a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM53 58a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM38 46L50 68L62 46ZM46 62C46 78 41 88 32 95H68C59 88 54 78 54 62Z',
];

const DEFS = /* svg */ `
<defs>
  <linearGradient id="goldA" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f6e3a3"/><stop offset=".35" stop-color="#d8b45a"/>
    <stop offset=".6" stop-color="#a8832f"/><stop offset="1" stop-color="#f1dc9a"/>
  </linearGradient>
  <linearGradient id="goldB" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fbeab0"/><stop offset=".5" stop-color="#c9a24a"/><stop offset="1" stop-color="#8a6a24"/>
  </linearGradient>
  <linearGradient id="goldC" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#8a6a24"/><stop offset=".5" stop-color="#f6e3a3"/><stop offset="1" stop-color="#8a6a24"/>
  </linearGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="#fdfaf1"/><stop offset=".55" stop-color="#f6efdc"/><stop offset="1" stop-color="#ece2c6"/>
  </linearGradient>
  <linearGradient id="inkG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2d2820"/><stop offset="1" stop-color="#0b0906"/>
  </linearGradient>
  <linearGradient id="rubyG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#cf3343"/><stop offset="1" stop-color="#7d1622"/>
  </linearGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#8d97a3"/><stop offset=".45" stop-color="#f4f6f8"/><stop offset="1" stop-color="#7c8692"/>
  </linearGradient>
  <linearGradient id="navyG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#172846"/><stop offset=".55" stop-color="#0f1c33"/><stop offset="1" stop-color="#070d18"/>
  </linearGradient>
  <radialGradient id="skin" cx=".45" cy=".4" r=".7">
    <stop offset="0" stop-color="#fbe3c8"/><stop offset=".8" stop-color="#e9c29c"/><stop offset="1" stop-color="#d9ab80"/>
  </radialGradient>
  <radialGradient id="aceGlow" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#f6e3a3" stop-opacity=".55"/><stop offset="1" stop-color="#f6e3a3" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="pearl" cx=".35" cy=".3" r=".8">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#efe6d2"/><stop offset="1" stop-color="#bdb19a"/>
  </radialGradient>
  <filter id="grainF" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 .35  0 0 0 0 .28  0 0 0 0 .18  0 0 0 .55 0"/>
  </filter>
  <pattern id="grain" width="140" height="140" patternUnits="userSpaceOnUse">
    <rect width="140" height="140" filter="url(#grainF)" opacity=".5"/>
  </pattern>
  <pattern id="lattice" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <path d="M0 0H14M0 0V14" stroke="#c9a24a" stroke-width=".5" opacity=".35" fill="none"/>
    <circle cx="7" cy="7" r=".9" fill="#c9a24a" opacity=".45"/>
  </pattern>
  <pattern id="backLattice" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45 125 175)">
    <rect width="22" height="22" fill="none" stroke="#c9a24a" stroke-width=".7" opacity=".55"/>
    <rect x="7" y="7" width="8" height="8" fill="none" stroke="#e2c36b" stroke-width=".6" opacity=".7"/>
    <circle cx="0" cy="0" r="2.2" fill="#e2c36b" opacity=".75"/>
    <circle cx="11" cy="11" r="1.1" fill="#f1dc9a" opacity=".6"/>
  </pattern>
  <clipPath id="courtHalf"><rect x="46" y="46" width="158" height="129"/></clipPath>
  <clipPath id="cardClip"><rect width="250" height="350" rx="14"/></clipPath>
  <path id="aceRingPath" d="M125 175m-61 0a61 61 0 1 1 122 0a61 61 0 1 1-122 0"/>
  ${SUIT_PATHS.map((d, i) => `<symbol id="suit-${i}" viewBox="0 0 100 100"><path d="${d}"/></symbol>`).join('')}
</defs>`;

let sprite = null;

/** Make sure the shared sprite exists in the document; returns it. */
export function ensureSprite() {
  if (sprite && document.body.contains(sprite)) return sprite;
  sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sprite.setAttribute('id', 'peece-sprite');
  sprite.setAttribute('aria-hidden', 'true');
  sprite.setAttribute('width', '0');
  sprite.setAttribute('height', '0');
  sprite.style.position = 'absolute';
  sprite.style.width = '0';
  sprite.style.height = '0';
  sprite.style.overflow = 'hidden';
  sprite.innerHTML = DEFS; // developer-authored, static markup
  document.body.prepend(sprite);
  return sprite;
}

/** Add a <symbol> once (key = element id). `build` returns its inner markup. */
export function ensureSymbol(id, build, viewBox = '0 0 250 350') {
  const s = ensureSprite();
  if (s.querySelector(`#${id}`)) return id;
  const defs = s.querySelector('defs');
  const tpl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tpl.innerHTML = `<symbol id="${id}" viewBox="${viewBox}">${build()}</symbol>`;
  defs.append(tpl.firstChild);
  return id;
}

/** Inline suit glyph markup for use inside our own SVG strings. */
export function suitUse(suit, x, y, size, opts = {}) {
  const fill = opts.fill ?? (suit === 1 || suit === 2 ? 'url(#rubyG)' : 'url(#inkG)');
  const rot = opts.rotate ? ` transform="rotate(180 ${x + size / 2} ${y + size / 2})"` : '';
  const stroke = opts.stroke ? ` stroke="${opts.stroke}" stroke-width="${opts.strokeWidth ?? 1.2}"` : '';
  return `<use href="#suit-${suit}" x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"${stroke}${rot}/>`;
}

/** A standalone small suit icon as an SVG string (for buttons and labels). */
export function suitIcon(suit, cls = 'suit-ico') {
  ensureSprite();
  const color = suit === 1 || suit === 2 ? 'var(--ruby-bright)' : 'currentColor';
  return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><use href="#suit-${suit}" fill="${color}"/></svg>`;
}
