// The table: felt, seats, sealed shoe, blind bets, the round loop, payout and rematch.
// Each game module only implements play(ctx) and returns who won and how much.
import { h, fmt, announce, sleep, reducedMotion } from '../dom.js';
import { header, countTo } from '../components/header.js';
import { toast } from '../components/toast.js';
import { betPanel } from '../components/betPanel.js';
import { timerRing } from '../components/timerRing.js';
import { createChat } from '../components/chat.js';
import { createCard } from '../../cards/renderCard.js';
import { attachTilt } from '../../cards/tilt.js';
import { GAMES, rivalPortrait } from '../art.js';
import { RIVALS, rivalAcct, rivalBet } from '../../engine/rivals.js';
import { RIVAL_EMOJI } from '../../engine/banter.js';
import { sealShoe, verifySeal } from '../../engine/seal.js';
import { lockBets, settle, addEscrow } from '../../engine/bank.js';
import { randInt } from '../../engine/rng.js';
import { bank, profile, persist, checkLockout, isLocked, restoreRivals, recordRound, onChange } from '../../state/save.js';
import { flyChips } from '../../fx/chips.js';
import { burst } from '../../fx/burst.js';
import { sfx } from '../../audio/synth.js';
import { navigate } from '../../router.js';
import '../../styles/table.css';

const GAME_MODULES = {
  omen: () => import('../games/omen.js'),
  vingt: () => import('../games/vingt.js'),
  throne: () => import('../games/throne.js'),
  showdown: () => import('../games/showdown.js'),
};

const BET_SECONDS = 60;
const REMATCH_SECONDS = 6;

class Aborted extends Error {}
let session = null;

