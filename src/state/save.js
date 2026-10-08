// Local persistence for the offline lounge: the bank, your profile and round history.
// Storage can throw (private windows, blocked site data) — every access is guarded,
// and the game keeps working in memory if it does.
import { Bank, START_TOKENS, LOCKOUT_MS } from '../engine/bank.js';
import { RIVALS, rivalAcct } from '../engine/rivals.js';

const KEY = 'peece.save.v1';
const HISTORY_CAP = 40;
const AUDIT_CAP = 100;

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

const raw = read() || {};
export const bank = new Bank(raw.bank);
export const profile = {
  name: '',
  lockedUntil: 0,
  history: [],
  tells: { calls: 0, lies: 0 }, // how often your Throne claims were caught as lies
  audit: [],
  stats: { played: 0, won: 0, best: 0 },
  ...(raw.profile || {}),
};

bank.open('you', START_TOKENS);
for (const id of Object.keys(RIVALS)) bank.open(rivalAcct(id), START_TOKENS);

const listeners = new Set();
/** Subscribe to any change in balances / profile (header pill, lobby). */
export const onChange = (fn) => (listeners.add(fn), () => listeners.delete(fn));

export function persist() {
  listeners.forEach((fn) => fn());
  try {
    localStorage.setItem(KEY, JSON.stringify({ bank: bank.toJSON(), profile }));
  } catch {
    /* storage unavailable: keep playing in memory */
  }
}

/* ---------- prefs (separate key, tiny) ---------- */
export function pref(key, fallback) {
  try {
    const v = localStorage.getItem(`peece.${key}`);
    return v == null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
export function setPref(key, value) {
  try {
    localStorage.setItem(`peece.${key}`, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/* ---------- lockout (FR-24) ---------- */
export const isLocked = () => profile.lockedUntil > Date.now();

/** Called after every settlement: 0 tokens → 7-day lockout. */
export function checkLockout() {
  if (bank.bal('you') <= 0 && !isLocked()) {
    profile.lockedUntil = Date.now() + LOCKOUT_MS;
    return true;
  }
  return false;
}

/** A broke rival is quietly restored by the Treasury so the lounge never empties. */
export function restoreRivals() {
  const restored = [];
  for (const id of Object.keys(RIVALS)) {
    if (bank.bal(rivalAcct(id)) <= 0) {
      bank.move('mint', rivalAcct(id), START_TOKENS, 'mint', null, 'Treasury restored rival');
      restored.push(id);
    }
  }
  return restored;
}

export function recordRound(entry) {
  profile.history.unshift(entry);
  if (profile.history.length > HISTORY_CAP) profile.history.length = HISTORY_CAP;
  profile.stats.played++;
  if (entry.net > 0) {
    profile.stats.won++;
    profile.stats.best = Math.max(profile.stats.best, entry.net);
  }
  persist();
}

export function audit(action, detail) {
  profile.audit.unshift({ at: Date.now(), action, detail });
  if (profile.audit.length > AUDIT_CAP) profile.audit.length = AUDIT_CAP;
  persist();
}

export function setName(name) {
  profile.name = cleanName(name);
  persist();
}

/** 2–14 visible characters, control characters stripped (docs/04 finding 12). */
export function cleanName(name) {
  // eslint-disable-next-line no-control-regex
  return String(name || '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 14);
}
export const validName = (n) => cleanName(n).length >= 2;

persist();
