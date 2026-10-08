// The Foyer (docs/05 §8): name, game picker, rival picker, take a seat. Lockout state.
import { h, fmt } from '../dom.js';
import { header } from '../components/header.js';
import { toast } from '../components/toast.js';
import { createCard } from '../../cards/renderCard.js';
import { attachTilt } from '../../cards/tilt.js';
import { EMBLEMS, GAMES, rivalPortrait } from '../art.js';
import { RIVALS, rivalAcct } from '../../engine/rivals.js';
import { bank, profile, setName, validName, isLocked, pref, setPref, onChange } from '../../state/save.js';
import { navigate } from '../../router.js';
import { sfx } from '../../audio/synth.js';
import '../../styles/lobby.css';

let cleanups = [];

const pips = (n) => h('span', { class: 'pips', 'aria-label': `Difficulty ${n} of 3` }, [1, 2, 3].map((i) => h('i', { class: i <= n ? 'on' : '' })));

function heroFan() {
  // J♦, Q♠, A♠, K♥, J♣ — a court gathered around the ceremonial Ace.
  const fan = h('div', { class: 'hero-fan', 'aria-hidden': 'true' });
  [35, 10, 12, 24, 48].forEach((id, i) => {
    const c = createCard({ id });
    c.style.setProperty('--i', i - 2);
    fan.append(c);
  });
  return fan;
}

function countdown(until) {
  const ms = Math.max(0, until - Date.now());
  const d = Math.floor(ms / 86400000);
  const hh = Math.floor((ms % 86400000) / 3600000);
  const mm = Math.floor((ms % 3600000) / 60000);
  const ss = Math.floor((ms % 60000) / 1000);
  return `${d}d ${hh}h ${String(mm).padStart(2, '0')}m ${String(ss).padStart(2, '0')}s`;
}

