// THE OMEN — UI flow (docs/02 §2): sealed envelope → deal 5 → optional suit call → pick one →
// suspense → simultaneous flip → envelope cracks → Omen shifts → winner.
import { h } from '../dom.js';
import { createCard } from '../../cards/renderCard.js';
import { suitIcon } from '../../cards/sprite.js';
import { makeShoe } from '../../engine/seal.js';
import { resolveOmen, HAND_SIZE } from '../../engine/games/omen.js';
import { omenDecide } from '../../engine/rivals.js';
import { SUIT_NAME, SUIT_GLYPH, RANKS, cardShort } from '../../engine/cards.js';
import { randInt } from '../../engine/rng.js';
import '../../styles/games.css';

const PICK_SECONDS = 45;

function envelope() {
  return h('div', {
    class: 'envelope',
    role: 'img',
    'aria-label': 'Sealed envelope holding the Omen suit',
    html: `<svg viewBox="0 0 140 100" aria-hidden="true">
      <defs><linearGradient id="envPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf7ec"/><stop offset="1" stop-color="#e6dbbd"/></linearGradient>
      <radialGradient id="wax" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#d23a49"/><stop offset=".7" stop-color="#8e1b2a"/><stop offset="1" stop-color="#5a0f1a"/></radialGradient></defs>
      <rect x="4" y="14" width="132" height="82" rx="5" fill="url(#envPaper)" stroke="#c9a24a" stroke-width="1.4"/>
      <path d="M4 96l52-38M136 96L84 58" stroke="#d9cfb3" stroke-width="1.2"/>
      <g class="envelope__flap"><path d="M4 18l66 46 66-46V16c0-1-1-2-2-2H6c-1 0-2 1-2 2Z" fill="#f3ecd8" stroke="#c9a24a" stroke-width="1.4"/></g>
      <g class="envelope__wax">
        <circle cx="70" cy="62" r="15" fill="url(#wax)"/>
        <circle cx="70" cy="62" r="15" fill="none" stroke="#5a0f1a" stroke-width="2.4" stroke-dasharray="2.6 2"/>
        <circle cx="70" cy="62" r="10" fill="none" stroke="#f1dc9a" stroke-width=".7" opacity=".7"/>
        <path d="M63 66l-2-9 5 4 4-7 4 7 5-4-2 9Z" fill="#f1dc9a"/>
      </g></svg>`,
  });
}

export function prepare(ctx) {
  const env = envelope();
  ctx.el.center.replaceChildren(h('div', { class: 'slot slot--them' }), h('div', { class: 'omen-env' }, env, h('span', { class: 'omen-env__label' }, 'The envelope is sealed')), h('div', { class: 'slot slot--me' }));
}

/** Suit-call selector: four suits + "No call", one choice (radio group). */
function callPicker(onChange) {
  let call = null;
  const opts = [null, 0, 1, 2, 3];
  const btns = opts.map((s) =>
    h(
      'button',
      {
        class: `call-btn ${s === 1 || s === 2 ? 'is-red' : ''}`,
        type: 'button',
        role: 'radio',
        'aria-checked': String(s === null),
        'aria-label': s === null ? 'No call' : `Call ${SUIT_NAME[s]}`,
        onclick: () => {
          call = s;
          btns.forEach((b, i) => b.setAttribute('aria-checked', String(opts[i] === s)));
          onChange(s);
        },
      },
      s === null ? h('span', { class: 'call-btn__none' }, 'No call') : h('span', { html: suitIcon(s) })
    )
  );
  return {
    el: h('div', { class: 'call', role: 'radiogroup', 'aria-label': 'Call the Omen suit (optional)' }, h('span', { class: 'call__label' }, 'Call the Omen'), btns),
    get value() {
      return call;
    },
  };
}

function badge(text, tone = '') {
  return h('span', { class: `card-badge ${tone ? `card-badge--${tone}` : ''}` }, text);
}

