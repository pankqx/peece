// THREE-CARD SHOWDOWN (docs/02 §5) in "Deuce Supreme" order: 3 4 5 6 7 8 9 10 J Q K A 2.
import { rankOf, suitOf, suitStrength } from '../cards.js';

export const HAND_SIZE = 3;
export const CATS = ['High card', 'Pair', 'Straight', 'Flush', 'Straight flush', 'Triple'];
const C = { HIGH: 0, PAIR: 1, STRAIGHT: 2, FLUSH: 3, SF: 4, TRIPLE: 5 };

/** Position in Deuce Supreme order: "3" → 0 … "A" → 11, "2" → 12. */
export const pos = (card) => (rankOf(card) === 0 ? 12 : rankOf(card) - 1);

export function evaluate(cards) {
  const cs = [...cards].sort((x, y) => pos(y) - pos(x) || suitStrength(suitOf(y)) - suitStrength(suitOf(x)));
  const p = cs.map(pos);
  const flush = suitOf(cs[0]) === suitOf(cs[1]) && suitOf(cs[1]) === suitOf(cs[2]);
  const straight = p[0] - 1 === p[1] && p[1] - 1 === p[2];
  let cat;
  let keys = p;
  if (p[0] === p[1] && p[1] === p[2]) cat = C.TRIPLE;
  else if (straight && flush) cat = C.SF;
  else if (flush) cat = C.FLUSH;
  else if (straight) cat = C.STRAIGHT;
  else if (p[0] === p[1] || p[1] === p[2]) {
    cat = C.PAIR;
    const pairPos = p[1];
    const kicker = p[0] === p[1] ? p[2] : p[0];
    keys = [pairPos, kicker];
  } else cat = C.HIGH;
  return { cat, name: CATS[cat], keys, topSuit: suitStrength(suitOf(cs[0])), sorted: cs };
}

/** 1 = a wins, -1 = b wins, 0 = mirrored tie. */
export function compareShowdown(a, b) {
  if (a.cat !== b.cat) return a.cat > b.cat ? 1 : -1;
  for (let i = 0; i < a.keys.length; i++) if (a.keys[i] !== b.keys[i]) return a.keys[i] > b.keys[i] ? 1 : -1;
  if (a.topSuit !== b.topSuit) return a.topSuit > b.topSuit ? 1 : -1;
  return 0;
}

/**
 * Resolve the simultaneous choices. Returns one of:
 *  { kind: 'showdown', mult }                    — compare hands at mult × stake
 *  { kind: 'answer', who }                       — `who` held against a raise and must Call/Fold
 *  { kind: 'fold', folder }                      — folder loses the base stake
 *  { kind: 'tie' }                               — both folded: refund
 * a / b are 'hold' | 'raise' | 'fold'. `who`/`folder` are 'a' or 'b'.
 */
export function resolveDecisions(a, b) {
  if (a === 'fold' && b === 'fold') return { kind: 'tie' };
  if (a === 'fold') return { kind: 'fold', folder: 'a' };
  if (b === 'fold') return { kind: 'fold', folder: 'b' };
  if (a === 'raise' && b === 'raise') return { kind: 'showdown', mult: 2 };
  if (a === 'raise') return { kind: 'answer', who: 'b' };
  if (b === 'raise') return { kind: 'answer', who: 'a' };
  return { kind: 'showdown', mult: 1 };
}
