// Builds card faces as reusable <symbol>s and returns lightweight card elements.
import { ensureSymbol, suitUse } from './sprite.js';
import { pipBody } from './pips.js';
import { courtBody } from './courts.js';
import { aceSpadesBody, aceBody } from './aceSpades.js';
import { backBody } from './back.js';
import { RANKS, rankOf, suitOf, cardName, isRed } from '../engine/cards.js';

const SVGNS = 'http://www.w3.org/2000/svg';

function indices(rank, suit) {
  const color = suit === 1 || suit === 2 ? '#a3202e' : '#14110c';
  const label = RANKS[rank];
  const fs = label === '10' ? 34 : 40;
  const corner = `<text x="27" y="50" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="${fs}" letter-spacing="${label === '10' ? -2 : 0}" fill="${color}">${label}</text>
    ${suitUse(suit, 17, 57, 20)}`;
  return `<g data-layer="indices">${corner}<g transform="rotate(180 125 175)">${corner}</g></g>`;
}

function faceMarkup(id) {
  const rank = rankOf(id);
  const suit = suitOf(id);
  let body;
  if (rank === 12) body = suit === 0 ? aceSpadesBody() : aceBody(suit);
  else if (rank >= 9) body = courtBody(rank, suit);
  else body = `<g data-layer="body">${pipBody(rank + 2, suit)}</g>`;
  return `<g clip-path="url(#cardClip)">
      <rect data-layer="base" width="250" height="350" rx="14" fill="url(#paper)"/>
      <rect width="250" height="350" fill="url(#grain)" opacity=".55"/>
    </g>
    <g data-layer="frame">
      <rect x="8" y="8" width="234" height="334" rx="10" fill="none" stroke="url(#goldA)" stroke-width="2"/>
      <rect x="11.5" y="11.5" width="227" height="327" rx="8" fill="none" stroke="#c9a24a" stroke-width=".75" opacity=".85"/>
    </g>
    ${body}
    ${indices(rank, suit)}
    <rect width="250" height="350" rx="14" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`;
}

export function faceSymbol(id) {
  return ensureSymbol(`card-${id}`, () => faceMarkup(id));
}
export function backSymbol() {
  return ensureSymbol('card-back', backBody);
}

/** A bare <svg> that renders one face (or the back) — used for illustrations. */
export function cardSvg(id, cls = 'card-svg') {
  const sym = id === 'back' ? backSymbol() : faceSymbol(id);
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 250 350');
  svg.setAttribute('class', cls);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', id === 'back' ? 'Card back' : cardName(id));
  const use = document.createElementNS(SVGNS, 'use');
  use.setAttribute('href', `#${sym}`);
  svg.append(use);
  return svg;
}

/**
 * A flippable card: .card > .card__inner > (.card__face.card__front, .card__face.card__back).
 * opts: { id, faceUp=true, button=false, size, onSelect }
 */
export function createCard({ id = null, faceUp = true, button = false, label } = {}) {
  const el = document.createElement(button ? 'button' : 'div');
  el.className = 'card';
  if (button) {
    el.type = 'button';
    el.setAttribute('aria-pressed', 'false');
  } else el.setAttribute('role', 'img');
  const inner = document.createElement('div');
  inner.className = 'card__inner';
  const front = document.createElement('div');
  front.className = 'card__face card__front';
  const back = document.createElement('div');
  back.className = 'card__face card__back';
  back.append(cardSvg('back'));
  const sheen = document.createElement('div');
  sheen.className = 'card__sheen';
  inner.append(front, back);
  el.append(inner, sheen);
  el.setFace = (cardId) => {
    el.dataset.id = cardId ?? '';
    front.replaceChildren();
    if (cardId != null) {
      front.append(cardSvg(cardId));
      el.classList.toggle('is-red', isRed(cardId));
    }
    updateLabel();
  };
  const updateLabel = () => {
    const known = el.dataset.id !== '' && el.dataset.id != null;
    const text = label || (known && !el.classList.contains('is-down') ? cardName(+el.dataset.id) : 'Face-down card');
    el.setAttribute('aria-label', text);
  };
  el.flip = (up) => {
    el.classList.toggle('is-down', !up);
    updateLabel();
  };
  el.setFace(id);
  el.flip(faceUp && id != null);
  return el;
}
