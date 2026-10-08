// Double-entry token bank (docs/02 §1.3).
// Every movement is one ledger row from → to; balances only ever change inside move().
// Accounts: 'you', 'rival:<id>', 'escrow', 'treasury' (the admin wallet), and 'mint'
// (the only account allowed to go negative: it is where play-money is created).

export const RAKE = 0.05;
export const START_TOKENS = 1000;
export const LOCKOUT_MS = 7 * 24 * 60 * 60 * 1000;
const LEDGER_CAP = 600;

export class Bank {
  constructor(data) {
    this.balances = { mint: 0, escrow: 0, treasury: 0, ...(data?.balances || {}) };
    this.ledger = data?.ledger || [];
    this.seq = data?.seq || 0;
  }

  toJSON() {
    return { balances: this.balances, ledger: this.ledger, seq: this.seq };
  }

  bal(acct) {
    return this.balances[acct] || 0;
  }

  /** Move tokens. Throws rather than ever letting a real account go negative. */
  move(from, to, amount, kind, round = null, memo = '') {
    if (!Number.isInteger(amount) || amount < 0) throw new Error(`bad amount ${amount}`);
    if (amount === 0) return null;
    if (from === to) throw new Error('self move');
    if (from !== 'mint' && this.bal(from) < amount) throw new Error(`insufficient funds in ${from}`);
    this.balances[from] = this.bal(from) - amount;
    this.balances[to] = this.bal(to) + amount;
    const row = { id: ++this.seq, at: Date.now(), round, kind, from, to, amount, memo };
    this.ledger.push(row);
    if (this.ledger.length > LEDGER_CAP) this.ledger.splice(0, this.ledger.length - LEDGER_CAP);
    return row;
  }

  /** Create an account with starting play-money if it does not exist yet. */
  open(acct, amount = START_TOKENS) {
    if (acct in this.balances) return false;
    this.balances[acct] = 0;
    this.move('mint', acct, amount, 'mint', null, 'welcome tokens');
    return true;
  }

  /** Admin: set an account to an exact balance (difference is minted or burned). */
  setTo(acct, amount, memo = 'admin set') {
    const diff = amount - this.bal(acct);
    if (diff > 0) this.move('mint', acct, diff, 'admin', null, memo);
    if (diff < 0) this.move(acct, 'mint', -diff, 'admin', null, memo);
  }

  /** Reconciliation (FR-66): everything held must equal everything ever minted. */
  reconcile() {
    const minted = -this.bal('mint');
    const held = Object.entries(this.balances)
      .filter(([k]) => k !== 'mint')
      .reduce((s, [, v]) => s + v, 0);
    return { minted, held, ok: minted === held };
  }
}

/* ---------------- Round money flow ---------------- */

/**
 * Lock both blind bets into escrow, then fix the stake (decision D2):
 * stake = the lower bet; each player's excess is refunded the same instant.
 */
export function lockBets(bank, round, a, b, betA, betB) {
  for (const [acct, bet] of [
    [a, betA],
    [b, betB],
  ]) {
    if (!Number.isInteger(bet) || bet < 1) throw new Error('bet must be a whole number ≥ 1');
    if (bet > bank.bal(acct)) throw new Error('bet exceeds balance');
  }
  bank.move(a, 'escrow', betA, 'bet', round.id);
  bank.move(b, 'escrow', betB, 'bet', round.id);
  const stake = Math.min(betA, betB);
  if (betA > stake) bank.move('escrow', a, betA - stake, 'excess-refund', round.id);
  if (betB > stake) bank.move('escrow', b, betB - stake, 'excess-refund', round.id);
  round.stake = stake;
  round.bets = { [a]: betA, [b]: betB };
  round.escrow = { [a]: stake, [b]: stake };
  return stake;
}

/** Put extra tokens into escrow for one side (Showdown raise / call). */
export function addEscrow(bank, round, acct, amount) {
  bank.move(acct, 'escrow', amount, 'raise', round.id);
  round.escrow[acct] += amount;
}

/**
 * Settle a round. winner = account or null (tie / cancel → full refunds, no rake).
 * profit = what the winner takes from the loser (capped by the loser's escrow).
 * Rake (decision D11) = floor(5% of profit), paid to the treasury.
 * Idempotent: a settled round is never paid twice (docs/04 T5).
 */
export function settle(bank, round, winner, profit = 0) {
  if (round.settled) return round.result;
  const [a, b] = Object.keys(round.escrow);
  let result;
  if (!winner) {
    bank.move('escrow', a, round.escrow[a], 'refund', round.id);
    bank.move('escrow', b, round.escrow[b], 'refund', round.id);
    result = { winner: null, profit: 0, rake: 0, net: { [a]: 0, [b]: 0 } };
  } else {
    const loser = winner === a ? b : a;
    const p = Math.min(Math.max(0, Math.floor(profit)), round.escrow[loser]);
    const rake = Math.floor(p * RAKE);
    bank.move('escrow', winner, round.escrow[winner], 'stake-return', round.id);
    if (p - rake > 0) bank.move('escrow', winner, p - rake, 'win', round.id);
    if (rake > 0) bank.move('escrow', 'treasury', rake, 'rake', round.id);
    if (round.escrow[loser] - p > 0) bank.move('escrow', loser, round.escrow[loser] - p, 'stake-return', round.id);
    result = { winner, loser, profit: p, rake, net: { [winner]: p - rake, [loser]: -p } };
  }
  round.escrow[a] = 0;
  round.escrow[b] = 0;
  round.settled = true;
  round.result = result;
  return result;
}
