// Blind bet panel (FR-21): chips, slider, All-in, Lock. Min 1, max = your balance.
import { h, fmt } from '../dom.js';
import { sfx } from '../../audio/synth.js';

const CHIPS = [
  { v: 10, c: '#1b2d55' },
  { v: 50, c: '#11674b' },
  { v: 100, c: '#a3202e' },
  { v: 500, c: '#14110c' },
];

const chipFace = (v, color) => `<svg viewBox="0 0 40 40" aria-hidden="true">
  <circle cx="20" cy="20" r="18.5" fill="${color}" stroke="#f1dc9a" stroke-width="1.2"/>
  <circle cx="20" cy="20" r="18.5" fill="none" stroke="#fbf7ec" stroke-width="4.5" stroke-dasharray="4.6 6.1" opacity=".9"/>
  <circle cx="20" cy="20" r="12" fill="${color}" stroke="#f1dc9a" stroke-width=".8"/>
  <text x="20" y="24" text-anchor="middle" font-family="Inter, sans-serif" font-weight="700" font-size="${v >= 100 ? 9.5 : 11}" fill="#fbf7ec">${v}</text></svg>`;

export function betPanel({ max, initial, onLock }) {
  let bet = Math.max(1, Math.min(max, initial || Math.min(50, max)));
  const amount = h('output', { class: 'bet__amount tabular', 'aria-live': 'polite' });
  const slider = h('input', { class: 'bet__slider', type: 'range', min: '1', max: String(max), step: '1', value: String(bet), 'aria-label': 'Bet amount' });
  const lockBtn = h('button', { class: 'btn btn--primary bet__lock', type: 'button' }, 'Lock bet');

  const set = (v, sound = true) => {
    bet = Math.max(1, Math.min(max, Math.round(v)));
    amount.textContent = fmt(bet);
    slider.value = String(bet);
    slider.style.setProperty('--p', `${((bet - 1) / Math.max(1, max - 1)) * 100}%`);
    if (sound) sfx.tick();
  };
  slider.addEventListener('input', () => set(+slider.value, false));

  const chips = CHIPS.map(({ v, c }) =>
    h('button', {
      class: 'bet__chip',
      type: 'button',
      'aria-label': `Add ${v}`,
      disabled: v > max ? true : null,
      html: chipFace(v, c),
      onclick: () => (sfx.chip(1), set(bet === 1 && v > 1 ? v : bet + v)),
    })
  );

  lockBtn.addEventListener('click', () => {
    lockBtn.disabled = true;
    el.classList.add('is-locked');
    sfx.lock();
    onLock(bet);
  });

  const el = h(
    'div',
    { class: 'bet panel', role: 'group', 'aria-label': 'Place your blind bet' },
    h('div', { class: 'bet__top' }, h('span', { class: 'eyebrow' }, 'Blind bet'), amount, h('span', { class: 'muted small' }, `of ${fmt(max)}`)),
    h('div', { class: 'bet__chips' }, chips, h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => set(1) }, 'Clear'), h('button', { class: 'btn btn--ghost btn--sm bet__allin', type: 'button', onclick: () => (sfx.chip(3), set(max)) }, 'All-in')),
    slider,
    h('div', { class: 'bet__foot' }, h('span', { class: 'muted small' }, 'Hidden until both bets lock. The lower bet becomes the stake.'), lockBtn)
  );
  set(bet, false);
  return el;
}
