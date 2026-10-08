// How to Play (FR-55, docs/02 §7): a 3-step illustrated carousel + per-game rule tabs,
// money flow, lockout and play-money notice. Keyboard (arrows) and swipe operable.
import { h } from '../dom.js';
import { header } from '../components/header.js';
import { createCard } from '../../cards/renderCard.js';
import { EMBLEMS, GAMES } from '../art.js';
import { navigate } from '../../router.js';
import { setPref } from '../../state/save.js';
import '../../styles/howto.css';

let cleanups = [];

const STEPS = [
  {
    title: 'Bet blind',
    text: 'Choose a bet with chips, the slider or All-in. Your rival bets too — neither of you sees the other’s number. When both lock, the lower bet becomes the stake and any excess comes straight back.',
    art: () => h('div', { class: 'ill ill--bet', html: chipsArt() }, h('span', { class: 'ill__amount' }, '120')),
  },
  {
    title: 'Read your hand',
    text: 'The deck was shuffled and sealed with a SHA-256 hash before you bet. Read your cards, weigh your rival — and in The Omen, decide whether to call the secret suit.',
    art: () => h('div', { class: 'ill ill--hand' }, [9, 23, 38, 50, 12].map((id, i) => fanCard(id, i, 5))),
  },
  {
    title: 'Play & reveal',
    text: 'Make your move. Both choices are revealed together with a flip. The winner takes the stake minus a 5% house rake; ties refund both. Then press Verify — the revealed deck must hash to the seal.',
    art: () => {
      const a = createCard({ id: 0 });
      const b = createCard({ id: 25 });
      b.classList.add('is-won');
      a.classList.add('is-lost');
      return h('div', { class: 'ill ill--duel' }, a, h('span', { class: 'ill__vs' }, 'vs'), b);
    },
  },
];

const RULES = {
  omen: {
    steps: [
      'Before betting, the House seals a secret Omen suit and the deck order. Only the hash is shown.',
      'Both players bet blind; the lower bet is the stake.',
      'You each get five cards. Optionally call a suit — it stays hidden until the reveal.',
      'Each player plays one card. Both flip together.',
      'Power = rank (A high, but a 2 slays an Ace). A right call adds +1 rank, a wrong call −1 (no lower than 2, no higher than A).',
      'Equal power: higher suit wins (♠ › ♥ › ♦ › ♣). Same suit too: a tie, stakes refunded.',
    ],
    example: 'You play 9♥ and call Hearts; your rival plays 10♣ with no call. The Omen was Hearts, so your 9 plays as a 10. Equal power — Hearts outranks Clubs, you win.',
  },
  vingt: {
    steps: [
      'One card is turned face up from the sealed shoe: its suit is Lucky for both players.',
      'Each player gets two hidden cards. 2–10 face value, J Q K = 10, Ace = 1 or 11. Every Lucky-suit card is worth +1 (a Lucky Ace is 2 or 12).',
      'Hit or Stand as often as you like, up to five cards. Over 21 is a bust. Your choices are hidden.',
      'Reveal: nearest to 21 wins. A bust loses to any standing hand; two busts tie.',
      'A natural 21 (two cards) beats everything. Five cards without busting — a Five-Card Charlie — beats everything else.',
      'Equal totals: fewer cards wins. Still equal: a tie.',
    ],
    example: 'Lucky suit is Spades. You hold K♠ + 9♦ = 10+1+9 = 20 and stand. Your rival hits 7♣ 6♥ 5♣ → 18. You win.',
  },
  throne: {
    steps: [
      'The Throne alternates each round — you start. Both players get five hidden cards.',
      'The Throne plays one card face down and claims a band: LOW (3–6), MID (7–10), COURT (J Q K) or ACE (A or any 2, because a 2 slays the Ace).',
      'A claim is true if the real card is in that band or higher.',
      'The challenger may Believe: the Throne wins a share of the stake — LOW 10%, MID 25%, COURT 50%, ACE 75%. The card is never shown.',
      'Or Call: the card flips. True claim → the Throne wins the full stake. A lie → the challenger wins the full stake.',
      'The House remembers how often you have been caught lying.',
    ],
    example: 'Stake 100. You play a 6 and claim COURT. If believed you win 50. If called, the 6 is LOW — a lie — and you lose 100.',
  },
  showdown: {
    steps: [
      'Three hidden cards each, ranked in Deuce Supreme order: 3 4 5 6 7 8 9 10 J Q K A 2 — the 2 is the top card.',
      'Hands: Triple › Straight flush › Flush › Straight (e.g. K-A-2) › Pair › High card. No wraparound.',
      'Both choose secretly: Hold, Raise (adds another stake — only if you can afford it) or Fold.',
      'Hold + Hold or Raise + Raise → showdown (at 1× or 2×). Raise + Hold → the holder must Call (2×) or Fold.',
      'A folder loses the base stake only; their hand is never shown.',
      'Showdown compares hand rank, then cards high to low, then the top card’s suit.',
    ],
    example: 'You hold K♣ A♣ 2♣ — a straight flush with the 2 on top — and raise. Your rival calls with a pair of Queens. You win twice the stake.',
  },
};

