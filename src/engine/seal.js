// The Sealed Shoe: commit–reveal for every round (docs/04 §2.2, extended to the whole deck).
// Before any bet, the shuffled deck order (and the Omen suit for The Omen) is fixed and only
// its SHA-256 is shown. After the round, the full text is revealed and anyone can re-hash it.
import { shuffle, nonceHex, randInt } from './rng.js';
import { freshDeck } from './cards.js';
import { sha256Hex } from './hash.js';

export async function sealShoe(game) {
  const deck = shuffle(freshDeck());
  const omen = game === 'omen' ? randInt(4) : null;
  const nonce = nonceHex(16);
  const text = sealText(game, deck, omen, nonce);
  const commit = await sha256Hex(text);
  return { deck, omen, nonce, commit, text };
}

/** Exact, documented preimage format so the browser and any outside tool hash the same bytes. */
export function sealText(game, deck, omen, nonce) {
  return `PEECE|${game}|${deck.join('.')}|omen:${omen ?? '-'}|${nonce}`;
}

export async function verifySeal(text, commit) {
  return (await sha256Hex(text)) === commit;
}

/** A shoe is a dealing cursor over the sealed deck. */
export function makeShoe(deck) {
  let i = 0;
  return {
    draw() {
      if (i >= deck.length) throw new Error('shoe empty');
      return deck[i++];
    },
    drawN(n) {
      return Array.from({ length: n }, () => this.draw());
    },
    get used() {
      return i;
    },
  };
}
