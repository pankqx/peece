// /dev/cards — every face and the back at three sizes, for visual review (docs/06 P2).
import { h } from '../dom.js';
import { createCard } from '../../cards/renderCard.js';
import { attachTilt } from '../../cards/tilt.js';
import '../../styles/cards.css';

let cleanups = [];

export function mount(root) {
  const row = (size, ids) =>
    h(
      'div',
      { class: 'dev-row', style: { '--card-w': `${size}px` } },
      ids.map((id) => {
        const c = createCard({ id, button: true });
        cleanups.push(attachTilt(c));
        c.addEventListener('click', () => c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'));
        return c;
      })
    );
  const all = Array.from({ length: 52 }, (_, i) => i);
  const back = createCard({ id: 0, faceUp: false });
  root.append(
    h(
      'main',
      { class: 'screen wrap dev-cards' },
      h('h1', { class: 'gold-text' }, 'The Deck'),
      h('p', { class: 'muted' }, 'All 52 faces and the back. Hover to tilt, click to select.'),
      h('h2', {}, 'Showcase'),
      row(300, [12, 11, 24, 37, 50, 10, 22, 9, 47]),
      h('h2', {}, 'Full deck · 96px'),
      row(96, all),
      h('h2', {}, 'Back · 60 / 120 / 240'),
      h('div', { class: 'dev-row' }, [60, 120, 240].map((w) => {
        const c = createCard({ id: 0, faceUp: false });
        c.style.setProperty('--w', `${w}px`);
        return c;
      })),
      back && null
    )
  );
}

export function unmount() {
  cleanups.forEach((f) => f());
  cleanups = [];
}
