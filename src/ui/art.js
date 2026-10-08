// Game emblems and rival portraits — developer-authored SVG strings.
import { SUIT_PATHS } from '../cards/sprite.js';
import { RIVALS } from '../engine/rivals.js';

const glyph = (i, x, y, s, fill) => `<path d="${SUIT_PATHS[i]}" transform="translate(${x} ${y}) scale(${s / 100})" fill="${fill}"/>`;

const GOLD = `<defs><linearGradient id="emG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a3"/><stop offset=".45" stop-color="#d8b45a"/><stop offset=".75" stop-color="#a8832f"/><stop offset="1" stop-color="#f1dc9a"/></linearGradient></defs>`;

export const EMBLEMS = {
  omen: `<svg viewBox="0 0 96 96" aria-hidden="true">${GOLD}
    <rect x="14" y="26" width="68" height="46" rx="4" fill="#fbf7ec" stroke="url(#emG)" stroke-width="2"/>
    <path d="M14 30l34 24 34-24" fill="none" stroke="#c9a24a" stroke-width="1.6"/>
    <path d="M14 72l26-20M82 72L56 52" stroke="#d9cfb3" stroke-width="1.2"/>
    <circle cx="48" cy="54" r="13" fill="#a3202e"/><circle cx="48" cy="54" r="13" fill="none" stroke="#7d1622" stroke-width="2.5" stroke-dasharray="3 2.2"/>
    ${glyph(0, 40.5, 46.5, 15, '#f1dc9a')}</svg>`,
  vingt: `<svg viewBox="0 0 96 96" aria-hidden="true">${GOLD}
    <rect x="18" y="20" width="36" height="52" rx="5" fill="#fbf7ec" stroke="url(#emG)" stroke-width="2" transform="rotate(-12 36 46)"/>
    <rect x="40" y="22" width="36" height="52" rx="5" fill="#fbf7ec" stroke="url(#emG)" stroke-width="2" transform="rotate(10 58 48)"/>
    <text x="58" y="58" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="24" fill="#a3202e" transform="rotate(10 58 48)">21</text>
    ${glyph(1, 22, 26, 12, '#a3202e')}</svg>`,
  throne: `<svg viewBox="0 0 96 96" aria-hidden="true">${GOLD}
    <path d="M30 14h36v40H30Z" fill="#5a0f1a" stroke="url(#emG)" stroke-width="2"/>
    <path d="M30 14l6-8 6 8 6-8 6 8 6-8 6 8" fill="url(#emG)"/>
    <path d="M24 54h48v8H24Z" fill="url(#emG)"/>
    <path d="M28 62v22M68 62v22M24 44h6v18h-6ZM66 44h6v18h-6Z" stroke="url(#emG)" stroke-width="3" fill="#8a6a24"/>
    ${glyph(0, 40, 24, 16, '#f1dc9a')}
    <path d="M38 48h20" stroke="#f1dc9a" stroke-width="1"/></svg>`,
  showdown: `<svg viewBox="0 0 96 96" aria-hidden="true">${GOLD}
    ${[-18, 0, 18]
      .map((r, i) => `<g transform="rotate(${r} 48 80)"><rect x="32" y="18" width="32" height="46" rx="4" fill="#fbf7ec" stroke="url(#emG)" stroke-width="1.8"/>${glyph([3, 1, 2][i], 39, 30, 18, i === 0 ? '#14110c' : '#a3202e')}</g>`)
      .join('')}
    <circle cx="48" cy="80" r="6" fill="url(#emG)"/></svg>`,
};

export const GAMES = {
  omen: {
    id: 'omen',
    name: 'The Omen',
    pitch: 'A sealed envelope hides a secret suit. Bet blind, call the Omen, play one card.',
    difficulty: 3,
    tag: 'Flagship',
  },
  vingt: {
    id: 'vingt',
    name: 'Vingt Duel',
    pitch: 'Head-to-head twenty-one with a Lucky suit. Every extra card is greed.',
    difficulty: 2,
    tag: 'Push your luck',
  },
  throne: {
    id: 'throne',
    name: "Liar's Throne",
    pitch: 'Sit on the Throne and claim a card band — or call the lie. Higher claims pay more.',
    difficulty: 3,
    tag: 'Bluff',
  },
  showdown: {
    id: 'showdown',
    name: 'Three-Card Showdown',
    pitch: 'Three cards, one decision. Hold, raise or fold — the Deuce is supreme.',
    difficulty: 2,
    tag: 'Poker-lite',
  },
};

/* ---------------- Rival portraits ---------------- */

function bust(p, face) {
  return `<path d="M14 100C16 80 30 70 50 68C70 70 84 80 86 100Z" fill="${p.robe}"/>
    <path d="M14 100C16 80 30 70 50 68C70 70 84 80 86 100" fill="none" stroke="${p.trim}" stroke-width="1.6"/>
    <rect x="44" y="56" width="12" height="14" fill="url(#rpSkin)"/>
    ${face}`;
}

