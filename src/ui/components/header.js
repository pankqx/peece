// Top bar: crown + wordmark, live token pill with count-up, How to Play, mute toggle.
import { h, fmt } from '../dom.js';
import { crownSvg } from '../../cards/crown.js';
import { bank, onChange } from '../../state/save.js';
import { isMuted, setMuted, onMute, sfx } from '../../audio/synth.js';

export const CHIP_SVG = `<svg class="chip-ico" viewBox="0 0 40 40" aria-hidden="true">
  <circle cx="20" cy="20" r="18" fill="#a3202e" stroke="#f1dc9a" stroke-width="1.5"/>
  <circle cx="20" cy="20" r="18" fill="none" stroke="#fbf7ec" stroke-width="5" stroke-dasharray="5 6.3"/>
  <circle cx="20" cy="20" r="11" fill="#7d1622" stroke="#f1dc9a" stroke-width="1"/>
  <path d="M20 13l3 7-3 7-3-7Z" fill="#f1dc9a"/></svg>`;

const ICON_SOUND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4Z" fill="currentColor" fill-opacity=".15"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>`;
const ICON_MUTE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4Z" fill="currentColor" fill-opacity=".15"/><path d="M17 9l5 6M22 9l-5 6"/></svg>`;
const ICON_BOOK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 5.5C7 4 10 4 12 6c2-2 5-2 8-.5V19c-3-1.5-6-1.5-8 .5-2-2-5-2-8-.5Z"/><path d="M12 6v13.5"/></svg>`;

/** Animate a number in an element from its current value to `to`. */
export function countTo(el, to, ms = 900) {
  const from = Number(el.dataset.value ?? to);
  el.dataset.value = to;
  if (from === to || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = fmt(to);
    return;
  }
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / ms);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function header({ back = false, title = null } = {}) {
  const amount = h('span', { class: 'tabular', 'data-value': bank.bal('you') }, fmt(bank.bal('you')));
  const pill = h('span', { class: 'token-pill', title: 'Your tokens (play money)', html: CHIP_SVG }, amount);
  pill.setAttribute('aria-label', 'Your tokens');
  const muteBtn = h('button', { class: 'icon-btn', type: 'button' });
  const paintMute = () => {
    muteBtn.replaceChildren();
    muteBtn.append(document.createRange().createContextualFragment(isMuted() ? ICON_MUTE : ICON_SOUND));
    muteBtn.setAttribute('aria-label', isMuted() ? 'Unmute sound' : 'Mute sound');
    muteBtn.setAttribute('aria-pressed', String(isMuted()));
  };
  paintMute();
  muteBtn.addEventListener('click', () => {
    setMuted(!isMuted());
    if (!isMuted()) sfx.chip();
  });
  const offMute = onMute(paintMute);
  const offBank = onChange(() => {
    const v = bank.bal('you');
    if (Number(amount.dataset.value) !== v) {
      pill.classList.remove('is-bump');
      void pill.offsetWidth;
      pill.classList.add('is-bump');
      countTo(amount, v);
    }
  });

  const el = h(
    'header',
    { class: 'topbar' },
    h(
      'div',
      { class: 'topbar__in wrap' },
      h(
        'a',
        { class: 'brand', href: '#/', 'aria-label': 'PEECE — back to the Foyer' },
        h('span', { class: 'brand__mark', html: crownSvg('brand__crown', 'hdrCrown') }),
        h('span', { class: 'brand__word' }, 'PEECE')
      ),
      title ? h('span', { class: 'topbar__title' }, title) : null,
      h(
        'nav',
        { class: 'topbar__nav', 'aria-label': 'Main' },
        h('a', { class: 'icon-btn', href: '#/how-to-play', 'aria-label': 'How to play', title: 'How to play', html: ICON_BOOK }),
        muteBtn,
        pill
      )
    )
  );
  el.destroy = () => {
    offMute();
    offBank();
  };
  return el;
}
