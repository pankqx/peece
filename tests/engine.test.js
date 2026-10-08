import { describe, it, expect } from 'vitest';
import { randInt, shuffle } from '../src/engine/rng.js';
import { parseCard as c, freshDeck } from '../src/engine/cards.js';
import { Bank, lockBets, settle, addEscrow } from '../src/engine/bank.js';
import { comparePower, resolveOmen, power } from '../src/engine/games/omen.js';
import { evaluate as vEval, compareVingt } from '../src/engine/games/vingt.js';
import { bandOf, resolveThrone, claimTrue } from '../src/engine/games/throne.js';
import { evaluate as sEval, compareShowdown, resolveDecisions } from '../src/engine/games/showdown.js';
import { sealShoe, verifySeal, sealText } from '../src/engine/seal.js';
import { throneAnswer } from '../src/engine/rivals.js';

const hand = (...xs) => xs.map(c);

describe('rng', () => {
  it('randInt stays in range and is roughly uniform', () => {
    const counts = new Array(6).fill(0);
    for (let i = 0; i < 60000; i++) counts[randInt(6)]++;
    for (const n of counts) expect(Math.abs(n - 10000)).toBeLessThan(600);
  });
  it('shuffle is a permutation', () => {
    const d = shuffle(freshDeck());
    expect([...d].sort((a, b) => a - b)).toEqual(freshDeck());
  });
});

describe('bank — money flow (docs/07 M-01..M-06)', () => {
  const setup = () => {
    const bank = new Bank();
    bank.open('A');
    bank.open('B');
    return bank;
  };

  it('M-02/M-03: worked example from docs/02 §1.3', () => {
    const bank = setup();
    const round = { id: 1 };
    const stake = lockBets(bank, round, 'A', 'B', 300, 120);
    expect(stake).toBe(120);
    expect(bank.bal('A')).toBe(880);
    expect(bank.bal('B')).toBe(880);
    expect(bank.bal('escrow')).toBe(240);
    const r = settle(bank, round, 'A', round.stake);
    expect(r.rake).toBe(6);
    expect(bank.bal('A')).toBe(1114);
    expect(bank.bal('B')).toBe(880);
    expect(bank.bal('treasury')).toBe(6);
    expect(bank.bal('escrow')).toBe(0);
    expect(bank.reconcile().ok).toBe(true);
  });

  it('M-04: tie refunds both stakes with no rake', () => {
    const bank = setup();
    const round = { id: 2 };
    lockBets(bank, round, 'A', 'B', 50, 50);
    settle(bank, round, null);
    expect(bank.bal('A')).toBe(1000);
    expect(bank.bal('B')).toBe(1000);
    expect(bank.bal('treasury')).toBe(0);
  });

  it('M-06: settlement is idempotent', () => {
    const bank = setup();
    const round = { id: 3 };
    lockBets(bank, round, 'A', 'B', 100, 100);
    settle(bank, round, 'B', 100);
    settle(bank, round, 'B', 100);
    settle(bank, round, 'A', 100);
    expect(bank.bal('B')).toBe(1095);
    expect(bank.reconcile().ok).toBe(true);
  });

  it('M-07: rejects bad bets', () => {
    const bank = setup();
    for (const bad of [0, -5, 1.5, null, 5000]) {
      expect(() => lockBets(bank, { id: 9 }, 'A', 'B', bad, 10)).toThrow();
    }
    expect(bank.bal('A')).toBe(1000);
  });

  it('partial profit (Throne believe) and raise escrow keep the books balanced', () => {
    const bank = setup();
    const round = { id: 4 };
    lockBets(bank, round, 'A', 'B', 200, 200);
    addEscrow(bank, round, 'A', 200);
    addEscrow(bank, round, 'B', 200);
    settle(bank, round, 'B', 400);
    expect(bank.bal('A')).toBe(600);
    expect(bank.bal('B')).toBe(1380);
    expect(bank.bal('treasury')).toBe(20);
    expect(bank.reconcile().ok).toBe(true);
  });

  it('M-01: thousands of random rounds conserve every token', () => {
    const bank = setup();
    for (let i = 0; i < 2000; i++) {
      if (bank.bal('A') < 1 || bank.bal('B') < 1) break;
      const round = { id: 100 + i };
      lockBets(bank, round, 'A', 'B', 1 + randInt(bank.bal('A')), 1 + randInt(bank.bal('B')));
      const w = [null, 'A', 'B'][randInt(3)];
      settle(bank, round, w, randInt(round.stake + 1));
    }
    expect(bank.reconcile().ok).toBe(true);
    expect(bank.bal('escrow')).toBe(0);
  });
});

