// VINGT DUEL — UI flow (docs/02 §3): Lucky suit card, two hidden cards each, Hit or Stand
// independently (up to five), bust over 21, then a simultaneous reveal.
import { h } from '../dom.js';
import { createCard } from '../../cards/renderCard.js';
import { makeShoe } from '../../engine/seal.js';
import { evaluate, compareVingt, MAX_CARDS } from '../../engine/games/vingt.js';
import { vingtWantsHit } from '../../engine/rivals.js';
import { SUIT_NAME, SUIT_GLYPH, suitOf, cardShort } from '../../engine/cards.js';
import { randInt } from '../../engine/rng.js';
import '../../styles/games.css';

const ACT_SECONDS = 45;

const describe = (e) => (e.bust ? `Bust (${e.total})` : e.natural ? 'Natural 21' : e.charlie ? `Five-Card Charlie (${e.total})` : `${e.soft ? 'Soft ' : ''}${e.total}`);

export function prepare(ctx) {
  ctx.el.center.replaceChildren(
    h('div', { class: 'slot slot--them vingt-total' }),
    h('div', { class: 'vingt-lucky' }, h('div', { class: 'slot slot--lucky' }), h('span', { class: 'omen-env__label' }, 'Lucky suit hidden in the shoe')),
    h('div', { class: 'slot slot--me vingt-total' })
  );
}