export function mount(root) {
  let game = pref('game', 'omen');
  let rival = pref('rival', 'marquis');
  if (!GAMES[game]) game = 'omen';
  if (!RIVALS[rival]) rival = 'marquis';

  const top = header();
  cleanups.push(() => top.destroy());

  /* ---------- hero ---------- */
  const nameInput = h('input', {
    class: 'input',
    id: 'name',
    maxlength: '14',
    autocomplete: 'nickname',
    placeholder: 'Your name at the table',
    value: profile.name || '',
    'aria-describedby': 'name-hint',
  });
  const nameForm = h(
    'form',
    { class: 'name-form', onsubmit: (e) => (e.preventDefault(), saveName()) },
    h('div', { class: 'field' }, h('label', { for: 'name' }, 'Your name'), nameInput, h('span', { id: 'name-hint', class: 'muted hint' }, '2–14 characters. No signup, no email.')),
    h('button', { class: 'btn btn--ghost', type: 'submit' }, 'Sign the guestbook')
  );
  const welcome = h('p', { class: 'welcome' });
  const paintWelcome = () => {
    welcome.replaceChildren();
    if (profile.name) {
      welcome.append('Good evening, ', h('strong', { class: 'gold-text' }, profile.name), '. Your usual table is ready.');
      nameForm.classList.add('is-compact');
    }
  };
  function saveName() {
    if (!validName(nameInput.value)) {
      toast('A name needs at least 2 characters', 'bad');
      nameInput.focus();
      return false;
    }
    setName(nameInput.value);
    nameInput.value = profile.name;
    paintWelcome();
    toast(`Welcome to the lounge, ${profile.name}`, 'ok');
    sfx.chip();
    return true;
  }

  const hero = h(
    'section',
    { class: 'hero wrap' },
    h(
      'div',
      { class: 'hero__copy' },
      h('p', { class: 'eyebrow' }, "Members' lounge · after midnight"),
      h('h1', { class: 'hero__title' }, 'Take a ', h('em', { class: 'gold-text' }, 'seat.')),
      h(
        'p',
        { class: 'hero__lede' },
        'Four card duels against the House. Blind bets, sealed decks and rivals with a temper. Every deck is sealed with a SHA-256 hash before you bet — and revealed after, so you can check nothing changed.'
      ),
      welcome,
      nameForm
    ),
    heroFan()
  );

  /* ---------- pickers ---------- */
  const gameButtons = Object.values(GAMES).map((g) =>
    h(
      'button',
      { class: 'game-card', type: 'button', 'aria-pressed': String(g.id === game), dataset: { id: g.id }, onclick: () => choose('game', g.id) },
      h('span', { class: 'game-card__tag' }, g.tag),
      h('span', { class: 'game-card__emblem', html: EMBLEMS[g.id] }),
      h('span', { class: 'game-card__name' }, g.name),
      h('span', { class: 'game-card__pitch' }, g.pitch),
      h('span', { class: 'game-card__foot' }, pips(g.difficulty), h('a', { href: `#/how-to-play/${g.id}`, class: 'link', onclick: (e) => e.stopPropagation() }, 'Rules'))
    )
  );
  const rivalButtons = Object.values(RIVALS).map((r) => {
    const bal = h('span', { class: 'tabular' }, fmt(bank.bal(rivalAcct(r.id))));
    const btn = h(
      'button',
      { class: 'rival-card', type: 'button', 'aria-pressed': String(r.id === rival), dataset: { id: r.id }, onclick: () => choose('rival', r.id) },
      h('span', { class: 'rival-card__portrait', html: rivalPortrait(r.id) }),
      h('span', { class: 'rival-card__body' }, h('span', { class: 'rival-card__title eyebrow' }, r.title), h('span', { class: 'rival-card__name' }, r.name), h('span', { class: 'rival-card__blurb' }, r.blurb)),
      h('span', { class: 'rival-card__foot' }, h('span', { class: 'muted' }, 'Purse '), bal, pips(r.difficulty))
    );
    btn.bal = bal;
    return btn;
  });

  const ctaText = h('span', { class: 'cta__text' });
  const seatBtn = h('button', { class: 'btn btn--primary btn--lg', type: 'button', onclick: takeSeat }, 'Take a seat');
  const cta = h('div', { class: 'cta panel' }, ctaText, seatBtn);

  function paintCta() {
    ctaText.replaceChildren(h('span', { class: 'muted' }, 'Tonight: '), h('strong', {}, GAMES[game].name), h('span', { class: 'muted' }, ' against '), h('strong', {}, RIVALS[rival].name));
  }
  function choose(kind, id) {
    sfx.select();
    if (kind === 'game') {
      game = id;
      setPref('game', id);
      gameButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    } else {
      rival = id;
      setPref('rival', id);
      rivalButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    }
    paintCta();
  }
  function takeSeat() {
    if (isLocked()) return;
    if (!profile.name) {
      if (!nameInput.value || !saveName()) {
        toast('Sign the guestbook first — just a name', 'info');
        nameInput.focus();
        return;
      }
    }
    sfx.whoosh();
    navigate(`/play/${game}/${rival}`);
  }

  /* ---------- lockout (FR-24) ---------- */
  const lock = h('section', { class: 'lockout panel wrap', role: 'alert' });
  let lockTimer = 0;
  function paintLock() {
    if (!isLocked()) {
      lock.hidden = true;
      cta.hidden = false;
      clearInterval(lockTimer);
      return;
    }
    cta.hidden = true;
    lock.hidden = false;
    lock.replaceChildren(
      h('div', {
        class: 'lockout__icon',
        html: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="21" width="30" height="22" rx="4" fill="none" stroke="#e2c36b" stroke-width="2"/><path d="M15 21v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#e2c36b" stroke-width="2"/><circle cx="24" cy="31" r="3" fill="#e2c36b"/><path d="M24 34v4" stroke="#e2c36b" stroke-width="2"/></svg>`,
      }),
      h('h2', {}, 'Your purse is empty.'),
      h('p', { class: 'muted' }, 'House rule: at zero tokens you step away from the tables for seven days.'),
      h('p', { class: 'lockout__count tabular' }, 'Back at the table in ', h('strong', { class: 'gold-text', id: 'lock-count' }, countdown(profile.lockedUntil))),
      h('p', { class: 'muted small' }, 'Only the house can restore tokens.')
    );
    clearInterval(lockTimer);
    lockTimer = setInterval(() => {
      const el = lock.querySelector('#lock-count');
      if (!isLocked()) paintLock();
      else if (el) el.textContent = countdown(profile.lockedUntil);
    }, 1000);
  }
  cleanups.push(() => clearInterval(lockTimer));

  /* ---------- stats + footer ---------- */
  const stats = h('section', { class: 'stats wrap' });
  function paintStats() {
    const s = profile.stats;
    const rate = s.played ? Math.round((s.won / s.played) * 100) : 0;
    stats.replaceChildren(
      ...[
        ['Rounds played', fmt(s.played)],
        ['Win rate', `${rate}%`],
        ['Best win', `${fmt(s.best)}`],
        ['House treasury', fmt(bank.bal('treasury'))],
      ].map(([k, v]) => h('div', { class: 'stat' }, h('span', { class: 'stat__v tabular gold-text' }, v), h('span', { class: 'stat__k' }, k)))
    );
    rivalButtons.forEach((b) => (b.bal.textContent = fmt(bank.bal(rivalAcct(b.dataset.id)))));
  }
  cleanups.push(onChange(paintStats));

  const page = h(
    'main',
    { class: 'screen foyer' },
    hero,
    h(
      'section',
      { class: 'picker wrap', 'aria-labelledby': 'pick-game' },
      h('div', { class: 'picker__head' }, h('span', { class: 'picker__num' }, 'I'), h('h2', { id: 'pick-game' }, 'Choose your game'), h('hr', { class: 'hairline' })),
      h('div', { class: 'game-grid' }, gameButtons)
    ),
    h(
      'section',
      { class: 'picker wrap', 'aria-labelledby': 'pick-rival' },
      h('div', { class: 'picker__head' }, h('span', { class: 'picker__num' }, 'II'), h('h2', { id: 'pick-rival' }, 'Choose your rival'), h('hr', { class: 'hairline' })),
      h('div', { class: 'rival-grid' }, rivalButtons)
    ),
    h('div', { class: 'cta-wrap wrap' }, cta, lock),
    stats,
    h(
      'footer',
      { class: 'footer wrap' },
      h(
        'div',
        { class: 'footer__in' },
        h('span', {}, 'Play money only — tokens have no cash value. Everyone starts with 1,000.'),
        h('span', {}, h('a', { href: '#/how-to-play' }, 'How to play'), ' · ', h('a', { href: '#/treasury' }, 'Fairness ledger'))
      )
    )
  );
  root.append(top, page);
  paintWelcome();
  paintCta();
  paintLock();
  paintStats();
  page.querySelectorAll('.hero-fan .card').forEach((c) => cleanups.push(attachTilt(c, 8)));
}

export function unmount() {
  cleanups.forEach((f) => f());
  cleanups = [];
}