function chipsArt() {
  const chip = (x, y, c) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="5" rx="26" ry="9" fill="#000" opacity=".25"/><ellipse cx="0" cy="0" rx="26" ry="9" fill="${c}" stroke="#f1dc9a" stroke-width="1"/><ellipse cx="0" cy="0" rx="17" ry="6" fill="none" stroke="#fbf7ec" stroke-width="2.4" stroke-dasharray="3 3.4"/></g>`;
  let s = '';
  for (let i = 0; i < 6; i++) s += chip(70, 120 - i * 9, ['#a3202e', '#1b2d55', '#11674b'][i % 3]);
  for (let i = 0; i < 4; i++) s += chip(140, 120 - i * 9, ['#14110c', '#a3202e'][i % 2]);
  for (let i = 0; i < 8; i++) s += chip(210, 120 - i * 9, ['#11674b', '#a3202e', '#1b2d55'][i % 3]);
  return `<svg viewBox="0 0 280 150" aria-hidden="true">${s}</svg>`;
}

function fanCard(id, i, n) {
  const c = createCard({ id });
  c.style.setProperty('--i', i);
  c.style.setProperty('--n', n);
  return c;
}

export function mount(root, params = {}) {
  const top = header({ title: 'How to play' });
  cleanups.push(() => top.destroy());
  let step = 0;
  let game = GAMES[params.game] ? params.game : 'omen';

  /* ---------- carousel ---------- */
  const slides = STEPS.map((s, i) =>
    h(
      'article',
      { class: 'slide', role: 'group', 'aria-roledescription': 'slide', 'aria-label': `Step ${i + 1} of 3: ${s.title}` },
      h('div', { class: 'slide__art' }, s.art()),
      h('div', { class: 'slide__copy' }, h('span', { class: 'slide__num' }, String(i + 1)), h('h2', {}, s.title), h('p', {}, s.text))
    )
  );
  const track = h('div', { class: 'carousel__track' }, slides);
  const dots = STEPS.map((s, i) => h('button', { class: 'dot', type: 'button', 'aria-label': `Go to step ${i + 1}`, onclick: () => go(i) }));
  const prev = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Previous step', onclick: () => go(step - 1) }, '‹');
  const next = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Next step', onclick: () => go(step + 1) }, '›');
  const carousel = h('section', { class: 'carousel panel', 'aria-roledescription': 'carousel', 'aria-label': 'How a round works', tabindex: '0' }, track, h('div', { class: 'carousel__nav' }, prev, h('div', { class: 'dots' }, dots), next));

  function go(i) {
    step = (i + STEPS.length) % STEPS.length;
    track.style.transform = `translateX(${-step * 100}%)`;
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === step)));
    slides.forEach((s, k) => s.setAttribute('aria-hidden', String(k !== step)));
  }
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(step + 1);
    if (e.key === 'ArrowLeft') go(step - 1);
  });
  let sx = null;
  carousel.addEventListener('pointerdown', (e) => (sx = e.clientX));
  carousel.addEventListener('pointerup', (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 40) go(step + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ---------- per-game tabs ---------- */
  const tabs = Object.values(GAMES).map((g) =>
    h('button', { class: 'tab', type: 'button', role: 'tab', id: `tab-${g.id}`, 'aria-controls': 'rules-panel', onclick: () => pickGame(g.id) }, h('span', { class: 'tab__emblem', html: EMBLEMS[g.id] }), g.name)
  );
  const rulesPanel = h('div', { class: 'rules panel', role: 'tabpanel', id: 'rules-panel' });
  function pickGame(id) {
    game = id;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.id === `tab-${id}`)));
    const g = GAMES[id];
    const r = RULES[id];
    rulesPanel.setAttribute('aria-labelledby', `tab-${id}`);
    rulesPanel.replaceChildren(
      h('div', { class: 'rules__head' }, h('span', { class: 'rules__emblem', html: EMBLEMS[id] }), h('div', {}, h('p', { class: 'eyebrow' }, g.tag), h('h2', {}, g.name), h('p', { class: 'muted' }, g.pitch))),
      h('ol', { class: 'rules__list' }, r.steps.map((s) => h('li', {}, s))),
      h('div', { class: 'rules__example' }, h('p', { class: 'eyebrow' }, 'Worked example'), h('p', {}, r.example)),
      h('button', { class: 'btn btn--primary', type: 'button', onclick: () => (setPref('game', id), navigate('/')) }, `Play ${g.name}`)
    );
  }

  const page = h(
    'main',
    { class: 'screen howto wrap' },
    h('header', { class: 'howto__head' }, h('p', { class: 'eyebrow' }, 'The house rules'), h('h1', {}, 'How to ', h('em', { class: 'gold-text' }, 'play'))),
    carousel,
    h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Games' }, tabs),
    rulesPanel,
    h(
      'section',
      { class: 'money panel' },
      h('h2', {}, 'Where the tokens go'),
      h(
        'div',
        { class: 'money__grid' },
        [
          ['1 · Escrow', 'Both bets move into escrow the moment they lock.'],
          ['2 · Stake', 'Stake = the lower bet. The excess is refunded instantly, so nobody wins more than they risked.'],
          ['3 · Payout', 'The winner takes their stake back plus the winnings, minus a 5% house rake (rounded down) on the winnings.'],
          ['4 · Ties', 'Both stakes are refunded. No rake.'],
          ['5 · Ledger', 'Every movement is a double-entry ledger row. The books always balance — see the Fairness ledger.'],
          ['6 · Lockout', 'Hit zero and you step away from the tables for seven days. Only the house can restore tokens.'],
        ].map(([t, d]) => h('div', { class: 'money__item' }, h('strong', {}, t), h('p', { class: 'muted' }, d)))
      ),
      h('p', { class: 'small muted' }, 'Play money only. Tokens have no cash value and cannot be bought, sold or withdrawn.')
    )
  );
  root.append(top, page);
  go(0);
  pickGame(game);
}

export function unmount() {
  cleanups.forEach((f) => f());
  cleanups = [];
}
