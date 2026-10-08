// Fair randomness: CSPRNG only, with rejection sampling so there is no modulo bias.
// Math.random() is banned from all game logic (docs/04 §2.1).

const buf = new Uint32Array(1);
const LIMIT = 2 ** 32;

/** Uniform integer in [0, n). */
export function randInt(n) {
  if (!Number.isInteger(n) || n <= 0 || n > LIMIT) throw new RangeError('randInt: bad n');
  // Discard values at or above the largest multiple of n.
  const ceiling = LIMIT - (LIMIT % n);
  let x;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= ceiling);
  return x % n;
}

/** Uniform float in [0, 1) from the CSPRNG (used by the House's decisions). */
export function randFloat() {
  crypto.getRandomValues(buf);
  return buf[0] / LIMIT;
}

/** Fisher–Yates shuffle in place, returns the array. */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 128-bit nonce as hex. */
export function nonceHex(bytes = 16) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const pick = (arr) => arr[randInt(arr.length)];
export const chance = (p) => randFloat() < p;