describe('The Omen', () => {
  it('G-05: a 2 slays an Ace', () => {
    expect(resolveOmen(c('2♣'), null, c('A♠'), null, 0).cmp).toBe(1);
  });
  it('G-06: equal rank breaks on suit ♠ > ♥ > ♦ > ♣', () => {
    expect(resolveOmen(c('9♠'), null, c('9♥'), null, 2).cmp).toBe(1);
    expect(resolveOmen(c('9♦'), null, c('9♥'), null, 2).cmp).toBe(-1);
    expect(resolveOmen(c('9♣'), null, c('9♦'), null, 2).cmp).toBe(-1);
  });
  it('G-04: right call +1, wrong call −1, clamped at 2 and A', () => {
    expect(power(c('7♠'), 1, 1)).toBe(power(c('8♠'), null, 1));
    expect(power(c('7♠'), 2, 1)).toBe(power(c('6♠'), null, 1));
    expect(power(c('A♠'), 3, 3)).toBe(12);
    expect(power(c('2♠'), 0, 1)).toBe(0);
  });
  it('equal power and equal suit is a tie', () => {
    // 7♠ with a right call (→ 8) vs 8♠ uncalled: same power, same suit.
    expect(resolveOmen(c('7♠'), 3, c('8♠'), null, 3).cmp).toBe(0);
  });
  it('a right-called King becomes an Ace — and then falls to a Deuce', () => {
    expect(comparePower(power(c('K♥'), 1, 1), 1, power(c('2♣'), null, 1), 3)).toBe(-1);
  });
  it('seat symmetry: random rounds split 50/50 (docs/02 §8)', () => {
    let a = 0;
    let b = 0;
    for (let i = 0; i < 40000; i++) {
      const d = shuffle(freshDeck());
      const omen = randInt(4);
      const call = () => (randInt(2) ? randInt(4) : null);
      const r = resolveOmen(d[0], call(), d[1], call(), omen).cmp;
      if (r > 0) a++;
      else if (r < 0) b++;
    }
    expect(Math.abs(a / (a + b) - 0.5)).toBeLessThan(0.012);
  });
});

describe('Vingt Duel', () => {
  it('G-13: a Lucky Ace is worth 2 or 12', () => {
    expect(vEval(hand('A♥', '9♣'), 1).total).toBe(21);
    expect(vEval(hand('A♥', 'K♣', '9♣'), 1).total).toBe(21);
    expect(vEval(hand('A♥', 'K♣', 'K♦'), 1).bust).toBe(true);
    expect(vEval(hand('A♥', '5♣', '5♦'), 1).total).toBe(12);
    expect(vEval(hand('A♥', '4♣', '5♦'), 1).total).toBe(21);
  });
  it('lucky cards add +1', () => {
    expect(vEval(hand('10♠', '9♠'), 0).total).toBe(21);
    expect(vEval(hand('10♠', '9♠'), 0).natural).toBe(true);
  });
  it('natural beats a Five-Card Charlie; Charlie beats a plain 21', () => {
    const natural = vEval(hand('A♠', 'K♠'), 2);
    const charlie = vEval(hand('2♠', '3♠', '2♥', '3♥', '4♣'), 2);
    const twentyOne = vEval(hand('7♠', '7♥', '7♣'), 2);
    expect(charlie.charlie).toBe(true);
    expect(compareVingt(natural, charlie)).toBe(1);
    expect(compareVingt(charlie, twentyOne)).toBe(1);
  });
  it('equal totals: fewer cards wins; both bust ties', () => {
    expect(compareVingt(vEval(hand('10♠', '8♠'), 1), vEval(hand('5♠', '5♣', '8♣'), 1))).toBe(1);
    expect(compareVingt(vEval(hand('10♠', '8♠', '9♣'), 1), vEval(hand('10♦', '10♣', '5♣'), 1))).toBe(0);
    expect(compareVingt(vEval(hand('10♠', '8♠', '9♣'), 1), vEval(hand('2♦'), 1))).toBe(-1);
  });
});