export async function mount(root, { game, rival: rivalId }) {
  const rival = RIVALS[rivalId];
  const meta = GAMES[game];
  if (!rival || !meta) return navigate('/');
  if (!profile.name) {
    toast('Sign the guestbook first', 'info');
    return navigate('/');
  }
  const mod = await GAME_MODULES[game]();
  const racct = rivalAcct(rival.id);
  const s = (session = { alive: true, cleanups: [] });
  const guard = () => {
    if (!s.alive) throw new Aborted();
  };
  const wait = async (ms) => {
    await sleep(reducedMotion() ? Math.min(ms, 150) : ms);
    guard();
  };

  /* ---------- skeleton ---------- */
  const top = header({ title: `${meta.name} · vs ${rival.name}` });
  s.cleanups.push(() => top.destroy());

  const purse = (acct) => h('span', { class: 'seat__purse tabular', 'data-value': bank.bal(acct) }, fmt(bank.bal(acct)));
  const theirPurse = purse(racct);
  const myPurse = purse('you');
  const theirStatus = h('span', { class: 'seat__status' }, 'Seated');
  const myStatus = h('span', { class: 'seat__status' }, '');

  const theirSeat = h(
    'div',
    { class: 'seat seat--them' },
    h('span', { class: 'seat__portrait', html: rivalPortrait(rival.id, 'portrait') }),
    h('span', { class: 'seat__info' }, h('span', { class: 'seat__name' }, rival.name), h('span', { class: 'seat__sub' }, theirPurse, ' tokens')),
    theirStatus
  );
  const myInitial = h('span', { class: 'seat__avatar', 'aria-hidden': 'true' }, profile.name.slice(0, 1).toUpperCase());
  const mySeat = h(
    'div',
    { class: 'seat seat--me' },
    myInitial,
    h('span', { class: 'seat__info' }, h('span', { class: 'seat__name' }, profile.name), h('span', { class: 'seat__sub' }, myPurse, ' tokens')),
    myStatus
  );

  const theirHand = h('div', { class: 'hand hand--them', 'aria-label': `${rival.name}'s cards` });
  const myHand = h('div', { class: 'hand hand--me', role: 'group', 'aria-label': 'Your hand' });
  const center = h('div', { class: 'center' });
  const potAmount = h('span', { class: 'pot__amount tabular' }, '—');
  const pot = h('div', { class: 'pot', 'aria-label': 'Pot' }, h('span', { class: 'pot__stack', html: potStack() }), h('span', { class: 'pot__label' }, 'Stake'), potAmount);
  const banner = h('div', { class: 'banner', role: 'status' });
  const deck = h('div', { class: 'shoe', 'aria-hidden': 'true' }, createCard({ id: 0, faceUp: false }), createCard({ id: 0, faceUp: false }), createCard({ id: 0, faceUp: false }));
  const timer = timerRing('Time to act');
  const treasuryDot = h('span', { class: 'treasury-dot', title: 'House treasury (rake)' }, '');

  const felt = h(
    'section',
    { class: `felt felt--${game}`, 'aria-label': 'Card table' },
    h('div', { class: 'felt__rim' }),
    theirSeat,
    theirHand,
    h('div', { class: 'felt__mid' }, deck, center, h('div', { class: 'felt__side' }, pot, timer.el, treasuryDot)),
    banner,
    myHand,
    mySeat
  );
  const controls = h('div', { class: 'controls' });
  const sealHash = h('code', { class: 'seal__hash' }, '…');
  const sealBar = h(
    'div',
    { class: 'seal' },
    h('span', { class: 'seal__wax', 'aria-hidden': 'true' }),
    h('span', { class: 'seal__text' }, h('span', { class: 'eyebrow' }, 'Sealed shoe'), sealHash),
    h('span', { class: 'seal__hint muted small' }, 'Deck order is fixed and hashed before you bet. Verify after the round.')
  );

  const chat = createChat({ rival, you: () => profile.name, felt: () => felt });
  s.cleanups.push(() => chat.destroy());

  const layout = h('main', { class: 'screen table-screen' }, h('div', { class: 'table-layout' }, h('div', { class: 'table-main' }, felt, controls, sealBar), chat.panel), chat.fab);
  root.append(top, layout);
  timer.el.hidden = true;

  const refreshPurses = () => {
    countTo(theirPurse, bank.bal(racct));
    countTo(myPurse, bank.bal('you'));
  };
  s.cleanups.push(onChange(refreshPurses));
  s.cleanups.push(() => timer.stop());

  /* ---------- helpers exposed to the game modules ---------- */
  const say = (event, delay) => chat.say(event, delay);
  const setBanner = (text, tone = '') => {
    banner.textContent = text;
    banner.className = `banner ${tone ? `banner--${tone}` : ''}`;
    banner.animate?.([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
    announce(text);
  };
  const setStatus = (who, text, tone = '') => {
    const el = who === 'them' ? theirStatus : myStatus;
    el.textContent = text;
    el.className = `seat__status ${tone ? `is-${tone}` : ''}`;
  };

  /** Deal cards with an arc from the shoe. faceUp: true | false. Returns the card elements. */
  async function deal(container, ids, { faceUp = true, button = false, stagger = 90 } = {}) {
    if (s.round) s.round.dealt = true;
    const from = deck.getBoundingClientRect();
    const cards = ids.map((id) => createCard({ id, faceUp: false, button }));
    cards.forEach((c, i) => {
      c.style.setProperty('--i', i);
      container.append(c);
    });
    container.style.setProperty('--n', container.children.length);
    sfx.deal(cards.length);
    const anims = cards.map((c, i) => {
      const r = c.getBoundingClientRect();
      const dx = from.left + from.width / 2 - (r.left + r.width / 2);
      const dy = from.top + from.height / 2 - (r.top + r.height / 2);
      if (reducedMotion()) return Promise.resolve();
      return c
        .animate([{ translate: `${dx}px ${dy}px`, rotate: '-25deg', opacity: 0.4 }, { translate: '0 0', rotate: '0deg', opacity: 1 }], { duration: 620, delay: i * stagger, easing: 'cubic-bezier(.34,1.3,.64,1)', fill: 'backwards' })
        .finished.catch(() => {});
    });
    await Promise.all(anims);
    guard();
    if (faceUp) {
      cards.forEach((c, i) => setTimeout(() => c.flip(true), i * 60));
      await wait(380 + cards.length * 60);
    }
    cards.forEach((c) => button && s.cleanups.push(attachTilt(c, 9)));
    return cards;
  }

  /** Single-select over hand cards with arrow keys; resolves on confirm via the returned API. */
  function selectable(cards, onChange) {
    let index = -1;
    const pickIdx = (i) => {
      index = i;
      cards.forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
      sfx.select();
      onChange?.(i);
    };
    cards.forEach((c, i) => {
      c.addEventListener('click', () => !c.disabled && pickIdx(index === i ? -1 : i));
      c.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const n = (i + (e.key === 'ArrowRight' ? 1 : cards.length - 1)) % cards.length;
          cards[n].focus();
        }
      });
    });
    return {
      get index() {
        return index;
      },
      disable() {
        cards.forEach((c) => (c.disabled = true));
      },
    };
  }

  /** Wait for one of several buttons in the controls area; returns its value. */
  function choose(buttons, { seconds = 0, onTimeout = null, hint = null } = {}) {
    return new Promise((resolve, reject) => {
      const row = h('div', { class: 'choice-row' });
      const done = (v) => {
        timer.stop();
        row.querySelectorAll('button').forEach((b) => (b.disabled = true));
        resolve(v);
      };
      buttons.forEach((b) => {
        const btn = h('button', { class: `btn ${b.primary ? 'btn--primary' : 'btn--ghost'} ${b.cls || ''}`, type: 'button', disabled: b.disabled || null, title: b.title || null, onclick: () => (sfx.select(), done(b.value)) }, b.icon ? h('span', { class: 'btn__icon', html: b.icon }) : null, b.label);
        row.append(btn);
      });
      controls.replaceChildren(...(hint ? [h('p', { class: 'controls__hint muted' }, hint)] : []), row);
      if (seconds) timer.start(seconds, () => (s.alive ? done(onTimeout) : reject(new Aborted())));
    });
  }

  const ctx = {
    game,
    rival,
    racct,
    bank,
    profile,
    el: { felt, center, theirHand, myHand, controls, deck, pot, theirSeat, mySeat },
    get round() {
      return s.round;
    },
    roundNo: 0,
    wait,
    guard,
    deal,
    selectable,
    choose,
    timer,
    say,
    chat,
    setBanner,
    setStatus,
    sfx,
    /** Add extra escrow for one side (Showdown raises). */
    raise(acct, amount) {
      addEscrow(bank, s.round, acct, amount);
      persist();
      potAmount.textContent = fmt(s.round.escrow.you + s.round.escrow[racct]);
      return flyChips(acct === 'you' ? mySeat : theirSeat, pot, 5);
    },
  };

  /* ---------- the round loop ---------- */
  async function betPhase() {
    setBanner('Place your blind bet', 'gold');
    setStatus('them', 'Choosing a bet…');
    setStatus('me', 'Betting');
    let rivalLocked = false;
    const rivalAmount = rivalBet(rival, bank.bal(racct));
    const rivalDelay = 900 + randInt(2200);
    const rivalTimer = setTimeout(() => {
      if (!s.alive) return;
      rivalLocked = true;
      setStatus('them', 'Bet locked', 'locked');
      sfx.lock();
      chat.system(`${rival.name} locked a bet.`);
      if (randInt(3) === 0) say('lock', 200);
    }, rivalDelay);
    s.cleanups.push(() => clearTimeout(rivalTimer));

    const myBet = await new Promise((resolve) => {
      const panel = betPanel({ max: bank.bal('you'), initial: profile.lastBet || 50, onLock: resolve });
      controls.replaceChildren(panel);
      timer.start(BET_SECONDS, () => resolve(null));
    });
    timer.stop();
    guard();
    if (myBet == null) return null;
    profile.lastBet = myBet;
    setStatus('me', 'Bet locked', 'locked');
    chat.system('You locked a bet.');
    if (myBet >= bank.bal('you') * 0.5 && myBet >= 100) {
      say('bigBet', 400);
      chat.react(RIVAL_EMOJI.bigBet[rival.id]);
    }
    controls.replaceChildren(h('p', { class: 'controls__hint muted' }, rivalLocked ? 'Both bets are in.' : `Waiting for ${rival.name}…`));
    while (!rivalLocked) await wait(120);
    return { myBet, rivalAmount };
  }

  async function revealStake(myBet, rivalAmount) {
    lockBets(bank, s.round, 'you', racct, myBet, rivalAmount);
    persist();
    setBanner(`Stake fixed at ${fmt(s.round.stake)} each`, 'gold');
    chat.system(`Both bets locked. Stake is the lower bet: ${fmt(s.round.stake)}.`);
    await Promise.all([flyChips(mySeat, pot, 5), flyChips(theirSeat, pot, 5)]);
    guard();
    countTo(potAmount, s.round.stake * 2, 600);
    potAmount.dataset.value = s.round.stake * 2;
    pot.classList.add('is-live');
  }

  async function payout(outcome, res) {
    const winnerSeat = outcome.winner === 'you' ? mySeat : theirSeat;
    const loserSeat = outcome.winner === 'you' ? theirSeat : mySeat;
    if (outcome.winner) {
      await Promise.all([flyChips(pot, winnerSeat, 8), res.rake > 0 ? flyChips(pot, treasuryDot, 2, { size: 16 }) : null]);
    } else {
      await Promise.all([flyChips(pot, mySeat, 4), flyChips(pot, theirSeat, 4)]);
    }
    pot.classList.remove('is-live');
    potAmount.textContent = '—';
    potAmount.dataset.value = 0;
    void loserSeat;
  }

  function resultPanel(outcome, res, seal) {
    const net = res.net?.you ?? 0;
    const tone = outcome.winner === 'you' ? 'win' : outcome.winner ? 'lose' : 'tie';
    const title = tone === 'win' ? `You win ${fmt(net)}` : tone === 'lose' ? `You lose ${fmt(-net)}` : 'A tie — stakes returned';
    const verifyOut = h('div', { class: 'verify', hidden: true });
    const verifyBtn = h(
      'button',
      {
        class: 'btn btn--ghost btn--sm',
        type: 'button',
        onclick: async () => {
          const ok = await verifySeal(seal.text, seal.commit);
          verifyOut.hidden = false;
          verifyOut.replaceChildren(
            h('p', { class: ok ? 'verify__ok' : 'verify__bad' }, ok ? '✓ Sealed fairly — the revealed deck hashes to the commit you saw before betting.' : '✗ Hash mismatch!'),
            h('p', { class: 'small muted' }, 'Commit (SHA-256)'),
            h('code', { class: 'verify__code' }, seal.commit),
            h('p', { class: 'small muted' }, 'Revealed preimage'),
            h('code', { class: 'verify__code' }, seal.text)
          );
          sfx.seal();
          verifyBtn.disabled = true;
        },
      },
      'Verify seal'
    );
    const lines = [
      ...(outcome.lines || []),
      `Bets: you ${fmt(s.round.bets.you)} · ${rival.name} ${fmt(s.round.bets[racct])} → stake ${fmt(s.round.stake)}`,
      outcome.winner ? `Profit ${fmt(res.profit)} · house rake ${fmt(res.rake)} (5%)` : 'No rake on a tie.',
    ];
    return h(
      'div',
      { class: `result result--${tone} panel` },
      h('p', { class: 'eyebrow' }, outcome.headline || 'Round complete'),
      h('h2', { class: 'result__title' }, title),
      h('ul', { class: 'result__lines' }, lines.map((l) => h('li', {}, l))),
      h('div', { class: 'result__actions' }, verifyBtn),
      verifyOut
    );
  }

  async function rematch(result) {
    const ring = h('span', { class: 'rematch__count tabular' }, String(REMATCH_SECONDS));
    let paused = false;
    return new Promise((resolve) => {
      const leave = h('button', { class: 'btn btn--ghost', type: 'button', onclick: () => navigate('/') }, 'Leave table');
      const pause = h('button', { class: 'btn btn--ghost', type: 'button', onclick: () => ((paused = !paused), (pause.textContent = paused ? 'Resume' : 'Pause'), paused ? null : tick()) }, 'Pause');
      const now = h('button', { class: 'btn btn--primary', type: 'button', onclick: () => finish() }, 'Deal again');
      controls.replaceChildren(result, h('div', { class: 'rematch' }, h('span', { class: 'muted' }, 'Next round in '), ring, h('div', { class: 'rematch__btns' }, leave, pause, now)));
      let left = REMATCH_SECONDS;
      let t = 0;
      const finish = () => {
        clearTimeout(t);
        resolve();
      };
      const tick = () => {
        clearTimeout(t);
        t = setTimeout(() => {
          if (!s.alive) return finish();
          if (paused) return;
          left--;
          ring.textContent = String(left);
          if (left <= 0) finish();
          else tick();
        }, 1000);
      };
      s.cleanups.push(() => clearTimeout(t));
      tick();
    });
  }

  async function roundLoop() {
    while (s.alive) {
      // Housekeeping between rounds.
      for (const id of restoreRivals()) if (id === rival.id) say('restored', 300);
      persist();
      if (isLocked() || bank.bal('you') <= 0) {
        checkLockout();
        persist();
        controls.replaceChildren(
          h('div', { class: 'result result--lose panel' }, h('p', { class: 'eyebrow' }, 'House rule'), h('h2', { class: 'result__title' }, 'Your purse is empty'), h('p', { class: 'muted' }, 'At zero tokens you step away from the tables for seven days.'), h('div', { class: 'result__actions' }, h('a', { class: 'btn btn--primary', href: '#/' }, 'Back to the Foyer')))
        );
        setBanner('Locked out for seven days', 'bad');
        return;
      }

      ctx.roundNo++;
      theirHand.replaceChildren();
      myHand.replaceChildren();
      center.replaceChildren();
      felt.classList.remove('is-suspense');
      setStatus('them', 'Seated');
      setStatus('me', '');
      const seal = await sealShoe(game);
      guard();
      s.round = { id: Date.now(), game, seal, no: ctx.roundNo, racct };
      sealHash.textContent = `${seal.commit.slice(0, 20)}…${seal.commit.slice(-6)}`;
      sealHash.title = seal.commit;
      sealBar.classList.remove('is-open');
      sealBar.animate?.([{ filter: 'brightness(2)' }, { filter: 'none' }], { duration: 700 });
      mod.prepare?.(ctx, seal);

      const bets = await betPhase();
      if (!bets) {
        setBanner('Round cancelled — no bet placed', 'muted');
        chat.system('The dealer waited 60 seconds. Round cancelled, nothing was staked.');
        say('idle');
        await rematch(h('div', { class: 'result panel' }, h('h2', { class: 'result__title' }, 'Round cancelled'), h('p', { class: 'muted' }, 'No bets were taken.')));
        continue;
      }
      await revealStake(bets.myBet, bets.rivalAmount);
      setStatus('them', 'Playing');
      setStatus('me', 'Playing');

      const outcome = await mod.play(ctx, seal);
      guard();
      const winAcct = outcome.winner === 'you' ? 'you' : outcome.winner === 'rival' ? racct : null;
      const res = settle(bank, s.round, winAcct, outcome.profit ?? s.round.stake);
      checkLockout();
      recordRound({ at: Date.now(), game, rival: rival.id, net: res.net?.you ?? 0, stake: s.round.stake, headline: outcome.headline || '', commit: seal.commit, text: seal.text });

      // Celebrate.
      if (outcome.winner === 'you') {
        sfx.win();
        setBanner(outcome.banner || 'You win the round', 'win');
        setStatus('me', 'Winner', 'win');
        setStatus('them', 'Lost', 'lose');
        burst(outcome.winEl || mySeat);
        say('lose', 700);
        if (randInt(2) === 0) chat.react(RIVAL_EMOJI.lose[rival.id]);
      } else if (outcome.winner === 'rival') {
        sfx.lose();
        setBanner(outcome.banner || `${rival.name} wins the round`, 'lose');
        setStatus('them', 'Winner', 'win');
        setStatus('me', 'Lost', 'lose');
        if (outcome.winEl) burst(outcome.winEl, { count: 30 });
        say('win', 700);
        if (randInt(2) === 0) chat.react(RIVAL_EMOJI.win[rival.id]);
      } else {
        sfx.tie();
        setBanner(outcome.banner || 'A tie — stakes returned', 'gold');
        say('tie', 700);
      }
      chat.system(outcome.winner === 'you' ? `You won ${fmt(res.net.you)} tokens.` : outcome.winner ? `${rival.name} won ${fmt(res.profit - res.rake)} tokens.` : 'Tie. Both stakes refunded.');
      announce(outcome.winner === 'you' ? `You won ${res.net.you} tokens` : outcome.winner ? `You lost ${-res.net.you} tokens` : 'Tie, stakes returned');
      sealBar.classList.add('is-open');
      await payout(outcome, res);
      guard();
      await rematch(resultPanel(outcome, res, seal));
      guard();
    }
  }

  roundLoop().catch((e) => {
    if (!(e instanceof Aborted)) {
      console.error(e);
      toast('Something went wrong at the table. Dealing a fresh round.', 'bad');
      // Never strand escrow: refund an unsettled round.
      if (s.round?.escrow && !s.round.settled) {
        settle(bank, s.round, null);
        persist();
      }
    }
  });
}

function potStack() {
  return `<svg viewBox="0 0 60 44" aria-hidden="true">${[0, 1, 2, 3, 4]
    .map((i) => `<g transform="translate(${8 + (i % 2) * 18} ${30 - i * 5})"><ellipse cx="14" cy="6" rx="14" ry="5" fill="#7d1622"/><ellipse cx="14" cy="4" rx="14" ry="5" fill="${['#a3202e', '#1b2d55', '#11674b', '#a3202e', '#14110c'][i]}" stroke="#f1dc9a" stroke-width=".8"/><ellipse cx="14" cy="4" rx="9" ry="3" fill="none" stroke="#fbf7ec" stroke-width="1.6" stroke-dasharray="2 2.4"/></g>`)
    .join('')}</svg>`;
}

export function unmount() {
  if (!session) return;
  session.alive = false;
  // Leaving mid-round: refund before cards, forfeit after (docs/02 §1.5).
  const r = session.round;
  if (r?.escrow && !r.settled) {
    if (r.dealt) settle(bank, r, r.racct, r.stake);
    else settle(bank, r, null);
    persist();
  }
  session.cleanups.forEach((f) => f());
  session = null;
}
