// THREE-CARD SHOWDOWN — UI flow (docs/02 §5): three cards, a secret Hold / Raise / Fold,
// an answer to a one-sided raise, then the showdown in Deuce Supreme order.
import { h, fmt } from '../dom.js';
import { makeShoe } from '../../engine/seal.js';
import { evaluate, compareShowdown, resolveDecisions, HAND_SIZE } from '../../engine/games/showdown.js';
import { showdownDecide, showdownAnswer } from '../../engine/rivals.js';
import { cardShort } from '../../engine/cards.js';
import { randInt } from '../../engine/rng.js';
import '../../styles/games.css';

const ACT_SECONDS = 45;
const VERB = { hold: 'Holds', raise: 'Raises!', fold: 'Folds' };

export function prepare(ctx) {
  ctx.el.center.replaceChildren(
    h('div', { class: 'slot slot--them vingt-total' }),
    h('div', { class: 'sd-order' }, h('span', { class: 'eyebrow' }, 'Deuce Supreme'), h('span', { class: 'sd-order__ranks' }, '3 4 5 6 7 8 9 10 J Q K A ', h('strong', {}, '2')), h('span', { class: 'muted small' }, 'Triple › Straight flush › Flush › Straight › Pair › High')),
    h('div', { class: 'slot slot--me vingt-total' })
  );
}

