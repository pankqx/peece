// LIAR'S THRONE — UI flow (docs/02 §4). The Throne alternates each round (you start).
// The Throne plays one card face down and claims a band; the challenger believes or calls.
import { h, fmt } from '../dom.js';
import { createCard } from '../../cards/renderCard.js';
import { makeShoe } from '../../engine/seal.js';
import { BANDS, BAND_RANGE, BELIEVE_PCT, HAND_SIZE, resolveThrone, bandOf, THRONE_TIMEOUT_PCT } from '../../engine/games/throne.js';
import { throneClaim, throneAnswer } from '../../engine/rivals.js';
import { cardShort } from '../../engine/cards.js';
import { randInt } from '../../engine/rng.js';
import { persist } from '../../state/save.js';
import '../../styles/games.css';

const ACT_SECONDS = 45;
const THRONE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18 3 7l5 4 4-7 4 7 5-4-1 11Z" fill="#e2c36b"/><rect x="4" y="19" width="16" height="2.5" rx="1" fill="#e2c36b"/></svg>`;

export function prepare(ctx) {
  ctx.el.center.replaceChildren(h('div', { class: 'throne-seat' }, h('span', { class: 'throne-seat__icon', html: THRONE_ICON }), h('div', { class: 'slot slot--played' }), h('span', { class: 'omen-env__label throne-claim' }, 'The Throne awaits a claim')));
}

function claimBadge(band) {
  return h('span', { class: 'card-badge card-badge--gold' }, `Claims ${BANDS[band]} · ${BAND_RANGE[band]}`);
}

