// Classic pip layouts for 2–10 (docs/05 §4.2). Coordinates are fractions of the pip box;
// pips in the lower half are rotated 180°, exactly like a traditional deck.
import { suitUse } from './sprite.js';

const L = 0.18;
const M = 0.5;
const R = 0.82;
const T = 1 / 3;

export const PIP_LAYOUTS = {
  2: [[M, 0], [M, 1]],
  3: [[M, 0], [M, 0.5], [M, 1]],
  4: [[L, 0], [R, 0], [L, 1], [R, 1]],
  5: [[L, 0], [R, 0], [M, 0.5], [L, 1], [R, 1]],
  6: [[L, 0], [R, 0], [L, 0.5], [R, 0.5], [L, 1], [R, 1]],
  7: [[L, 0], [R, 0], [M, 0.25], [L, 0.5], [R, 0.5], [L, 1], [R, 1]],
  8: [[L, 0], [R, 0], [M, 0.25], [L, 0.5], [R, 0.5], [M, 0.75], [L, 1], [R, 1]],
  9: [[L, 0], [R, 0], [L, T], [R, T], [M, 0.5], [L, 2 * T], [R, 2 * T], [L, 1], [R, 1]],
  10: [[L, 0], [R, 0], [M, 1 / 6], [L, T], [R, T], [L, 2 * T], [R, 2 * T], [M, 5 / 6], [L, 1], [R, 1]],
};

// The box pips are centred in (card space 250 × 350).
const BOX = { x: 64, y: 70, w: 122, h: 210 };
const SIZE = 40;

/** Markup for the pip body of a number card (rank value 2–10). */
export function pipBody(value, suit) {
  const layout = PIP_LAYOUTS[value];
  const big = value <= 3 ? 46 : SIZE; // centre pips on small cards are slightly larger
  return layout
    .map(([fx, fy]) => {
      const size = fy === 0.5 && (value === 3 || value === 5 || value === 9) ? big + 4 : value <= 3 ? big : SIZE;
      const cx = BOX.x + fx * BOX.w;
      const cy = BOX.y + fy * BOX.h;
      return suitUse(suit, cx - size / 2, cy - size / 2, size, { rotate: fy > 0.5 });
    })
    .join('');
}