export async function play(ctx, seal) {
  const { el, rival, wait, bank, racct } = ctx;
  const stake = ctx.round.stake;
  const shoe = makeShoe(seal.deck);
  const mine = shoe.drawN(HAND_SIZE);
  const theirs = shoe.drawN(HAND_SIZE);
  const [theirEls, myEls] = await Promise.all([ctx.deal(el.theirHand, theirs.map(() => null), { faceUp: false }), ctx.deal(el.myHand, mine, { faceUp: true })]);
  const me = evaluate(mine);
  const them = evaluate(theirs);
  const mySlot = el.center.querySelector('.slot--me');
  const theirSlot = el.center.querySelector('.slot--them');
  mySlot.replaceChildren(h('span', { class: 'card-badge card-badge--gold vingt-score' }, me.name), h('span', { class: 'muted small' }, 'You'));
  theirSlot.replaceChildren(h('span', { class: 'card-badge vingt-score' }, '?'), h('span', { class: 'muted small' }, rival.name));

  // Simultaneous, secret decisions.
  const iCanRaise = bank.bal('you') >= stake;
  const theyCanRaise = bank.bal(racct) >= stake;
  const theirPlan = showdownDecide(rival, theirs, theyCanRaise);
  let theyDecided = false;
  ctx.setStatus('them', 'Deciding…');
  const t = setTimeout(() => {
    theyDecided = true;
    ctx.setStatus('them', 'Decided', 'locked');
    ctx.chat.system(`${rival.name} has decided.`);
  }, 1200 + randInt(2400));

  ctx.setBanner(`You hold ${me.name} — hold, raise or fold?`, 'gold');
  const mine1 = await ctx.choose(
    [
      { label: 'Fold', value: 'fold' },
      { label: 'Hold', value: 'hold' },
      { label: `Raise +${fmt(stake)}`, value: 'raise', primary: true, disabled: !iCanRaise, title: iCanRaise ? null : `You need ${fmt(stake)} more tokens to raise` },
    ],
    { seconds: ACT_SECONDS, onTimeout: 'fold', hint: iCanRaise ? 'Choices are secret and revealed together. A raise doubles the stake.' : `Raise disabled — you need ${fmt(stake)} tokens beyond your stake.` }
  );
  ctx.setStatus('me', VERB[mine1], 'locked');
  el.controls.replaceChildren(h('p', { class: 'controls__hint muted' }, theyDecided ? 'Revealing choices…' : `Waiting for ${rival.name}…`));
  while (!theyDecided) await wait(120);
  clearTimeout(t);
  await wait(400);
  ctx.setStatus('them', VERB[theirPlan.action], theirPlan.action === 'raise' ? 'win' : 'locked');
  ctx.chat.system(`You ${mine1}. ${rival.name} ${VERB[theirPlan.action].toLowerCase().replace('!', '')}.`);
  if (mine1 === 'raise') await ctx.raise('you', stake);
  if (theirPlan.action === 'raise') await ctx.raise(racct, stake);

  let r = resolveDecisions(mine1, theirPlan.action);
  if (r.kind === 'answer') {
    if (r.who === 'a') {
      ctx.setBanner(`${rival.name} raises — call or fold?`, 'gold');
      const canCall = bank.bal('you') >= stake;
      const ans = await ctx.choose(
        [
          { label: 'Fold', value: 'fold' },
          { label: `Call +${fmt(stake)}`, value: 'call', primary: true, disabled: !canCall },
        ],
        { seconds: ACT_SECONDS, onTimeout: 'fold', hint: 'Folding loses your stake only. Calling plays for double.' }
      );
      ctx.setStatus('me', ans === 'call' ? 'Calls' : 'Folds', 'locked');
      if (ans === 'call') {
        await ctx.raise('you', stake);
        r = { kind: 'showdown', mult: 2 };
      } else r = { kind: 'fold', folder: 'a' };
    } else {
      ctx.setBanner(`You raised — ${rival.name} must call or fold`);
      ctx.setStatus('them', 'Thinking…');
      await wait(1200 + randInt(1500));
      const ans = showdownAnswer(rival, theirs, bank.bal(racct) >= stake);
      ctx.setStatus('them', ans === 'call' ? 'Calls' : 'Folds', 'locked');
      ctx.chat.system(`${rival.name} ${ans === 'call' ? 'calls your raise' : 'folds'}.`);
      if (ans === 'call') {
        await ctx.raise(racct, stake);
        r = { kind: 'showdown', mult: 2 };
      } else r = { kind: 'fold', folder: 'b' };
    }
  }

  if (r.kind === 'tie') {
    ctx.setBanner('Both fold — stakes returned');
    return { winner: null, profit: 0, headline: 'Both folded', lines: ['Nobody showed a hand.'] };
  }
  if (r.kind === 'fold') {
    const youFold = r.folder === 'a';
    (youFold ? myEls : theirEls).forEach((c) => c.classList.add('is-lost'));
    return {
      winner: youFold ? 'rival' : 'you',
      profit: stake,
      headline: youFold ? 'You folded' : `${rival.name} folded`,
      banner: youFold ? `You fold — ${rival.name} takes the stake` : `${rival.name} folds — the stake is yours`,
      winEl: youFold ? theirSlot : mySlot,
      lines: [`${youFold ? 'Your' : `${rival.name}'s`} hand is never shown. The folder loses the base stake only.`, `You held ${me.name}: ${mine.map(cardShort).join(' ')}`],
    };
  }

  // Showdown.
  ctx.setBanner(r.mult === 2 ? 'Showdown — for double!' : 'Showdown');
  el.felt.classList.add('is-suspense');
  await wait(800);
  el.felt.classList.remove('is-suspense');
  for (let i = 0; i < theirEls.length; i++) {
    theirEls[i].setFace(theirs[i]);
    theirEls[i].flip(true);
    ctx.sfx.flip();
    await wait(200);
  }
  theirSlot.replaceChildren(h('span', { class: 'card-badge card-badge--gold vingt-score' }, them.name), h('span', { class: 'muted small' }, rival.name));
  await wait(600);
  const cmp = compareShowdown(me, them);
  const winner = cmp > 0 ? 'you' : cmp < 0 ? 'rival' : null;
  if (winner) {
    (winner === 'you' ? myEls : theirEls).forEach((c) => c.classList.add('is-won'));
    (winner === 'you' ? theirEls : myEls).forEach((c) => c.classList.add('is-lost'));
  }
  const why = me.cat !== them.cat ? `${(cmp > 0 ? me : them).name} beats ${(cmp > 0 ? them : me).name}` : cmp === 0 ? 'Mirrored hands — a tie' : `Both ${me.name} — higher cards win`;
  return {
    winner,
    profit: stake * r.mult,
    headline: why,
    winEl: winner === 'you' ? mySlot : winner === 'rival' ? theirSlot : null,
    banner: winner === 'you' ? `${me.name} wins${r.mult === 2 ? ' — double!' : ''}` : winner === 'rival' ? `${rival.name}'s ${them.name} wins` : why,
    lines: [`You: ${mine.map(cardShort).join(' ')} — ${me.name}`, `${rival.name}: ${theirs.map(cardShort).join(' ')} — ${them.name}`, r.mult === 2 ? 'Raised and called: played at double stake.' : 'Played at the base stake.'],
  };
}
