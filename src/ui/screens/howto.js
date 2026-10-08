import { h } from '../dom.js';

export function mount(root) {
  root.append(h('main', { class: 'screen wrap' }, h('h1', { class: 'gold-text' }, 'howto'), h('p', { class: 'muted' }, 'Coming soon.')));
}
export function unmount() {}