export async function play(ctx, seal) {
  const { el, rival, wait } = ctx;
  const stake = ctx.round.stake;
  const youOnThrone = ctx.roundNo % 2 === 1;
  const shoe = makeShoe(seal.deck);
  const mine = shoe.drawN(HAND_SIZE);
  const theirs = shoe.drawN(HAND_SIZE);
  const slot = el.center.querySelector('.slot--played');
  const claimLabel = el.center.querySelector('.throne-claim');

  ctx.setStatus(youOnThrone ? 'me' : 'them', 'On the Throne', 'locked');
  ctx.setStatus(youOnThrone ? 'them' : 'me', 'Challenger');
  ctx.chat.system(youOnThrone ? 'You sit on the Throne this round.' : `${rival.name} sits on the Throne this round.`);
  const [theirEls, myEls] = await Promise.all([ctx.deal(el.theirHand, theirs.map(() => null), { faceUp: false }), ctx.deal(el.myHand, mine, { faceUp: true, button: youOnThrone })]);

  let card;
  let claim;
  let answer;

  if (youOnThrone) {
    // You choose a card and a band to claim.
    ctx.setBanner('You hold the Throne — play a card and make your claim', 'gold');
    let band = null;
    const go = h('button', { class: 'btn btn--primary', type: 'button', disabled: true }, 'Play face down & claim');
    const sel = ctx.selectable(myEls, () => refresh());
    const bandBtns = BANDS.map((name, b) =>
      h(
        'button',
        {
          class: 'band-btn',
          type: 'button',
          role: 'radio',
          'aria-checked': 'false',
          onclick: () => {
            band = b;
            bandBtns.forEach((x, i) => x.setAttribute('aria-checked', String(i === b)));
            ctx.sfx.select();
            refresh();
          },
        },
        h('strong', {}, name),
        h('span', {}, BAND_RANGE[b]),
        h('em', {}, `believed: +${fmt(Math.floor(stake * BELIEVE_PCT[b]))}`)
      )
    );
    const truth = h('p', { class: 'muted small throne-truth' }, 'A claim is true if your card is in that band or higher. Every 2 counts as ACE.');
    function refresh() {
      go.disabled = sel.index < 0 || band == null;
      if (sel.index >= 0 && band != null) {
        const honest = bandOf(mine[sel.index]) >= band;
        truth.textContent = honest ? 'This claim is true — a call cannot hurt you.' : 'This claim is a bluff — if they call, you lose the full stake.';
        truth.className = `small throne-truth ${honest ? 'is-true' : 'is-bluff'}`;
      }
    }
    el.controls.replaceChildren(h('div', { class: 'throne-controls panel' }, h('div', { class: 'band-row', role: 'radiogroup', 'aria-label': 'Claim a band' }, bandBtns), truth, go));
    const ok = await new Promise((resolve) => {
      go.addEventListener('click', () => resolve(true));
      ctx.timer.start(ACT_SECONDS, () => resolve(false));
    });
    ctx.timer.stop();
    ctx.guard();
    sel.disable();
    if (!ok) {
      ctx.setBanner('You stalled on the Throne — a 25% forfeit', 'lose');
      return { winner: 'rival', profit: Math.floor(stake * THRONE_TIMEOUT_PCT), headline: 'Throne timeout', lines: ['A stalling Throne forfeits 25% of the stake.'] };
    }
    card = mine[sel.index];
    claim = band;
    myEls[sel.index].classList.add('is-played');
    const c = createCard({ id: card, faceUp: false });
    slot.replaceChildren(c);
    c.animate?.([{ transform: 'translateY(80px) scale(.8)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
    ctx.sfx.deal(1);
    slot.append(claimBadge(claim));
    claimLabel.textContent = `You claim ${BANDS[claim]}`;
    el.controls.replaceChildren(h('p', { class: 'controls__hint muted' }, `${rival.name} is weighing your claim…`));
    ctx.setStatus('them', 'Thinking…');
    if (randInt(2) === 0) ctx.say('think', 300);
    await wait(1600 + randInt(2200));
    answer = throneAnswer(rival, claim, ctx.profile.tells);
    ctx.setStatus('them', answer === 'call' ? 'Calls!' : 'Believes', 'locked');
    ctx.chat.system(`${rival.name} ${answer === 'call' ? 'calls your claim' : 'believes you'}.`);
    ctx.setBanner(answer === 'call' ? `${rival.name} calls the lie!` : `${rival.name} believes you`, 'gold');
    await wait(900);
  } else {
    // The rival holds the Throne.
    ctx.setBanner(`${rival.name} holds the Throne…`);
    ctx.setStatus('them', 'Choosing a card…');
    await wait(1200 + randInt(1600));
    const r = throneClaim(rival, theirs);
    card = theirs[r.index];
    claim = r.claim;
    theirEls[r.index].classList.add('is-played');
    const c = createCard({ id: null, faceUp: false });
    slot.replaceChildren(c);
    c.animate?.([{ transform: 'translateY(-70px) scale(.8)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
    ctx.sfx.deal(1);
    slot.append(claimBadge(claim));
    claimLabel.textContent = `${rival.name} claims ${BANDS[claim]}`;
    ctx.setStatus('them', 'On the Throne', 'locked');
    ctx.chat.system(`${rival.name} claims ${BANDS[claim]} (${BAND_RANGE[claim]}).`);
    ctx.setBanner(`Believe the ${BANDS[claim]} claim — or call the lie?`, 'gold');
    const pay = Math.floor(stake * BELIEVE_PCT[claim]);
    answer = await ctx.choose(
      [
        { label: `Believe · pay ${fmt(pay)}`, value: 'believe' },
        { label: `Call · win or lose ${fmt(stake)}`, value: 'call', primary: true },
      ],
      { seconds: ACT_SECONDS, onTimeout: 'believe', hint: `Believing costs ${Math.round(BELIEVE_PCT[claim] * 100)}% of the stake and the card stays hidden. Calling flips it.` }
    );
    ctx.setStatus('me', answer === 'call' ? 'Calls!' : 'Believes', 'locked');
  }

  const res = resolveThrone(card, claim, answer, stake);
  const played = slot.querySelector('.card');
  if (res.revealed) {
    el.felt.classList.add('is-suspense');
    await wait(700);
    el.felt.classList.remove('is-suspense');
    played.setFace(card);
    ctx.sfx.flip();
    played.flip(true);
    await wait(700);
    slot.append(h('span', { class: `card-badge ${res.truthful ? 'card-badge--up' : 'card-badge--down'}` }, res.truthful ? 'The claim was TRUE' : 'It was a LIE'));
    if (youOnThrone) {
      ctx.profile.tells.calls++;
      if (!res.truthful) ctx.profile.tells.lies++;
      persist();
      ctx.say(res.truthful ? 'fooled' : 'caught', 500);
    } else if (!res.truthful) ctx.chat.system(`Caught! ${rival.name} was bluffing.`);
    await wait(600);
  }

  const throneIsYou = youOnThrone;
  const youWin = res.throneWins === throneIsYou;
  const winner = youWin ? 'you' : 'rival';
  played.classList.add(youWin === throneIsYou ? 'is-won' : 'is-lost');
  const why = !res.revealed ? `Believed — the Throne takes ${Math.round(BELIEVE_PCT[claim] * 100)}%` : res.truthful ? 'Called — but the claim was true' : 'Called — and caught in a lie';
  return {
    winner,
    profit: res.profit,
    headline: why,
    winEl: played,
    banner: winner === 'you' ? (youOnThrone ? 'The Throne is yours' : 'You saw through it') : youOnThrone ? 'The Throne falls' : `${rival.name} keeps the Throne`,
    lines: [
      `${youOnThrone ? 'You' : rival.name} claimed ${BANDS[claim]} (${BAND_RANGE[claim]})${res.revealed ? ` with ${cardShort(card)}` : ' — card never shown'}.`,
      `${youOnThrone ? rival.name : 'You'} chose to ${answer}.`,
    ],
  };
}
