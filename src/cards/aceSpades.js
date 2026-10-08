// The ceremonial Ace of Spades (docs/05 §4.4): medallion, rotating legend, rays, laurels, fleurons.
import { suitUse } from './sprite.js';

const CX = 125;
const CY = 175;

function rays() {
  let out = '';
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const long = i % 2 === 0;
    const r1 = 70;
    const r2 = long ? 104 : 88;
    const w = long ? 0.045 : 0.03;
    const p = (r, da) => `${(CX + Math.cos(a + da) * r).toFixed(1)} ${(CY + Math.sin(a + da) * r).toFixed(1)}`;
    out += `<path d="M${p(r1, -w)}L${p(r2, 0)}L${p(r1, w)}Z" fill="url(#goldB)" opacity="${long ? 0.8 : 0.5}"/>`;
  }
  return out;
}

function laurel(side) {
  let out = '';
  const dir = side === 'left' ? -1 : 1;
  for (let i = 0; i < 9; i++) {
    const a = Math.PI / 2 + dir * (0.35 + i * 0.13);
    const r = 80;
    const x = CX + Math.cos(a) * r;
    const y = CY + Math.sin(a) * r;
    const deg = (a * 180) / Math.PI + (side === 'left' ? -60 : 60);
    out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="2.6" transform="rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".4"/>`;
  }
  return out;
}

export function aceSpadesBody() {
  return `<g data-layer="body">
    <circle cx="${CX}" cy="${CY}" r="104" fill="url(#aceGlow)"/>
    ${rays()}
    ${laurel('left')}${laurel('right')}
    <circle cx="${CX}" cy="${CY}" r="69" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.4"/>
    <circle cx="${CX}" cy="${CY}" r="54" fill="none" stroke="#c9a24a" stroke-width=".8"/>
    <g class="ace-ring">
      <text font-family="Cormorant Garamond, Georgia, serif" font-size="9.6" font-weight="700" letter-spacing="2.6" fill="#8a6a24">
        <textPath href="#aceRingPath">PEECE · EST · MMXXVI · PEECE · EST · MMXXVI ·</textPath>
      </text>
    </g>
    ${suitUse(0, CX - 40, CY - 42, 80, { stroke: '#c9a24a', strokeWidth: 1.4 })}
    <path d="M${CX} ${CY - 12}l3 5-3 5-3-5Z" fill="url(#goldA)"/>
    ${suitUse(0, CX - 7, 52, 14, { fill: 'url(#goldB)' })}
    ${suitUse(0, CX - 7, 284, 14, { fill: 'url(#goldB)', rotate: true })}
  </g>`;
}

/** Ordinary Aces: one large pip inside a fine double ring. */
export function aceBody(suit) {
  return `<g data-layer="body">
    <circle cx="${CX}" cy="${CY}" r="58" fill="none" stroke="#c9a24a" stroke-width="1" opacity=".7"/>
    <circle cx="${CX}" cy="${CY}" r="52" fill="none" stroke="#c9a24a" stroke-width=".5" opacity=".6"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${CX} ${CY - 66 + (i % 2 ? 132 : 0)}l3 4-3 4-3-4Z" fill="#c9a24a" transform="rotate(${i < 2 ? 0 : 90} ${CX} ${CY})"/>`).join('')}
    ${suitUse(suit, CX - 36, CY - 36, 72)}
  </g>`;
}