describe("Liar's Throne", () => {
  it('bands: every 2 counts as ACE', () => {
    expect(bandOf(c('2♠'))).toBe(3);
    expect(bandOf(c('A♣'))).toBe(3);
    expect(bandOf(c('6♦'))).toBe(0);
    expect(bandOf(c('7♦'))).toBe(1);
    expect(bandOf(c('10♦'))).toBe(1);
    expect(bandOf(c('J♦'))).toBe(2);
  });
  it('G-14: believe pays the band share; call pays the full stake', () => {
    expect(resolveThrone(c('3♠'), 2, 'believe', 100)).toMatchObject({ throneWins: true, profit: 50 });
    expect(resolveThrone(c('3♠'), 2, 'call', 100)).toMatchObject({ throneWins: false, profit: 100, truthful: false });
    expect(resolveThrone(c('K♠'), 1, 'call', 100)).toMatchObject({ throneWins: true, profit: 100, truthful: true });
    expect(claimTrue(c('2♥'), 3)).toBe(true);
  });
  it('the House believes a LOW claim and calls a known liar', () => {
    const rival = { skeptic: 0 };
    let calls = 0;
    for (let i = 0; i < 200; i++) if (throneAnswer(rival, 0) === 'call') calls++;
    expect(calls).toBeLessThan(10);
    let liarCalls = 0;
    for (let i = 0; i < 200; i++) if (throneAnswer(rival, 3, { calls: 10, lies: 8 }) === 'call') liarCalls++;
    expect(liarCalls).toBeGreaterThan(190);
  });
});

describe('Three-Card Showdown (docs/07 §5)', () => {
  const win = (a, b) => compareShowdown(sEval(hand(...a)), sEval(hand(...b)));
  it('triple beats a pair', () => expect(win(['7♠', '7♥', '7♦'], ['K♠', 'K♥', 'A♣'])).toBe(1));
  it('triple beats a straight flush', () => expect(win(['5♥', '6♥', '7♥'], ['9♠', '9♥', '9♦'])).toBe(-1));
  it('K-A-2 straight flush beats Q-K-A', () => expect(win(['K♣', 'A♣', '2♣'], ['Q♠', 'K♠', 'A♠'])).toBe(1));
  it('a high 2 beats a high Ace', () => expect(win(['A♠', 'K♦', '4♣'], ['2♥', '9♦', '8♣'])).toBe(-1));
  it('no wraparound: A-2-3 is not a straight', () => expect(sEval(hand('A♠', '2♦', '3♣')).name).toBe('High card'));
  it('pair compares pair rank before kicker', () => expect(win(['9♠', '9♥', '3♦'], ['8♠', '8♥', 'A♦'])).toBe(1));
  it('mirrored hands break on top-card suit or tie', () => {
    expect(win(['9♠', '7♥', '3♦'], ['9♥', '7♠', '3♣'])).toBe(1);
  });
  it('decision matrix', () => {
    expect(resolveDecisions('hold', 'hold')).toEqual({ kind: 'showdown', mult: 1 });
    expect(resolveDecisions('raise', 'raise')).toEqual({ kind: 'showdown', mult: 2 });
    expect(resolveDecisions('raise', 'hold')).toEqual({ kind: 'answer', who: 'b' });
    expect(resolveDecisions('hold', 'fold')).toEqual({ kind: 'fold', folder: 'b' });
    expect(resolveDecisions('fold', 'fold')).toEqual({ kind: 'tie' });
  });
  it('pair-or-better lands around 25–30% (docs/02 §8)', () => {
    let good = 0;
    const N = 30000;
    for (let i = 0; i < N; i++) if (sEval(shuffle(freshDeck()).slice(0, 3)).cat >= 1) good++;
    const f = good / N;
    expect(f).toBeGreaterThan(0.2);
    expect(f).toBeLessThan(0.32);
  });
});

describe('Sealed shoe (commit–reveal)', () => {
  it('S-12: the revealed text re-hashes to the commit, and tampering is detected', async () => {
    const s = await sealShoe('omen');
    expect(s.omen).toBeGreaterThanOrEqual(0);
    expect(await verifySeal(s.text, s.commit)).toBe(true);
    const swapped = sealText('omen', s.deck, (s.omen + 1) % 4, s.nonce);
    expect(await verifySeal(swapped, s.commit)).toBe(false);
  });
});
