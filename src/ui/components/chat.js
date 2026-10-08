// Chat with your rival (FR-40..47): right rail on desktop, bottom sheet on mobile,
// text-only rendering, 300-char cap, 1 msg/s and 20 msg/min, typing indicator,
// quick emoji reactions that float over the table, unread badge.
import { h } from '../dom.js';
import { reply, line } from '../../engine/banter.js';
import { floatEmoji } from '../../fx/burst.js';
import { sfx } from '../../audio/synth.js';
import { toast } from './toast.js';
import { randInt } from '../../engine/rng.js';

const MAX = 300;
const EMOJI = ['👏', '😂', '😮', '🔥', '😈', '🙏'];

export function createChat({ rival, you, felt }) {
  const list = h('ol', { class: 'chat__list', 'aria-live': 'polite', 'aria-label': 'Table chat' });
  const typing = h('div', { class: 'chat__typing', hidden: true }, h('span', {}), h('span', {}), h('span', {}), ` ${rival.name} is typing`);
  const input = h('input', { class: 'input chat__input', maxlength: String(MAX), placeholder: `Say something to ${rival.name.split(' ')[0]}…`, 'aria-label': 'Chat message', autocomplete: 'off' });
  const counter = h('span', { class: 'chat__count tabular' }, '');
  const sent = [];
  let unread = 0;
  let open = false;
  let alive = true;

  const badge = h('span', { class: 'chat-fab__badge', hidden: true }, '0');
  const fab = h(
    'button',
    { class: 'chat-fab', type: 'button', 'aria-label': 'Open chat', onclick: () => toggle(true) },
    h('span', { html: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v11H9l-5 4Z" fill="currentColor" fill-opacity=".12" stroke-linejoin="round"/></svg>` }),
    badge
  );

  function add(kind, who, text) {
    const item = h('li', { class: `msg msg--${kind}` }, who ? h('span', { class: 'msg__who' }, who) : null, h('span', { class: 'msg__body' }, text));
    list.append(item);
    while (list.children.length > 80) list.firstElementChild.remove();
    list.scrollTop = list.scrollHeight;
    if (!open && kind !== 'me') {
      unread++;
      badge.hidden = false;
      badge.textContent = String(Math.min(unread, 9));
    }
  }

  function rateLimited() {
    const now = Date.now();
    while (sent.length && now - sent[0] > 60000) sent.shift();
    if (sent.length && now - sent[sent.length - 1] < 1000) return 'One message per second, please.';
    if (sent.length >= 20) return 'Twenty messages a minute is the house limit.';
    sent.push(now);
    return null;
  }

  /** The rival "types" for a moment, then speaks. */
  function rivalSays(text, delay = 500 + randInt(900)) {
    if (!text) return;
    typing.hidden = false;
    setTimeout(() => {
      if (!alive) return;
      typing.hidden = true;
      add('them', rival.name, text);
      sfx.chat();
    }, delay);
  }

  function send(e) {
    e?.preventDefault();
    const text = input.value.replace(/\s+/g, ' ').trim().slice(0, MAX);
    if (!text) return;
    const limit = rateLimited();
    if (limit) return toast(limit, 'bad');
    add('me', you(), text);
    input.value = '';
    counter.textContent = '';
    const r = reply(rival.id, text);
    if (r) rivalSays(r, 900 + randInt(1400));
  }

  input.addEventListener('input', () => {
    const left = MAX - input.value.length;
    counter.textContent = left < 60 ? String(left) : '';
  });

  const reactions = h(
    'div',
    { class: 'chat__reactions', role: 'group', 'aria-label': 'Quick reactions' },
    EMOJI.map((em) =>
      h('button', { class: 'react-btn', type: 'button', 'aria-label': `React ${em}`, onclick: () => react(em, true) }, em)
    )
  );
  let lastReact = 0;
  function react(em, mine) {
    if (mine) {
      if (Date.now() - lastReact < 250) return;
      lastReact = Date.now();
    }
    floatEmoji(em, felt());
    if (mine && Math.random() < 0.15) setTimeout(() => alive && react(EMOJI[randInt(EMOJI.length)], false), 900);
  }

  const panel = h(
    'aside',
    { class: 'chat panel', 'aria-label': 'Chat' },
    h(
      'div',
      { class: 'chat__head' },
      h('span', { class: 'eyebrow' }, 'Table talk'),
      h('button', { class: 'icon-btn chat__close', type: 'button', 'aria-label': 'Close chat', onclick: () => toggle(false) }, '✕')
    ),
    list,
    typing,
    reactions,
    h('form', { class: 'chat__form', onsubmit: send }, input, counter, h('button', { class: 'btn btn--primary btn--sm', type: 'submit' }, 'Send'))
  );

  function toggle(v) {
    open = v;
    panel.classList.toggle('is-open', v);
    if (v) {
      unread = 0;
      badge.hidden = true;
      setTimeout(() => input.focus({ preventScroll: true }), 50);
    }
  }
  const onKey = (e) => e.key === 'Escape' && open && toggle(false);
  document.addEventListener('keydown', onKey);

  add('system', null, `You sat down with ${rival.name}. Chat is text-only and stays at this table.`);
  rivalSays(line(rival.id, 'greet'), 1200);

  return {
    panel,
    fab,
    system: (text) => add('system', null, text),
    say: (event, delay) => rivalSays(line(rival.id, event), delay),
    sayText: (text, delay) => rivalSays(text, delay),
    react: (em) => react(em, false),
    destroy() {
      alive = false;
      document.removeEventListener('keydown', onKey);
    },
  };
}