const SKIN = `<radialGradient id="rpSkin" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#fbe3c8"/><stop offset=".8" stop-color="#e9c29c"/><stop offset="1" stop-color="#d9ab80"/></radialGradient>`;

function faceBase(cy = 46) {
  return `<ellipse cx="50" cy="${cy}" rx="13" ry="16" fill="url(#rpSkin)" stroke="#c99a70" stroke-width=".5"/>
    <ellipse cx="45" cy="${cy - 1}" rx="1.7" ry="1.2" fill="#1e1a14"/><ellipse cx="55" cy="${cy - 1}" rx="1.7" ry="1.2" fill="#1e1a14"/>
    <path d="M50 ${cy}v6l-2 1" stroke="#b0805a" stroke-width=".9" fill="none"/>`;
}

const PORTRAITS = {
  marquis: (p) =>
    bust(
      p,
      `<path d="M38 70l12 10 12-10-4-4H42Z" fill="#fbf7ec"/><path d="M47 72l3 8 3-8Z" fill="#a3202e"/>
      ${faceBase()}
      <path d="M41 42q4-2 8 0M51 42q4-2 8 0" stroke="#2f2216" stroke-width="1.2" fill="none"/>
      <circle cx="55" cy="45" r="4.2" fill="none" stroke="#e2c36b" stroke-width="1.2"/><path d="M59 46q4 8 2 18" stroke="#e2c36b" stroke-width=".6" fill="none"/>
      <path d="M43 55q7 4 14 0" stroke="#2f2216" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M33 33h34v3H33Z" fill="#0a1220"/><rect x="37" y="8" width="26" height="26" rx="2" fill="#0a1220"/>
      <rect x="37" y="27" width="26" height="4" fill="${p.trim}"/>`
    ),
  countess: (p) =>
    bust(
      p,
      `<path d="M34 46C30 26 40 18 50 18C60 18 70 26 66 46C72 60 70 72 64 78H36C30 72 28 60 34 46Z" fill="#7d1622"/>
      ${faceBase()}
      <path d="M46.5 53q3.5 2.4 7 0q-3.5-1-7 0Z" fill="#b3202e"/>
      <path d="M43.4 44.3l-1.4-1.2M56.6 44.3l1.4-1.2" stroke="#1e1a14" stroke-width=".8"/>
      <path d="M36 72q14 10 28 0" stroke="url(#rpPearl)" stroke-width="2.6" stroke-dasharray=".1 3.6" stroke-linecap="round" fill="none"/>
      <path d="M38 30L40 20L45 26L50 16L55 26L60 20L62 30Z" fill="${p.trim}" stroke="#8a6a24" stroke-width=".6"/>
      <circle cx="50" cy="23" r="2" fill="${p.accent}"/>
      <path d="M62 28C70 18 76 12 86 10C80 18 72 24 64 32Z" fill="#fbf7ec" opacity=".9"/>`
    ),
  jester: (p) =>
    bust(
      p,
      `<path d="M36 70h28l-4 8H40Z" fill="${p.trim}"/>${[38, 46, 54, 62].map((x) => `<path d="M${x} 70l4 7 4-7Z" fill="${p.accent}"/>`).join('')}
      ${faceBase(47)}
      <path d="M44 54q6 5 12 0" stroke="#a5524a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M43 41l4 2M57 41l-4 2" stroke="#1e1a14" stroke-width="1"/>
      <path d="M44 51l1.5 3M56 51l-1.5 3" stroke="#a3202e" stroke-width=".8"/>
      <path d="M34 36C34 24 42 20 50 20C58 20 66 24 66 36Z" fill="${p.robe}" stroke="${p.trim}" stroke-width="1"/>
      <path d="M36 32C26 26 18 14 14 4C24 10 34 18 44 22Z" fill="#a3202e"/>
      <path d="M64 32C74 26 82 14 86 4C76 10 66 18 56 22Z" fill="${p.accent}"/>
      <circle cx="14" cy="5" r="4" fill="${p.trim}"/><circle cx="86" cy="5" r="4" fill="${p.trim}"/>
      <path d="M34 36h32" stroke="${p.trim}" stroke-width="2"/>`
    ),
};

export function rivalPortrait(id, cls = 'portrait') {
  const r = RIVALS[id];
  const p = r.palette;
  return `<svg class="${cls}" viewBox="0 0 100 100" role="img" aria-label="${r.name}">
    <defs>${SKIN}<radialGradient id="rpBg-${id}" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="${p.accent}" stop-opacity=".55"/><stop offset="1" stop-color="#05080f"/></radialGradient>
    <radialGradient id="rpPearl"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#cfc3a2"/></radialGradient>
    <clipPath id="rpClip-${id}"><circle cx="50" cy="50" r="48"/></clipPath></defs>
    <circle cx="50" cy="50" r="48" fill="url(#rpBg-${id})"/>
    <g clip-path="url(#rpClip-${id})">${PORTRAITS[id](p)}</g>
    <circle cx="50" cy="50" r="48" fill="none" stroke="${p.trim}" stroke-width="2"/>
  </svg>`;
}
