// Court cards (docs/05 §4.3): double-ended half-figures built from simple geometry.
// Named layers: base, robe, ermine, crown, face, prop, filigree.
// Suit themes: ♠ midnight, ♥ ruby, ♦ amber, ♣ emerald — all with gold on ivory.
import { suitUse } from './sprite.js';

export const THEMES = [
  { robe: '#1b2d55', deep: '#0a1220', light: '#3a5794', hair: '#2f2216', trim: '#e2c36b' },
  { robe: '#9b1c2e', deep: '#5a0f1a', light: '#cc3b4d', hair: '#5e3218', trim: '#f1dc9a' },
  { robe: '#bf7a1a', deep: '#7a4a0e', light: '#e4a748', hair: '#43290f', trim: '#fbeab0' },
  { robe: '#11674b', deep: '#073526', light: '#22926b', hair: '#2a1f14', trim: '#e2c36b' },
];

/* ---------- shared pieces ---------- */

function robe(t) {
  // Brocade: tiny gold lozenges scattered over the mantle.
  let brocade = '';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      const x = 58 + col * 17 + (row % 2) * 8;
      const y = 152 + row * 8;
      if (x > 106 && x < 144) continue;
      brocade += `<path d="M${x} ${y}l2.4 2.4-2.4 2.4-2.4-2.4Z" fill="${t.trim}" opacity=".55"/>`;
    }
  }
  return `<g data-layer="robe">
    <path d="M46 175V158C54 141 79 132 101 128H149C171 132 196 141 204 158V175Z" fill="${t.robe}"/>
    <path d="M46 175V158C54 141 79 132 101 128H113C97 136 82 152 79 175Z" fill="${t.deep}" opacity=".5"/>
    <path d="M204 175V158C196 141 171 132 149 128H140C156 136 170 152 173 175Z" fill="#fff" opacity=".07"/>
    ${brocade}
    <path d="M46 158C54 141 79 132 101 128M204 158C196 141 171 132 149 128" stroke="url(#goldB)" stroke-width="2.6" fill="none"/>
    <rect x="118" y="140" width="14" height="35" fill="url(#goldB)"/>
    <path d="M125 146l4 5-4 5-4-5Zm0 14l4 5-4 5-4-5Z" fill="${t.deep}"/>
  </g>`;
}

function ermine(y = 139) {
  const tails = [92, 108, 125, 142, 158]
    .map((x, i) => {
      const ty = y - 1 + (i === 0 || i === 4 ? -2 : 1);
      return `<path d="M${x} ${ty}c-1.7 3.2-1.7 5.6 0 7.6c1.7-2 1.7-4.4 0-7.6Z" fill="#14110c"/><path d="M${x - 2.6} ${ty - 1.6}h5.2" stroke="#14110c" stroke-width=".9"/>`;
    })
    .join('');
  return `<g data-layer="ermine">
    <path d="M76 ${y}C88 ${y - 13} 107 ${y - 16} 125 ${y - 16}C143 ${y - 16} 162 ${y - 13} 174 ${y}C162 ${y + 10} 141 ${y + 7} 125 ${y + 7}C109 ${y + 7} 88 ${y + 10} 76 ${y}Z" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".8"/>
    ${tails}
  </g>`;
}

function face(t, { cy = 98, rx = 15.5, ry = 19, lips = '#a5524a', lashes = false } = {}) {
  const ey = cy;
  return `<g data-layer="face">
    <rect x="117.5" y="${cy + 12}" width="15" height="16" fill="url(#skin)"/>
    <ellipse cx="125" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#skin)" stroke="#c99a70" stroke-width=".6"/>
    <circle cx="116" cy="${cy + 6}" r="3.6" fill="#e0767f" opacity=".22"/>
    <circle cx="134" cy="${cy + 6}" r="3.6" fill="#e0767f" opacity=".22"/>
    <path d="M114.5 ${ey - 5}q4-2.6 8 0M127.5 ${ey - 5}q4-2.6 8 0" stroke="${t.hair}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="119" cy="${ey}" rx="2" ry="1.4" fill="#1e1a14"/>
    <ellipse cx="131" cy="${ey}" rx="2" ry="1.4" fill="#1e1a14"/>
    ${lashes ? `<path d="M116.6 ${ey - 1.2}l-1.6-1.4M133.4 ${ey - 1.2}l1.6-1.4" stroke="#1e1a14" stroke-width=".8"/>` : ''}
    <path d="M125 ${ey + 1}v7.5l-2.6 1.3" stroke="#b0805a" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M121 ${ey + 13}q4 2.6 8 0q-4-1.2-8 0Z" fill="${lips}"/>
  </g>`;
}