export async function play(ctx, seal) {
  const { el, rival, wait } = ctx;
  const shoe = makeShoe(seal.deck);

  // Lucky suit: the first card of the sealed shoe is turned face up.
  const luckyCard = shoe.draw();
  const lucky = suitOf(luckyCard);
  const luckySlot = el.center.querySelector('.slot--lucky');
  const lc = createCard({ id: luckyCard, faceUp: false });
  luckySlot.replaceChildren(lc);
  ctx.sfx.flip();
  await wait(200);
  lc.flip(true);
  lc.classList.add('is-lucky');
  el.center.querySelector('.vingt-lucky .omen-env__label').textContent = `Lucky suit: ${SUIT_NAME[lucky]} ${SUIT_GLYPH[lucky]} (+1 each)`;
  ctx.chat.system(`Lucky suit this round: ${SUIT_NAME[lucky]} ${SUIT_GLYPH[lucky]}.`);
  await wait(600);

  // Deal two each, alternating from the one shared shoe.
  const mine = [];
  const theirs = [];
  for (let i = 0; i < 2; i++) {
    mine.push(shoe.draw());
    theirs.push(shoe.draw());
  }
  ctx.setBanner('Two cards each — the Lucky suit adds +1');
  const [theirEls, myEls] = await Promise.all([ctx.deal(el.theirHand, [null, null], { faceUp: false }), ctx.deal(el.myHand, mine, { faceUp: true })]);
  const myTotal = el.center.querySelector('.slot--me');
  const theirTotal = el.center.querySelector('.slot--them');
  const paintMine = () => {
    const e = evaluate(mine, lucky);
    myTotal.replaceChildren(h('span', { class: 'card-badge card-badge--gold vingt-score' }, describe(e)), h('span', { class: 'muted small' }, 'You'));
    return e;
  };
  theirTotal.replaceChildren(h('span', { class: 'card-badge vingt-score' }, '?'), h('span', { class: 'muted small' }, rival.name));
  paintMine();

  let myDone = false;
  let theirDone = false;
  let theirCount = 2;

  async function rivalStep() {
    if (theirDone) return;
    if (vingtWantsHit(rival, theirs, lucky)) {
      theirs.push(shoe.draw());
      theirCount++;
      ctx.setStatus('them', `Hit · ${theirCount} cards`);
      theirEls.push(...(await ctx.deal(el.theirHand, [null], { faceUp: false })));
      if (evaluate(theirs, lucky).bust || theirs.length >= MAX_CARDS) {
        theirDone = true;
        ctx.setStatus('them', 'Done', 'locked');
      }
    } else {
      theirDone = true;
      ctx.setStatus('them', 'Stands', 'locked');
      ctx.chat.system(`${rival.name} stands.`);
    }
  }

  // Both sides act until each has stood, bust or reached five cards.
  while (!myDone) {
    const e = evaluate(mine, lucky);
    if (e.bust || mine.length >= MAX_CARDS) {
      myDone = true;
      break;
    }
    ctx.setStatus('me', 'Your move');
    ctx.setBanner(`You have ${describe(e)} — hit or stand?`, 'gold');
    const choice = await ctx.choose(
      [
        { label: 'Hit', value: 'hit', primary: true },
        { label: 'Stand', value: 'stand' },
      ],
      { seconds: ACT_SECONDS, onTimeout: 'stand', hint: 'Hidden from your rival. Five cards without busting is a Charlie.' }
    );
    if (choice === 'stand') {
      myDone = true;
      ctx.setStatus('me', 'Stands', 'locked');
    } else {
      mine.push(shoe.draw());
      myEls.push(...(await ctx.deal(el.myHand, [mine[mine.length - 1]], { faceUp: true })));
      const ne = paintMine();
      if (ne.bust) {
        ctx.setBanner(`Bust at ${ne.total}`, 'lose');
        ctx.sfx.lose();
        ctx.setStatus('me', 'Bust', 'lose');
        myDone = true;
      }
    }
    await rivalStep();
  }
  el.controls.replaceChildren(h('p', { class: 'controls__hint muted' }, `Waiting for ${rival.name}…`));
  while (!theirDone) {
    await wait(700 + randInt(700));
    await rivalStep();
  }

  // Reveal.
  ctx.setBanner('Reveal…');
  el.felt.classList.add('is-suspense');
  await wait(800);
  el.felt.classList.remove('is-suspense');
  for (let i = 0; i < theirEls.length; i++) {
    theirEls[i].setFace(theirs[i]);
    theirEls[i].flip(true);
    ctx.sfx.flip();
    await wait(160);
  }
  const me = evaluate(mine, lucky);
  const them = evaluate(theirs, lucky);
  theirTotal.replaceChildren(h('span', { class: 'card-badge card-badge--gold vingt-score' }, describe(them)), h('span', { class: 'muted small' }, rival.name));
  await wait(700);

  const cmp = compareVingt(me, them);
  const winner = cmp > 0 ? 'you' : cmp < 0 ? 'rival' : null;
  (winner === 'you' ? myEls : theirEls).forEach((c) => winner && c.classList.add('is-won'));
  (winner === 'you' ? theirEls : myEls).forEach((c) => winner && c.classList.add('is-lost'));
  let why = 'Closest to 21 wins';
  if (me.bust && them.bust) why = 'Both bust — stakes returned';
  else if (me.bust || them.bust) why = 'A bust loses to any standing hand';
  else if (me.natural !== them.natural) why = 'A natural 21 beats everything';
  else if (me.charlie !== them.charlie) why = 'Five-Card Charlie';
  else if (me.total === them.total && cmp !== 0) why = 'Equal totals — fewer cards wins';
  else if (cmp === 0) why = 'Dead even — stakes returned';
  return {
    winner,
    profit: ctx.round.stake,
    headline: why,
    winEl: winner === 'you' ? myTotal : winner === 'rival' ? theirTotal : null,
    banner: winner === 'you' ? `${describe(me)} beats ${describe(them)}` : winner === 'rival' ? `${rival.name}'s ${describe(them)} wins` : why,
    lines: [`Lucky suit: ${SUIT_NAME[lucky]} ${SUIT_GLYPH[lucky]}`, `You: ${mine.map(cardShort).join(' ')} = ${describe(me)}`, `${rival.name}: ${theirs.map(cardShort).join(' ')} = ${describe(them)}`],
  };
}
