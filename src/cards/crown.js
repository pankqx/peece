// The PEECE crown mark (docs/05 §1): three points formed by a spade, a heart jewel and a diamond.
import { SUIT_PATHS } from './sprite.js';

/** Crown markup in a 64 × 64 box. */
export function crownPath(fill = 'url(#goldA)', stroke = '#8a6a24') {
  const glyph = (i, x, y, s) =>
    `<path d="${SUIT_PATHS[i]}" transform="translate(${x} ${y}) scale(${s / 100})" fill="${fill}" stroke="${stroke}" stroke-width="${(0.8 * 100) / s}"/>`;
  return `<path d="M12 48L8 24L21 35L32 18L43 35L56 24L52 48Z" fill="${fill}" stroke="${stroke}" stroke-width=".8" stroke-linejoin="round"/>
    <rect x="11" y="48" width="42" height="7" rx="2" fill="${fill}" stroke="${stroke}" stroke-width=".8"/>
    <circle cx="22" cy="51.5" r="1.6" fill="${stroke}"/><circle cx="32" cy="51.5" r="1.9" fill="${stroke}"/><circle cx="42" cy="51.5" r="1.6" fill="${stroke}"/>
    ${glyph(0, 1.5, 11, 13)}${glyph(1, 25, 4, 14)}${glyph(2, 49.5, 11, 13)}`;
}

/** Standalone crown SVG string (logo mark, favicon, loader). */
export function crownSvg(cls = 'crown-mark', gradId = 'crownGrad') {
  return `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true">
    <defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6e3a3"/><stop offset=".4" stop-color="#d8b45a"/>
      <stop offset=".7" stop-color="#a8832f"/><stop offset="1" stop-color="#f1dc9a"/></linearGradient></defs>
    ${crownPath(`url(#${gradId})`)}</svg>`;
}