function medallion(suit, cx = 125, cy = 158) {
  return `<circle cx="${cx}" cy="${cy}" r="12.5" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.2"/>
    <circle cx="${cx}" cy="${cy}" r="9.5" fill="none" stroke="#c9a24a" stroke-width=".5"/>
    ${suitUse(suit, cx - 7.5, cy - 7.5, 15)}`;
}

const hand = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5.6" fill="url(#skin)" stroke="#c99a70" stroke-width=".6"/>`;

/* ---------- props ---------- */

const sword = () => `<g data-layer="prop">
  <path d="M167 54l3.5-9 3.5 9V146h-7Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M170.5 50V144" stroke="#fff" stroke-width=".6" opacity=".7"/>
  <rect x="156" y="144" width="29" height="5.5" rx="2.6" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".5"/>
  <rect x="167.5" y="149" width="6" height="16" fill="#3b2a1a"/>
  <circle cx="170.5" cy="167" r="4.2" fill="url(#goldA)"/>
  ${hand(170.5, 157)}
</g>`;

const sceptre = () => `<g data-layer="prop">
  <rect x="168" y="62" width="5" height="104" rx="2.4" fill="url(#goldB)"/>
  <rect x="166.5" y="88" width="8" height="3" rx="1.5" fill="url(#goldA)"/>
  <rect x="166.5" y="120" width="8" height="3" rx="1.5" fill="url(#goldA)"/>
  <circle cx="170.5" cy="57" r="8.5" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".8"/>
  <circle cx="170.5" cy="57" r="3.2" fill="#b3202e"/>
  <path d="M170.5 41v9M166 45.5h9" stroke="url(#goldB)" stroke-width="2.4" stroke-linecap="round"/>
  ${hand(170.5, 157)}
</g>`;

const rose = () => `<g data-layer="prop">
  <path d="M86 168C84 148 88 128 88 112" stroke="#2f6b3f" stroke-width="2.2" fill="none"/>
  <path d="M87 136c-8-4-12-2-14 2c6 2 10 2 14-2ZM88 126c7-5 11-4 13-1c-5 3-9 3-13 1Z" fill="#2f8a52"/>
  <circle cx="88" cy="107" r="8" fill="#9b1c2e"/>
  <circle cx="88" cy="107" r="5.6" fill="#cc3b4d"/>
  <path d="M84.5 106.5q3.5-4 7 0q-3.5 3.6-7 0Z" fill="#7d1622"/>
  <path d="M82 101q6-3 12 0" stroke="#e8707c" stroke-width=".8" fill="none"/>
  ${hand(86, 154)}
</g>`;

const fan = (t) => {
  let ribs = '';
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * (1.08 + (i / 8) * 0.84);
    ribs += `<path d="M86 132L${(86 + Math.cos(a) * 30).toFixed(1)} ${(132 + Math.sin(a) * 30).toFixed(1)}" stroke="#8a6a24" stroke-width=".7"/>`;
  }
  return `<g data-layer="prop">
    <path d="M86 132L${(86 + Math.cos(Math.PI * 1.08) * 32).toFixed(1)} ${(132 + Math.sin(Math.PI * 1.08) * 32).toFixed(1)}A32 32 0 0 1 ${(86 + Math.cos(Math.PI * 1.92) * 32).toFixed(1)} ${(132 + Math.sin(Math.PI * 1.92) * 32).toFixed(1)}Z" fill="${t.light}" stroke="url(#goldA)" stroke-width="1.4"/>
    <path d="M86 132L${(86 + Math.cos(Math.PI * 1.08) * 22).toFixed(1)} ${(132 + Math.sin(Math.PI * 1.08) * 22).toFixed(1)}A22 22 0 0 1 ${(86 + Math.cos(Math.PI * 1.92) * 22).toFixed(1)} ${(132 + Math.sin(Math.PI * 1.92) * 22).toFixed(1)}" fill="none" stroke="#fbeab0" stroke-width=".8" opacity=".8"/>
    ${ribs}
    ${hand(86, 138)}
  </g>`;
};

const flowerSceptre = () => `<g data-layer="prop">
  <rect x="83.5" y="96" width="4.5" height="72" rx="2" fill="url(#goldB)"/>
  <path d="M85.7 98c-8-4-10-14-7-22c3 5 5 7 7 7c2 0 4-2 7-7c3 8 1 18-7 22Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".7"/>
  <path d="M85.7 96c-2-6-1-12 0-16c1 4 2 10 0 16Z" fill="#fbeab0"/>
  <circle cx="85.7" cy="104" r="2.2" fill="#b3202e"/>
  ${hand(86, 150)}
</g>`;

