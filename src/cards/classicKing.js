// A traditional-pattern King of Spades (the classic printed-deck look: red, blue, yellow and
// black ink outlines on white). Returned as a standalone SVG string so it can be rasterised
// into a WebGL texture for the burning loader. Text uses system serif fonts (no web fonts
// inside an <img>-loaded SVG).
import { SUIT_PATHS } from './sprite.js';

const INK = '#141414';
const RED = '#c4122f';
const BLUE = '#1d4f9e';
const YEL = '#f2c12e';
const SKIN = '#fbeedd';
const S = `stroke="${INK}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"`;

const spade = (x, y, s, fill = INK) => `<path d="${SUIT_PATHS[0]}" transform="translate(${x} ${y}) scale(${s / 100})" fill="${fill}"/>`;

function dots(xs, y, r, fill) {
  return xs.map((x) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${S} stroke-width=".8"/>`).join('');
}

function half() {
  // Ermine-like white trims with black tails along the robe edges.
  const tails = [
    [60, 156],
    [68, 147],
    [78, 140],
    [178, 140],
    [188, 147],
    [196, 156],
  ]
    .map(([x, y]) => `<path d="M${x} ${y}c-1.4 2.6-1.4 4.6 0 6.4c1.4-1.8 1.4-3.8 0-6.4Z" fill="${INK}"/>`)
    .join('');
  // Chequered band on the blue tunic.
  let cheq = '';
  for (let i = 0; i < 6; i++) cheq += `<rect x="${121 + (i % 2) * 5}" y="${144 + i * 5}" width="5" height="5" fill="${i % 2 ? INK : YEL}"/>`;
  // Zigzag on the collar.
  let zig = 'M98 133';
  for (let i = 0; i < 12; i++) zig += ` L${101 + i * 5} ${i % 2 ? 133 : 138}`;

  return `
  <!-- sword blade raised behind the King -->
  <path d="M62 40 L68 45 L77 128 L70 129 Z" fill="#e9ecef" ${S}/>
  <path d="M65.5 45 L73.5 127" stroke="${INK}" stroke-width=".7"/>
  <!-- robe -->
  <path d="M36 175 L36 148 C50 134 80 128 104 126 L152 126 C176 128 206 134 214 148 L214 175 Z" fill="${RED}" ${S}/>
  ${dots([58, 70, 186, 198], 166, 2.6, YEL)}
  ${dots([64, 192], 158, 2, YEL)}
  <path d="M36 148 C50 134 80 128 104 126 L106 133 C84 136 58 142 44 158 L36 160 Z" fill="#fff" ${S}/>
  <path d="M214 148 C200 134 176 128 152 126 L150 133 C172 136 198 142 206 158 L214 160 Z" fill="#fff" ${S}/>
  ${tails}
  <path d="M104 128 L152 128 L160 175 L96 175 Z" fill="${BLUE}" ${S}/>
  <path d="M108 140 L100 175 M148 140 L156 175" stroke="${YEL}" stroke-width="2.2"/>
  ${cheq}
  <rect x="121" y="144" width="10" height="30" fill="none" ${S} stroke-width=".9"/>
  <!-- hilt and gripping hand -->
  <rect x="55" y="125" width="38" height="7" rx="3" fill="${YEL}" ${S} transform="rotate(-6 74 128)"/>
  <circle cx="56" cy="130.5" r="3.3" fill="${RED}" ${S} stroke-width=".9"/>
  <circle cx="92.5" cy="126.4" r="3.3" fill="${RED}" ${S} stroke-width=".9"/>
  <path d="M66 140 C62 134 66 130 74 131 C82 132 86 137 84 143 C82 149 72 149 66 140 Z" fill="${SKIN}" ${S}/>
  <path d="M71 134 C73 137 75 139 79 139 M69 137 C71 141 73 143 77 143" stroke="${INK}" stroke-width=".8" fill="none"/>
  <!-- collar -->
  <path d="M94 133 C108 145 148 145 162 133 C156 123 100 123 94 133 Z" fill="${YEL}" ${S}/>
  <path d="${zig}" fill="none" stroke="${INK}" stroke-width=".9"/>
  <!-- neck -->
  <path d="M120 112 L136 112 L138 126 L118 126 Z" fill="${SKIN}" ${S}/>
  <!-- hair curls -->
  ${[
    [111, 84],
    [109, 95],
    [110, 106],
    [149, 84],
    [151, 95],
    [150, 106],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.2" fill="${YEL}" ${S} stroke-width="1"/><path d="M${x - 2.6} ${y}a2.6 2.6 0 1 1 2.6 2.6" fill="none" stroke="${INK}" stroke-width=".7"/>`)
    .join('')}
  <!-- face, three-quarter to the left -->
  <path d="M114 84 C114 74 121 69 130 69 C140 69 147 76 147 88 C147 101 141 111 131 113 C121 113 114 103 114 92 Z" fill="${SKIN}" ${S}/>
  <path d="M117 86 q5 -3 9 0 M133 86 q5 -3 9 0" fill="none" stroke="${INK}" stroke-width="1.2"/>
  <path d="M118 91 q4 -2.6 8 0 q-4 2 -8 0Z M134 91 q4 -2.6 8 0 q-4 2 -8 0Z" fill="#fff" stroke="${INK}" stroke-width=".9"/>
  <circle cx="120.6" cy="91" r="1.4" fill="${INK}"/><circle cx="136.6" cy="91" r="1.4" fill="${INK}"/>
  <path d="M129 91 C128 96 125 100 126 102 C127 103.5 130 103 131 102" fill="none" stroke="${INK}" stroke-width="1"/>
  <!-- moustache and beard -->
  <path d="M130 105 C126 103 119 104 114 109 C120 108 125 109 130 108 C135 109 140 108 146 109 C141 104 134 103 130 105 Z" fill="${YEL}" ${S} stroke-width="1"/>
  <path d="M115 100 C115 117 121 128 130 133 C139 128 145 117 145 100 C142 110 137 113 130 113 C123 113 118 110 115 100 Z" fill="${YEL}" ${S}/>
  <path d="M120 112 q1 6 4 11 M126 114 q0 7 2 13 M134 114 q0 7 -2 13 M140 112 q-1 6 -4 11" fill="none" stroke="${INK}" stroke-width=".8"/>
  <path d="M126 110 q4 2 8 0" fill="none" stroke="${RED}" stroke-width="1.6"/>
  <!-- crown -->
  <path d="M112 66 C114 52 146 52 148 66 Z" fill="${RED}" ${S}/>
  <path d="M110 68 L107 50 L117 58 L123 44 L130 55 L137 44 L143 58 L153 50 L150 68 Z" fill="${YEL}" ${S}/>
  ${dots([107, 123, 137, 153], 50, 2.4, '#fff').replace(/cy="50"/g, 'cy="50"')}
  <path d="M130 34 v9 M126 38 h8" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M130 34 v9 M126 38 h8" stroke="${YEL}" stroke-width="1.6" stroke-linecap="round"/>
  <rect x="109" y="66" width="42" height="9" rx="1.5" fill="${YEL}" ${S}/>
  <circle cx="130" cy="70.5" r="3" fill="${RED}" ${S} stroke-width=".9"/>
  <rect x="116" y="68" width="5" height="5" fill="${BLUE}" ${S} stroke-width=".8" transform="rotate(45 118.5 70.5)"/>
  <rect x="139" y="68" width="5" height="5" fill="${BLUE}" ${S} stroke-width=".8" transform="rotate(45 141.5 70.5)"/>
  <!-- suit symbol in the frame corner -->
  ${spade(186, 46, 18)}`;
}

/** Full card SVG (250 × 350 viewBox) rendered at `scale` for crisp textures. */
export function classicKingSvg(scale = 3) {
  const w = 250 * scale;
  const hgt = 350 * scale;
  const corner = `<text x="25" y="50" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="38" fill="${INK}">K</text>${spade(15.5, 56, 19)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${hgt}" viewBox="0 0 250 350">
  <defs>
    <clipPath id="half"><rect x="38" y="40" width="174" height="135"/></clipPath>
    <linearGradient id="paperG" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#f4efe2"/></linearGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .3 0 0 0 0 .25 0 0 0 0 .2 0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  </defs>
  <rect width="250" height="350" rx="14" fill="url(#paperG)"/>
  <rect width="250" height="350" rx="14" fill="#fff" filter="url(#grain)"/>
  <rect x="38" y="40" width="174" height="270" fill="#fff"/>
  <g clip-path="url(#half)">${half()}</g>
  <g transform="rotate(180 125 175)"><g clip-path="url(#half)">${half()}</g></g>
  <path d="M38 175 H212" stroke="${INK}" stroke-width="1.4"/>
  <rect x="38" y="40" width="174" height="270" fill="none" stroke="${INK}" stroke-width="1.6"/>
  <rect x="35" y="37" width="180" height="276" fill="none" stroke="${INK}" stroke-width=".6"/>
  ${corner}
  <g transform="rotate(180 125 175)">${corner}</g>
  <rect x=".5" y=".5" width="249" height="349" rx="13.5" fill="none" stroke="#cfc6b0" stroke-width="1"/>
</svg>`;
}
