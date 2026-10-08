// "The King burns" (docs/05 §5). An overlay shown once per session while the lounge loads.
import { h, trusted, reducedMotion, sleep } from '../dom.js';
import { crownSvg } from '../../cards/crown.js';
import { createCard } from '../../cards/renderCard.js';
import { createFire } from '../../fx/fire.js';
import '../../styles/loader.css';

const SEEN = 'peece.loaderSeen';
const MIN_MS = 2200;

export function shouldShowLoader() {
  try {
    return !sessionStorage.getItem(SEEN);
  } catch {
    return true;
  }
}

/**
 * Plays the loader while `tasks` (promises) complete. Resolves when the overlay is gone.
 */
export async function runLoader(tasks = []) {
  try {
    sessionStorage.setItem(SEEN, '1');
  } catch {
    /* ignore */
  }
  const calm = reducedMotion();
  const lowEnd = (navigator.hardwareConcurrency || 4) <= 4 || matchMedia('(max-width: 520px)').matches;

  const ring = trusted(`<svg class="loader__ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(226,195,107,.15)" stroke-width="1.5"/>
      <circle class="loader__ring-fill" cx="60" cy="60" r="54" fill="none" stroke="url(#ringGrad)" stroke-width="2.5"
        stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 60 60)"/>
      <defs><linearGradient id="ringGrad"><stop offset="0" stop-color="#8a6a24"/><stop offset=".5" stop-color="#f6e3a3"/><stop offset="1" stop-color="#c9a24a"/></linearGradient></defs>
    </svg>`);
  const heat = trusted(`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <filter id="heat"><feTurbulence id="heatNoise" type="fractalNoise" baseFrequency=".012 .06" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`);

  const king = createCard({ id: 11 });
  king.classList.add('loader__card');
  const char = h('div', { class: 'loader__char' });
  king.append(char);

  const letters = [...'PEECE'].map((ch) => h('span', { class: 'loader__letter' }, ch));
  const back = h('canvas', { class: 'loader__canvas loader__canvas--back', 'aria-hidden': 'true' });
  const front = h('canvas', { class: 'loader__canvas loader__canvas--front', 'aria-hidden': 'true' });
  const skip = h('button', { class: 'btn btn--ghost btn--sm loader__skip', type: 'button' }, 'Skip');
  const pct = h('span', { class: 'loader__pct tabular' }, '0%');

  const el = h(
    'div',
    { class: `loader${calm ? ' is-calm' : ''}`, role: 'dialog', 'aria-label': 'Loading PEECE' },
    heat,
    back,
    h(
      'div',
      { class: 'loader__brand' },
      h('div', { class: 'loader__mark', html: crownSvg('loader__crown', 'loaderCrown') }, ring),
      h('h1', { class: 'loader__word', 'aria-label': 'PEECE' }, letters),
      h('span', { class: 'loader__underline' }),
      h('p', { class: 'loader__tag' }, 'The midnight card lounge'),
      pct
    ),
    h('div', { class: 'loader__stage' }, king),
    front,
    h('div', { class: 'loader__flash' }),
    skip
  );
  document.body.append(el);

  const fire = calm ? null : createFire({ back, front, target: king, budget: lowEnd ? 0.55 : 1 });
  fire?.start();

  // Heat shimmer: drift the turbulence frequency.
  let shimmerRaf = 0;
  const noiseEl = el.querySelector('#heatNoise');
  if (!calm && noiseEl) {
    const tick = (t) => {
      const f = 0.06 + Math.sin(t / 380) * 0.012;
      noiseEl.setAttribute('baseFrequency', `${(0.012 + Math.sin(t / 900) * 0.003).toFixed(4)} ${f.toFixed(4)}`);
      shimmerRaf = requestAnimationFrame(tick);
    };
    shimmerRaf = requestAnimationFrame(tick);
  }

  // Real progress from the loading tasks.
  const fill = el.querySelector('.loader__ring-fill');
  let done = 0;
  const total = Math.max(1, tasks.length);
  const setProgress = (p) => {
    fill.setAttribute('stroke-dashoffset', String(100 - p * 100));
    pct.textContent = `${Math.round(p * 100)}%`;
    letters.forEach((l, i) => l.classList.toggle('is-lit', p >= (i + 0.5) / letters.length || p === 1));
  };
  const all = Promise.all(tasks.map((t) => Promise.resolve(t).catch(() => {}).then(() => setProgress(++done / total))));

  requestAnimationFrame(() => el.classList.add('is-in'));
  let skipped = false;
  const skipPromise = new Promise((resolve) => {
    setTimeout(() => skip.classList.add('is-ready'), 1000);
    skip.addEventListener('click', () => {
      skipped = true;
      resolve();
    });
  });
  // Fake-smooth the ring toward the real progress so the first frames feel alive.
  setProgress(0.04);

  await Promise.race([Promise.all([all, sleep(calm ? 900 : MIN_MS)]), skipPromise]);
  setProgress(1);
  if (!skipped && !calm) {
    el.classList.add('is-flaring');
    fire?.flare();
    await sleep(700);
  }
  el.classList.add('is-out');
  await sleep(calm ? 300 : 650);
  fire?.stop();
  cancelAnimationFrame(shimmerRaf);
  el.remove();
}
