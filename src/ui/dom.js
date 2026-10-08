// Tiny DOM helpers. User text is ALWAYS set through text nodes (never innerHTML).

/**
 * h('div', { class: 'x', onclick: fn, 'aria-label': '…' }, child, 'text', [more])
 * Strings become text nodes, so user-provided text can never become markup.
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.append(trusted(v)); // developer-authored SVG/markup only
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

/**
 * Parse developer-authored markup (our own SVG strings) into a fragment.
 * NEVER pass user input here.
 */
export function trusted(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function clear(el) {
  while (el.firstChild) el.firstChild.remove();
  return el;
}

/** Polite screen-reader announcement (05 §10). */
export function announce(text) {
  const live = document.getElementById('sr-live');
  if (!live) return;
  live.textContent = '';
  requestAnimationFrame(() => (live.textContent = text));
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function fmt(n) {
  return Math.round(n).toLocaleString('en-US');
}
