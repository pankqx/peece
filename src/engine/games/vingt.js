// VINGT DUEL (docs/02 §3): head-to-head twenty-one with a Lucky suit (+1 per lucky card).
import { rankOf, suitOf } from '../cards.js';

export const MAX_CARDS = 5;

/** Base value: 2–10 face, J Q K = 10, Ace = 1 (soft 11 handled in total()). */
export function baseValue(card) {
  const r = rankOf(card);
  if (r === 12) return 1;
  if (r >= 8) return 10;
  return r + 2;
}

/** Best total ≤ 21 if possible. Lucky-suit cards are worth +1 (a Lucky Ace is 2 or 12). */
export function total(cards, lucky) {
  let sum = 0;
  let aces = 0;
  for (const c of cards) {
    sum += baseValue(c) + (suitOf(c) === lucky ? 1 : 0);
    if (rankOf(c) === 12) aces++;
  }
  // Promote one Ace by +10 if it does not bust.
  if (aces > 0 && sum + 10 <= 21) return { total: sum + 10, soft: true };
  return { total: sum, soft: false };
}

export function evaluate(cards, lucky) {
  const { total: t, soft } = total(cards, lucky);
  const bust = t > 21;
  return {
    total: t,
    soft,
    bust,
    count: cards.length,
    natural: cards.length === 2 && t === 21,
    charlie: cards.length === MAX_CARDS && !bust,
  };
}

/** 1 = a wins, -1 = b wins, 0 = tie. */
export function compareVingt(a, b) {
  if (a.bust && b.bust) return 0;
  if (a.bust) return -1;
  if (b.bust) return 1;
  if (a.natural !== b.natural) return a.natural ? 1 : -1;
  if (a.charlie !== b.charlie) return a.charlie ? 1 : -1;
  if (a.total !== b.total) return a.total > b.total ? 1 : -1;
  if (a.count !== b.count) return a.count < b.count ? 1 : -1;
  return 0;
}

export const canHit = (cards, lucky, stood) => !stood && cards.length < MAX_CARDS && !evaluate(cards, lucky).bust;