export async function play(ctx, seal) {
  const { el, rival, wait } = ctx;
  const shoe = makeShoe(seal.deck);
  const mine = shoe.drawN(HAND_SIZE);
  const theirs = shoe.drawN(HAND_SIZE);

  ctx.setBanner('Dealing five cards each…');
  const [theirCards, myCards] = await Promise.all([ctx.deal(el.theirHand, theirs.map(() => null), { faceUp: false }), wait(120).then(() => ctx.deal(el.myHand, mine, { faceUp: true, button: true }))]);

  // The House decides privately — it never sees your hand or the Omen.
  const rivalChoice = omenDecide(rival, theirs);
  const rivalCard = theirs[rivalChoice.index];
  let rivalDone = false;
  ctx.setStatus('them', 'Thinking…');
  if (randInt(3) === 0) ctx.say('think', 300);
  const rivalTimer = setTimeout(() => {
    rivalDone = true;
    ctx.setStatus('them', 'Card chosen', 'locked');
    ctx.chat.system(`${rival.name} has chosen a card.`);
    const back = theirCards[rivalChoice.index];
    back.classList.add('is-played');
    const slot = el.center.querySelector('.slot--them');
    const c = createCard({ id: null, faceUp: false });
    slot.replaceChildren(c);
    c.animate?.([{ transform: 'translateY(-60px) scale(.8)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
    ctx.sfx.deal(1);
  }, 1500 + randInt(3000));

  // Your choice.
  ctx.setBanner('Pick one card — and call the Omen if you dare', 'gold');
  ctx.setStatus('me', 'Choosing');
  const confirm = h('button', { class: 'btn btn--primary', type: 'button', disabled: true }, 'Play this card');
  const sel = ctx.selectable(myCards, (i) => (confirm.disabled = i < 0));
  const picker = callPicker(() => ctx.sfx.select());
  el.controls.replaceChildren(
    h(
      'div',
      { class: 'omen-controls panel' },
      picker.el,
      h('p', { class: 'muted small' }, 'Right call: your card plays one rank higher. Wrong call: one rank lower. A 2 slays an Ace.'),
      h('div', { class: 'omen-controls__go' }, confirm)
    )
  );

  const myIndex = await new Promise((resolve) => {
    confirm.addEventListener('click', () => resolve(sel.index));
    ctx.timer.start(PICK_SECONDS, () => resolve(-1));
  });
  ctx.timer.stop();
  ctx.guard();
  sel.disable();
  confirm.disabled = true;

  if (myIndex < 0) {
    // Idle past the deadline: the opponent already acted, so you lose the round (docs/02 §1.2).
    clearTimeout(rivalTimer);
    ctx.setBanner('Time ran out — the round goes to your rival', 'lose');
    return { winner: 'rival', profit: ctx.round.stake, headline: 'Timed out', lines: ['You did not pick a card within 45 seconds.'] };
  }
  const myCard = mine[myIndex];
  const myCall = picker.value;
  ctx.setStatus('me', 'Card played', 'locked');
  myCards[myIndex].classList.add('is-played');
  const mySlot = el.center.querySelector('.slot--me');
  const myPlayed = createCard({ id: myCard, faceUp: false });
  mySlot.replaceChildren(myPlayed);
  myPlayed.animate?.([{ transform: 'translateY(80px) scale(.8)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
  ctx.sfx.deal(1);
  el.controls.replaceChildren(h('p', { class: 'controls__hint muted' }, rivalDone ? 'Both cards are down.' : `Waiting for ${rival.name}…`));
  while (!rivalDone) await wait(120);

  // Suspense beat, then the simultaneous flip.
  ctx.setBanner('Both cards are down…');
  el.felt.classList.add('is-suspense');
  ctx.sfx.whoosh();
  await wait(900);
  el.felt.classList.remove('is-suspense');
  const theirPlayed = el.center.querySelector('.slot--them .card');
  theirPlayed.setFace(rivalCard);
  ctx.sfx.flip();
  theirPlayed.flip(true);
  await wait(250);
  ctx.sfx.flip();
  myPlayed.flip(true);
  await wait(650);

  // Reveal the calls.
  const callText = (c) => (c == null ? 'No call' : `Called ${SUIT_GLYPH[c]}`);
  const theirSlot = el.center.querySelector('.slot--them');
  theirSlot.append(badge(callText(rivalChoice.call)));
  mySlot.append(badge(callText(myCall)));
  await wait(700);

  // The envelope cracks.
  const env = el.center.querySelector('.omen-env');
  ctx.sfx.seal();
  env.classList.add('is-open');
  const omen = seal.omen;
  env.querySelector('.omen-env__label').textContent = `The Omen: ${SUIT_NAME[omen]}`;
  env.append(h('span', { class: 'omen-env__suit', html: suitIcon(omen, 'omen-suit') }));
  ctx.chat.system(`The Omen was ${SUIT_NAME[omen]} ${SUIT_GLYPH[omen]}.`);
  await wait(900);

  const r = resolveOmen(myCard, myCall, rivalCard, rivalChoice.call, omen);
  const shiftBadge = (shift, power) => (shift === 0 ? null : badge(`${shift > 0 ? '+1' : '−1'} → plays as ${RANKS[power]}`, shift > 0 ? 'up' : 'down'));
  const b1 = shiftBadge(r.shiftB, r.powerB);
  const b2 = shiftBadge(r.shiftA, r.powerA);
  if (b1) theirSlot.append(b1);
  if (b2) mySlot.append(b2);
  if (r.shiftA > 0) ctx.say('omenRight', 600);
  await wait(b1 || b2 ? 1000 : 300);

  const winner = r.cmp > 0 ? 'you' : r.cmp < 0 ? 'rival' : null;
  if (winner === 'you') {
    myPlayed.classList.add('is-won');
    theirPlayed.classList.add('is-lost');
  } else if (winner === 'rival') {
    theirPlayed.classList.add('is-won');
    myPlayed.classList.add('is-lost');
  }
  const deuceAce = (a, b) => a === 0 && b === 12;
  const why = r.cmp === 0 ? 'Equal power and equal suit' : deuceAce(r.powerA, r.powerB) || deuceAce(r.powerB, r.powerA) ? 'The Deuce slays the Ace' : r.powerA === r.powerB ? 'Equal power — the higher suit wins (♠ ♥ ♦ ♣)' : 'Higher power wins';
  return {
    winner,
    profit: ctx.round.stake,
    headline: why,
    winEl: winner === 'you' ? myPlayed : winner === 'rival' ? theirPlayed : null,
    banner: winner === 'you' ? `Your ${cardShort(myCard)} takes it` : winner === 'rival' ? `${rival.name}'s ${cardShort(rivalCard)} takes it` : 'Dead even — stakes returned',
    lines: [
      `The Omen was ${SUIT_NAME[omen]} ${SUIT_GLYPH[omen]}.`,
      `You: ${cardShort(myCard)} · ${callText(myCall)}${r.shiftA ? ` (${r.shiftA > 0 ? '+1' : '−1'})` : ''}`,
      `${rival.name}: ${cardShort(rivalCard)} · ${callText(rivalChoice.call)}${r.shiftB ? ` (${r.shiftB > 0 ? '+1' : '−1'})` : ''}`,
    ],
  };
}
