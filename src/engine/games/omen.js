// THE OMEN (docs/02 §2): blind bet, 5 cards, optional hidden suit call, one card each.
import { rankOf, suitOf, suitStrength } from '../cards.js';

export const HAND_SIZE = 5;

/** Omen shift: right call +1 rank (max A), wrong call −1 (min 2), no call 0. */
export function shiftFor(call, omen) {
  if (call == null) return 0;
  return call === omen ? 1 : -1;
}

export function power(card, call, omen) {
  return Math.min(12, Math.max(0, rankOf(card) + shiftFor(call, omen)));
}

/**
 * Compare two single cards by power (rank index 0 = "2" … 12 = "A").
 * "Deuce slays Ace": a 2 beats an Ace. Equal power → higher suit; equal suit → tie.
 * Returns 1 if a wins, -1 if b wins, 0 for a tie.
 */
export function comparePower(pa, sa, pb, sb) {
  if (pa !== pb) {
    if (pa === 0 && pb === 12) return 1;
    if (pb === 0 && pa === 12) return -1;
    return pa > pb ? 1 : -1;
  }
  if (sa === sb) return 0;
  return suitStrength(sa) > suitStrength(sb) ? 1 : -1;
}

export function resolveOmen(cardA, callA, cardB, callB, omen) {
  const pa = power(cardA, callA, omen);
  const pb = power(cardB, callB, omen);
  const cmp = comparePower(pa, suitOf(cardA), pb, suitOf(cardB));
  return { cmp, powerA: pa, powerB: pb, shiftA: shiftFor(callA, omen), shiftB: shiftFor(callB, omen) };
}

/** How many of the other 51 cards this card beats with no shift (used by the House). */
export function rawStrength(card) {
  let wins = 0;
  for (let x = 0; x < 52; x++) {
    if (x === card) continue;
    if (comparePower(rankOf(card), suitOf(card), rankOf(x), suitOf(x)) > 0) wins++;
  }
  return wins / 51;
}
