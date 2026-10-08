// LIAR'S THRONE (docs/02 §4): the Throne plays a hidden card and claims a band.
import { rankOf } from '../cards.js';

export const BANDS = ['LOW', 'MID', 'COURT', 'ACE'];
export const BAND_RANGE = ['3–6', '7–10', 'J Q K', 'A or 2'];
/** Share of the stake the Throne wins when the challenger believes. */
export const BELIEVE_PCT = [0.1, 0.25, 0.5, 0.75];
export const HAND_SIZE = 5;

/** Band of a card. Every 2 counts as ACE band, because a 2 slays the Ace. */
export function bandOf(card) {
  const r = rankOf(card);
  if (r === 0 || r === 12) return 3;
  if (r >= 9) return 2;
  if (r >= 5) return 1;
  return 0;
}

/** A claim is true if the real band is equal to or higher than claimed. */
export const claimTrue = (card, claim) => bandOf(card) >= claim;

/**
 * answer: 'believe' | 'call'. Returns { throneWins, profit, revealed, truthful }.
 */
export function resolveThrone(card, claim, answer, stake) {
  if (answer === 'believe') {
    return { throneWins: true, profit: Math.floor(stake * BELIEVE_PCT[claim]), revealed: false, truthful: null };
  }
  const truthful = claimTrue(card, claim);
  return { throneWins: truthful, profit: stake, revealed: true, truthful };
}

/** A stalling Throne forfeits a LOW loss of 25% of the stake (docs/02 §4). */
export const THRONE_TIMEOUT_PCT = 0.25;
