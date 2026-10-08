// Card back (docs/05 §4.5): navy field, gold lattice, crown crest, ivory-gold border.
import { crownPath } from './crown.js';

export function backBody() {
  return `<rect width="250" height="350" rx="14" fill="#fbf7ec"/>
    <rect x="6" y="6" width="238" height="338" rx="10" fill="url(#goldA)"/>
    <rect x="9" y="9" width="232" height="332" rx="8" fill="url(#navyG)"/>
    <rect x="9" y="9" width="232" height="332" rx="8" fill="url(#backLattice)"/>
    <rect x="20" y="20" width="210" height="310" rx="6" fill="none" stroke="url(#goldA)" stroke-width="1.4"/>
    <rect x="25" y="25" width="200" height="300" rx="4" fill="none" stroke="#c9a24a" stroke-width=".6" opacity=".7"/>
    <circle cx="125" cy="175" r="54" fill="#0a1220" stroke="url(#goldA)" stroke-width="2.2"/>
    <circle cx="125" cy="175" r="47" fill="none" stroke="#c9a24a" stroke-width=".7" opacity=".8"/>
    ${[...Array(16)].map((_, i) => `<circle cx="${(125 + Math.cos((i / 16) * Math.PI * 2) * 50.5).toFixed(1)}" cy="${(175 + Math.sin((i / 16) * Math.PI * 2) * 50.5).toFixed(1)}" r="1.2" fill="#e2c36b"/>`).join('')}
    <g transform="translate(125 172) scale(1.15) translate(-32 -34)">${crownPath('url(#goldA)')}</g>
    ${[[34, 34], [216, 34], [34, 316], [216, 316]].map(([x, y]) => `<path d="M${x} ${y - 7}l7 7-7 7-7-7Z" fill="url(#goldA)"/>`).join('')}`;
}
