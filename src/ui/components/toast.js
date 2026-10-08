import { h } from '../dom.js';

/** toast('Invite copied', 'ok') — slides from top, auto-dismisses (05 §6). */
export function toast(text, kind = 'info', ms = 2400) {
  const host = document.getElementById('toasts');
  if (!host) return;
  const el = h('div', { class: `toast toast--${kind}`, role: 'status' }, h('span', { class: 'toast__dot' }), text);
  host.append(el);
  while (host.children.length > 3) host.firstElementChild.remove();
  setTimeout(() => {
    el.classList.add('is-out');
    setTimeout(() => el.remove(), 320);
  }, ms);
}
