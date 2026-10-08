// WebAudio-only sounds (docs/05 §7): no files, everything synthesised. Master gain 0.25.
// The context is created on the first user gesture; mute state persists.
import { pref, setPref } from '../state/save.js';

let ctx = null;
let master = null;
let noiseBuf = null;
let muted = pref('muted', false);
const listeners = new Set();

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.25;
  master.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; // cosmetic noise only
  return ctx;
}

// Unlock on the first gesture.
const unlock = () => {
  ensure();
  ctx?.resume?.();
  window.removeEventListener('pointerdown', unlock);
  window.removeEventListener('keydown', unlock);
};
window.addEventListener('pointerdown', unlock);
window.addEventListener('keydown', unlock);

export const isMuted = () => muted;
export function setMuted(v) {
  muted = v;
  setPref('muted', v);
  if (master) master.gain.setTargetAtTime(v ? 0 : 0.25, ctx.currentTime, 0.02);
  listeners.forEach((fn) => fn(v));
}
export const onMute = (fn) => (listeners.add(fn), () => listeners.delete(fn));

function tone({ freq = 440, type = 'sine', at = 0, dur = 0.2, vol = 0.5, attack = 0.005, glide = null, detune = 0 }) {
  const c = ensure();
  if (!c || muted) return;
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.detune.value = detune;
  if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise({ at = 0, dur = 0.12, vol = 0.4, freq = 3000, q = 0.8, type = 'bandpass', sweep = null }) {
  const c = ensure();
  if (!c || muted) return;
  const t = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t + dur);
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.05);
}

const jitter = (n) => (Math.random() - 0.5) * n;

export const sfx = {
  deal(n = 5) {
    for (let i = 0; i < n; i++) noise({ at: i * 0.09, dur: 0.09, vol: 0.35, freq: 2200 + i * 260, q: 1.2, sweep: 900 });
  },
  select() {
    tone({ freq: 880, dur: 0.07, vol: 0.25 });
  },
  hover() {
    tone({ freq: 1320, dur: 0.04, vol: 0.05 });
  },
  flip() {
    noise({ dur: 0.22, vol: 0.4, freq: 1200, sweep: 4200, q: 0.6 });
    tone({ freq: 110, type: 'sine', at: 0.08, dur: 0.18, vol: 0.5, glide: 70 });
  },
  chip(count = 2) {
    for (let i = 0; i < count; i++) {
      tone({ freq: 2400 + jitter(200), type: 'triangle', at: i * 0.06, dur: 0.08, vol: 0.18, detune: jitter(30) });
      tone({ freq: 3600 + jitter(300), type: 'triangle', at: i * 0.06 + 0.02, dur: 0.06, vol: 0.1 });
    }
  },
  win() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      tone({ freq: f, type: 'sine', at: i * 0.11, dur: 0.9, vol: 0.28, attack: 0.01 });
      tone({ freq: f * 2, type: 'sine', at: i * 0.11, dur: 0.5, vol: 0.06 });
    });
  },
  lose() {
    tone({ freq: 392, type: 'triangle', dur: 0.35, vol: 0.22 });
    tone({ freq: 369.99, type: 'triangle', at: 0.28, dur: 0.6, vol: 0.2, glide: 330 });
  },
  tie() {
    tone({ freq: 587.33, dur: 0.4, vol: 0.2 });
    tone({ freq: 587.33, at: 0.18, dur: 0.4, vol: 0.15 });
  },
  seal() {
    for (let i = 0; i < 7; i++) noise({ at: i * 0.035 + jitter(0.02), dur: 0.05, vol: 0.3, freq: 1800 + jitter(1400), q: 3 });
    tone({ freq: 90, dur: 0.5, vol: 0.4, glide: 60 });
  },
  chat() {
    tone({ freq: 1200, dur: 0.06, vol: 0.12 });
  },
  lock() {
    tone({ freq: 220, type: 'square', dur: 0.06, vol: 0.08 });
    noise({ at: 0.02, dur: 0.06, vol: 0.25, freq: 900, q: 2 });
  },
  tick() {
    tone({ freq: 1600, dur: 0.03, vol: 0.06 });
  },
  whoosh() {
    noise({ dur: 0.35, vol: 0.2, freq: 400, sweep: 2600, q: 0.5 });
  },
};