const halberd = () => `<g data-layer="prop">
  <rect x="168" y="58" width="4.5" height="112" rx="2" fill="#6b4a2b"/>
  <path d="M170.2 40l3.6 14h-7.2Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M172.5 60c10-2 17 4 18 14c-6-4-12-5-18-3Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".6"/>
  <path d="M168 62c-5 0-8 3-9 7c3-2 6-2 9-2Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M166 76h9" stroke="url(#goldA)" stroke-width="3"/>
  <path d="M170.2 78c-3 4-4 8-2 12M170.2 78c3 4 4 8 2 12" stroke="#b3202e" stroke-width="1.6" fill="none"/>
  ${hand(170.2, 152)}
</g>`;

/* ---------- the three figures ---------- */

function king(suit, t) {
  const prop = suit === 0 || suit === 3 ? sword() : sceptre();
  return `${robe(t)}
    <path data-layer="hair" d="M104 93C102 78 112 66 125 66C138 66 148 78 146 93C148 105 146 117 140 124H110C104 117 102 105 104 93Z" fill="${t.hair}"/>
    ${ermine()}
    ${face(t)}
    <path d="M109.5 100C110 116 116 129 125 134C134 129 140 116 140.5 100C137 111 132 116 125 116C118 116 113 111 109.5 100Z" fill="${t.hair}"/>
    <path d="M118 120q2 6 0 10M125 122v10M132 120q-2 6 0 10" stroke="#000" stroke-width=".6" opacity=".35" fill="none"/>
    <path d="M114 110.5q5.5-4.5 11-1.2q5.5-3.3 11 1.2q-5.5.8-11 .6q-5.5.2-11-.6Z" fill="${t.hair}"/>
    <g data-layer="crown">
      <path d="M106 76L103.5 56L114 66.5L119 51L125 61L131 51L136 66.5L146.5 56L144 76Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".8"/>
      <rect x="105.5" y="74" width="39" height="9.5" rx="1.6" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".7"/>
      <circle cx="103.5" cy="56" r="2.6" fill="url(#pearl)"/><circle cx="119" cy="51" r="2.6" fill="url(#pearl)"/>
      <circle cx="131" cy="51" r="2.6" fill="url(#pearl)"/><circle cx="146.5" cy="56" r="2.6" fill="url(#pearl)"/>
      <path d="M125 45v13M120.6 49.4h8.8" stroke="url(#goldB)" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="125" cy="78.8" r="2.8" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
      <circle cx="114.5" cy="78.8" r="1.9" fill="#1f8d68"/><circle cx="135.5" cy="78.8" r="1.9" fill="#1f8d68"/>
    </g>
    ${prop}
    ${medallion(suit)}`;
}

function queen(suit, t) {
  const prop = suit === 1 ? rose() : suit === 2 ? fan(t) : flowerSceptre();
  let pearls = '';
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * (0.15 + (i / 8) * 0.7);
    pearls += `<circle cx="${(125 + Math.cos(a) * 15).toFixed(1)}" cy="${(124 + Math.sin(a) * 9).toFixed(1)}" r="1.7" fill="url(#pearl)"/>`;
  }
  return `<path data-layer="veil" d="M101 82C92 104 85 132 78 175H172C165 132 158 104 149 82Z" fill="#fbf7ec" opacity=".5"/>
    <path d="M104 92C88 120 84 150 82 175M146 92C162 120 166 150 168 175" stroke="#d9cfb3" stroke-width=".6" fill="none" opacity=".8"/>
    ${robe(t)}
    <path data-layer="hair" d="M106 92C102 76 112 64 125 64C138 64 148 76 144 92C150 110 152 128 146 140H104C98 128 100 110 106 92Z" fill="${t.hair}"/>
    <path d="M84 139q10 8 20 0q10 8 21 0q10 8 21 0q10 8 20 0L166 132C150 125 100 125 84 132Z" fill="#fbf7ec" stroke="url(#goldB)" stroke-width="1"/>
    ${face(t, { cy: 97, rx: 14.5, ry: 18, lips: '#b3202e', lashes: true })}
    <path d="M110.5 92C113 82 119 79 125 79C131 79 137 82 139.5 92C136 86 131 84 125 84C119 84 114 86 110.5 92Z" fill="${t.hair}"/>
    ${pearls}
    <circle cx="125" cy="133.5" r="2.6" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
    <g data-layer="crown">
      <path d="M109 78L111 63L118 71L125 57L132 71L139 63L141 78Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".7"/>
      <rect x="108.5" y="76" width="33" height="5.5" rx="1.4" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".6"/>
      <circle cx="111" cy="63" r="2" fill="url(#pearl)"/><circle cx="125" cy="57" r="2.3" fill="url(#pearl)"/><circle cx="139" cy="63" r="2" fill="url(#pearl)"/>
      <path d="M125 64l3 4.5-3 4.5-3-4.5Z" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
    </g>
    ${prop}
    ${medallion(suit, 125, 160)}`;
}

