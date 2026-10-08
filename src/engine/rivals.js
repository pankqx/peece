// The House's three rivals. Each only ever sees what a real opponent would see:
// its own cards, public information and the outcomes of past rounds.
import { randFloat, randInt, chance, shuffle } from './rng.js';
import { freshDeck, rankOf } from './cards.js';
import { rawStrength } from './games/omen.js';
import { evaluate as vEval } from './games/vingt.js';
import { bandOf, BELIEVE_PCT } from './games/throne.js';
import { evaluate as sEval, compareShowdown } from './games/showdown.js';

export const RIVALS = {
  marquis: {
    id: 'marquis',
    name: 'Marquis Noir',
    title: 'The Calculator',
    blurb: 'Counts every card, bets like a banker, almost never bluffs.',
    difficulty: 2,
    risk: 0.32,
    bluff: 0.08,
    omenCall: 0.06,
    standAt: 17,
    skeptic: 0.0,
    palette: { robe: '#0f1c33', trim: '#c9a24a', accent: '#e2c36b' },
  },
  countess: {
    id: 'countess',
    name: 'Countess Rouge',
    title: 'The High Roller',
    blurb: 'Big bets, bigger nerve. Hits on seventeen and laughs about it.',
    difficulty: 3,
    risk: 0.7,
    bluff: 0.28,
    omenCall: 0.22,
    standAt: 18,
    skeptic: 0.08,
    palette: { robe: '#5a0f1a', trim: '#e2c36b', accent: '#d23a49' },
  },
  jester: {
    id: 'jester',
    name: 'The Jester',
    title: 'The Trickster',
    blurb: 'Bluffs for sport, calls the Omen on a whim. Unreadable, sometimes foolish.',
    difficulty: 1,
    risk: 0.5,
    bluff: 0.5,
    omenCall: 0.55,
    standAt: 16,
    skeptic: 0.18,
    palette: { robe: '#0b4a37', trim: '#f1dc9a', accent: '#14805c' },
  },
};

export const rivalAcct = (id) => `rival:${id}`;

const roundTo = (n, step) => Math.max(1, Math.round(n / step) * step);

/** Blind bet sizing: a share of the rival's balance shaped by temperament. */
export function rivalBet(rival, balance) {
  if (balance <= 0) return 0;
  const swing = 0.08 + randFloat() * 0.32; // 8%–40% of the risk budget
  let bet = balance * rival.risk * swing;
  if (chance(rival.risk * 0.08)) bet = balance * (0.5 + randFloat() * 0.5); // the occasional shove
  return Math.min(balance, roundTo(bet, bet > 100 ? 10 : 5));
}

/* ---------------- The Omen ---------------- */
export function omenDecide(rival, hand) {
  const scored = hand.map((c, i) => ({ i, s: rawStrength(c) })).sort((a, b) => b.s - a.s);
  // The Jester sometimes plays a middling card just to be unpredictable.
  const choice = rival.id === 'jester' && chance(0.3) ? scored[randInt(Math.min(3, scored.length))] : scored[0];
  const call = chance(rival.omenCall) ? randInt(4) : null;
  return { index: choice.i, call };
}

/* ---------------- Vingt Duel ---------------- */
export function vingtWantsHit(rival, cards, lucky) {
  const e = vEval(cards, lucky);
  if (e.bust || cards.length >= 5) return false;
  if (e.total < rival.standAt) return true;
  // Four cards and a modest total: chase the Five-Card Charlie sometimes.
  if (cards.length === 4 && e.total <= 15) return chance(0.5 + rival.risk * 0.3);
  return false;
}

/* ---------------- Liar's Throne ---------------- */
/** As the Throne: play the highest-band card and sometimes over-claim by one band. */
export function throneClaim(rival, hand) {
  const scored = hand.map((c, i) => ({ i, band: bandOf(c), r: rankOf(c) })).sort((a, b) => b.band - a.band || b.r - a.r);
  const best = scored[0];
  let claim = best.band;
  if (best.band < 3 && chance(rival.bluff)) claim = best.band + 1;
  // Occasional sandbag: a modest claim on a strong card to bait a call.
  else if (best.band > 0 && chance(rival.bluff * 0.25)) claim = best.band - 1;
  return { index: best.i, claim };
}

/**
 * As the challenger: estimate how likely the claim is true, adjusted by how often this
 * player has been caught lying before (`tells` = { calls, lies }), then compare EVs:
 * believe costs pct × stake; calling wins stake when the claim is false, loses it when true.
 */
export function throneAnswer(rival, claim, tells = { calls: 0, lies: 0 }) {
  const prior = [0.97, 0.8, 0.52, 0.3][claim];
  const observed = tells.calls >= 2 ? tells.lies / tells.calls : null;
  let pTrue = observed == null ? prior : prior * (1 - Math.min(0.6, observed));
  pTrue = Math.min(0.99, Math.max(0.01, pTrue - rival.skeptic + (randFloat() - 0.5) * 0.12));
  const pct = BELIEVE_PCT[claim];
  const evCall = (1 - pTrue) - pTrue; // in units of stake
  const evBelieve = -pct;
  return evCall > evBelieve ? 'call' : 'believe';
}

/* ---------------- Three-Card Showdown ---------------- */
/** Monte-Carlo win probability of a 3-card hand against a random opponent hand. */
export function showdownWinProb(hand, samples = 260) {
  const mine = sEval(hand);
  const rest = freshDeck().filter((c) => !hand.includes(c));
  let score = 0;
  for (let i = 0; i < samples; i++) {
    const d = shuffle(rest.slice());
    const cmp = compareShowdown(mine, sEval(d.slice(0, 3)));
    score += cmp > 0 ? 1 : cmp === 0 ? 0.5 : 0;
  }
  return score / samples;
}

export function showdownDecide(rival, hand, canRaise) {
  const p = showdownWinProb(hand);
  if (canRaise && (p > 0.78 - rival.risk * 0.12 || chance(rival.bluff * 0.18))) return { action: 'raise', p };
  if (p < 0.2 + rival.skeptic * 0.3 && !chance(rival.bluff * 0.5)) return { action: 'fold', p };
  return { action: 'hold', p };
}

export function showdownAnswer(rival, hand, canCall) {
  const p = showdownWinProb(hand);
  if (!canCall) return 'fold';
  return p > 0.5 - rival.risk * 0.15 || chance(rival.bluff * 0.15) ? 'call' : 'fold';
}