function jack(suit, t) {
  return `${robe(t)}
    <path data-layer="sash" d="M58 146L76 136L196 175H158Z" fill="url(#goldB)" opacity=".92"/>
    <path d="M62 147L196 175" stroke="#8a6a24" stroke-width=".6" opacity=".7"/>
    <g data-layer="ruff">${[104, 111, 118, 125, 132, 139, 146].map((x) => `<circle cx="${x}" cy="128" r="4.2" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".6"/>`).join('')}</g>
    ${face(t, { cy: 100, rx: 14, ry: 17, lips: '#a5524a' })}
    <path data-layer="hair" d="M107 98C104 82 113 72 125 72C137 72 146 82 143 98C140 91 134 87 125 87C116 87 110 91 107 98Z" fill="${t.hair}"/>
    <circle cx="108.5" cy="99" r="3.6" fill="${t.hair}"/><circle cx="141.5" cy="99" r="3.6" fill="${t.hair}"/>
    <g data-layer="crown">
      <path d="M138 74C149 60 160 51 178 48C168 57 158 66 143 78Z" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".7"/>
      <path d="M142 75C152 64 162 56 175 50" stroke="#cfc3a2" stroke-width=".6" fill="none"/>
      <path d="M103 80C104 67 114 60 125 60C136 60 145 66 147 78Z" fill="${t.light}"/>
      <ellipse cx="125" cy="79" rx="24" ry="5.5" fill="${t.robe}" stroke="url(#goldB)" stroke-width="1.4"/>
      <circle cx="140" cy="76" r="3" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".5"/>
    </g>
    <g data-layer="shield">
      <path d="M68 118h32v19c0 13-9 21-16 25c-7-4-16-12-16-25Z" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.2"/>
      <path d="M72 122h24v15c0 10-6 16-12 19c-6-3-12-9-12-19Z" fill="none" stroke="${t.robe}" stroke-width=".8"/>
      ${suitUse(suit, 75.5, 127, 17)}
    </g>
    ${halberd()}`;
}

function filigree() {
  const corner = `<path d="M50 70C50 58 56 50 68 50M50 60C53 56 56 55 58 50M57 70c0-6 3-10 9-10" stroke="url(#goldB)" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="50" cy="72.5" r="1.6" fill="#c9a24a"/><circle cx="70.5" cy="50" r="1.6" fill="#c9a24a"/>`;
  return `<g data-layer="filigree">
    ${corner}
    <g transform="matrix(-1 0 0 1 250 0)">${corner}</g>
    <g transform="matrix(1 0 0 -1 0 350)">${corner}</g>
    <g transform="rotate(180 125 175)">${corner}</g>
  </g>`;
}

/** Full court body markup for rank 9 (J), 10 (Q) or 11 (K). */
export function courtBody(rank, suit) {
  const t = THEMES[suit];
  const half = rank === 11 ? king(suit, t) : rank === 10 ? queen(suit, t) : jack(suit, t);
  return `<g data-layer="base">
      <rect x="46" y="46" width="158" height="258" rx="5" fill="#fbf7ec"/>
      <rect x="46" y="46" width="158" height="258" rx="5" fill="url(#lattice)"/>
    </g>
    <g clip-path="url(#courtHalf)">${half}</g>
    <g transform="rotate(180 125 175)"><g clip-path="url(#courtHalf)">${half}</g></g>
    <path d="M46 175H204" stroke="url(#goldC)" stroke-width="1.6"/>
    <path d="M125 169l6 6-6 6-6-6Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".6"/>
    <rect x="46" y="46" width="158" height="258" rx="5" fill="none" stroke="url(#goldA)" stroke-width="2"/>
    <rect x="50" y="50" width="150" height="250" rx="3" fill="none" stroke="#c9a24a" stroke-width=".6"/>
    ${filigree()}`;
}
