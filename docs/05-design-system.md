# 05 — Design System and Art Direction

Mood: a private members' lounge after midnight. Restrained, tactile, warm gold on deep green and midnight blue, ivory paper. Never garish: gold is an accent, not a fill.

## 1. Brand
- **Name**: PEECE (always uppercase in the logo, "Peece" in running text).
- **Mark**: a crown whose three points are formed by a spade, a heart-shaped jewel and a diamond; a small band below. Single-colour gold with a subtle gradient; also used as favicon (`favicon.svg`, 32 × 32 simplified version).
- **Wordmark**: Cormorant Garamond 600, letter-spacing 0.35em, gold gradient fill, thin hairline underline that "ignites" on load.
- **Voice**: calm, formal, slightly playful. "Take a seat." "The envelope is sealed." "Your opponent has left the table."

## 2. Design tokens (CSS custom properties, `tokens.css`)

```
--midnight-950: #05080f;   --midnight-900: #0a1220;   --midnight-800: #0f1c33;
--emerald-900:  #052e22;   --emerald-700: #0b4a37;    --emerald-500: #14805c;
--gold-300: #f1dc9a;  --gold-400: #e2c36b;  --gold-500: #c9a24a;  --gold-700: #8a6a24;
--ivory-50: #fbf7ec;  --ivory-100: #f3ecd8; --ivory-300: #d9cfb3;
--ruby: #a3202e;  --ink: #14110c;   --danger: #e5484d;  --ok: #3fb68b;
--gold-grad: linear-gradient(135deg,#f6e3a3 0%,#d8b45a 35%,#a8832f 60%,#f1dc9a 100%);
--felt: radial-gradient(120% 90% at 50% 30%, #0f6a4c 0%, #0b4a37 45%, #052e22 100%);
--radius-s: 8px; --radius-m: 14px; --radius-l: 22px;
--shadow-1: 0 1px 2px rgb(0 0 0/.4), 0 4px 12px rgb(0 0 0/.25);
--shadow-2: 0 2px 4px rgb(0 0 0/.45), 0 12px 32px rgb(0 0 0/.35);
--ease-out: cubic-bezier(.16,1,.3,1);   --ease-spring: cubic-bezier(.34,1.56,.64,1);
--dur-1: 120ms; --dur-2: 240ms; --dur-3: 480ms; --dur-4: 900ms;
```
Contrast: ivory text on midnight ≥ 12:1, gold-400 on midnight ≥ 8:1, ink on ivory ≥ 14:1. Red suits use `--ruby`, black suits `--ink`.

## 3. Typography
- Display: **Cormorant Garamond** (600/700) for logo, headings, card indices.
- UI: **Inter** (400/500/600) for buttons, chat, labels, numbers (tabular figures for tokens).
- Fallbacks: `Georgia, serif` and `system-ui, sans-serif`. `font-display: swap`.
- Scale: 12, 14, 16, 20, 28, 40, 64 px, with fluid `clamp()` for headings.

## 4. Card system (SVG only)

### 4.1 Geometry
- viewBox `0 0 250 350`, corner radius 14, rendered at any size, `shape-rendering: geometricPrecision`.
- Layers (all `<g>` with ids): `base` (ivory paper + grain filter), `frame` (double gold border: 2 px outer, 0.75 px inner, 10 px apart), `indices` (rank + suit at two corners, the lower rotated 180°), `body` (pips or court art), `sheen` (a moving linear gradient mask).
- Paper grain: `feTurbulence` baseFrequency 0.8, opacity 0.06, blended multiply.
- Gold: `linearGradient` ids `goldA` (frame), `goldB` (ornaments).

### 4.2 Number cards (2–10)
Classic pip layouts on a 3-column grid; pips in the lower half rotated 180°. Pip sizes 38 px (2–10), centre pips slightly larger on 3, 5, 9. Layout tables live in `pips.js` (coordinates as percentages of the body box).

### 4.3 Court cards (named layers: `base`, `robe`, `ermine`, `crown`, `face`, `prop`, `filigree`)
- **King**: double-ended half-figure, crown with pearls and cross, ermine-trimmed mantle with black tails, beard flourish, sceptre (hearts, diamonds) or sword (spades, clubs); suit emblem in a chest medallion. Filigree border corners.
- **Queen**: veiled crown with jewels, long hair and soft collar, rose (hearts), fan (diamonds), sceptre flower (spades, clubs); jewelled necklace; finer filigree.
- **Jack**: plumed cap, halberd/staff, diagonal sash, heraldic shield carrying the suit.
- Suit colour themes for the courts: ♠ midnight + gold, ♥ ruby + gold, ♦ amber + gold, ♣ emerald + gold, all on the same ivory base.
- Art is built from simple geometric shapes (paths, circles, rounded rects) so it stays crisp and file size stays small; each court is a function `court(rank, suit)` returning layers.

### 4.4 Ace of Spades (ceremonial)
Large central spade inside an engraved medallion ring (rotating text-on-path "PEECE · EST · MMXXVI ·"), 24 radiating rays, laurel arcs, small fleurons in the corners.

### 4.5 Card back
Navy field, gold geometric lattice (rotated squares + circles), central crest with the crown mark, 6 px ivory-gold border. Subtle repeating pattern defined once in `<defs>` and reused.

### 4.6 Interaction
- Hover: lift 14 px, scale 1.04, shadow expands; pointer-driven tilt (max ±12° with perspective 900 px); sheen position follows the pointer.
- Selected: rises 28 px with a gold outer glow pulse (box-shadow + SVG filter), checkmark seal below.
- Disabled: 55% desaturated.
- Each card has `role="img"` and `aria-label="Queen of Hearts"`; in hand it is a `button` with `aria-pressed`.

## 5. Loading screen ("The King burns")
1. Fade from black, the King of Spades centred at 62% viewport height.
2. Canvas flames layered behind and in front: 3 flame layers (back, mid, front) using noise-driven bezier tongues, additive blending (`lighter`), colour ramp deep red → orange → gold → pale yellow at tips.
3. Embers: up to 80 particles, rising, flickering, fading; wind sway via sine.
4. Heat shimmer: SVG `feTurbulence` + `feDisplacementMap` applied to the card, animated `baseFrequency`.
5. Card edge glows; the paper chars progressively at the edges (CSS mask grows) but the card never fully burns.
6. The PEECE wordmark ignites: letters light up left to right, gold gradient sweep, soft glow, hairline underline draws.
7. Progress: a thin gold ring around the crown mark fills with real asset-loading progress.
8. After assets are ready and at least 2.2 s have passed: the flames flare, a gold flash, and the screen dissolves to the lobby. "Skip" is available after 1 s; shown once per session.
9. Performance budget: canvas 30–60 fps, particle counts scale with device; fallback to a CSS-only flame and 2 s duration on low-end devices or `prefers-reduced-motion` (static card, fade only).

## 6. Motion language
| Moment | Animation | Duration / ease |
|--------|-----------|-----------------|
| Screen change | cross-fade + 16 px rise | 480 ms, ease-out |
| Deal | cards fly from deck in an arc, fan out | 90 ms stagger, 600 ms each, spring |
| Hover | lift + tilt | 240 ms |
| Select | rise + glow | 360 ms spring |
| Both picked | felt dims, a 700 ms suspense beat with a low pulse | 700 ms |
| Reveal | 3D Y-axis flip, midpoint swap of face | 700 ms, staggered 250 ms |
| Win | card ignites: golden radial burst + 60 particles + shine sweep | 1.2 s |
| Lose | desaturate, drop 12 px, fade to 40% | 600 ms |
| Tokens | chips (SVG discs) fly along a curve from loser to winner and to admin (small stream); amounts count up | 1.1 s |
| Reaction emoji | floats up with wobble, fades | 2.4 s |
| Toast | slides from top, auto-dismiss | 2.2 s |
| Seal (Omen) | wax envelope cracks open on reveal | 800 ms |

Rules: animate only `transform` and `opacity`; use GSAP timelines with labels; kill timelines on unmount; honour `prefers-reduced-motion` by replacing motion with fades and skipping particles.

## 7. Sound (WebAudio only, no files)
| Event | Synthesis |
|-------|-----------|
| Deal | short filtered noise burst (card slide) × 5, pitch rising slightly |
| Select | soft sine tick, 880 Hz, 60 ms |
| Flip | noise whoosh + low thump |
| Chip | two quick high triangle pings, random micro-detune |
| Win | major arpeggio (C–E–G–C) with soft bell envelope |
| Lose | descending minor second, muted |
| Seal crack | noise crackle + low tone |
| Chat | tiny 1.2 kHz blip |
Master gain 0.25; mute toggle in the header; state in `localStorage`; the audio context starts after the first user gesture.

## 8. Screens

| Screen | Key elements |
|--------|--------------|
| Loader | See §5 |
| Lobby ("The Foyer") | Logo, name input, four game cards (emblem, pitch, difficulty), Create table, Join code field, How to Play link, mute toggle, token balance chip. Premium empty state with a faint card-fan illustration |
| Waiting | Table code in large letters, invite link button with toast, progress ring, hint "Share this code" |
| Table | Felt oval, opponent top (name, token chip, status), player bottom, centre pot with chips, phase banner, chat rail |
| Bet panel | Chip row (10 / 50 / 100 / 500), slider, All-in, "Lock bet" with confirmation shimmer |
| Hand | 5 cards fanned, tap to select, "Confirm" button; call-suit selector (Omen) as four suit buttons |
| Reveal | Both cards centre-stage, suspense, flip, burst/fade, payout summary with chips and count-up, Omen unseal + "Sealed fairly" |
| Rematch | Ring countdown 6 → 0, "Leave table" |
| Opponent left | Empty seat silhouette, Wait / Leave |
| Lockout | Dark overlay, padlock, countdown "Back at the table in 6d 23h", note "Only the house can restore tokens" |
| How to Play | 3-step illustrated carousel + per-game tabs |
| Admin | Players table, ledger, wallet, round inspector with Omen, audit log |

### Layout
- Mobile portrait (360 × 640): top bar (logo, tokens, mute), opponent, centre table, hand at the bottom, chat as a bottom sheet with a floating button and unread badge.
- Tablet/desktop: table centre, chat as a right rail (320 px), hand overlap tightened.
- Safe areas (`env(safe-area-inset-*)`) respected; no hover-only features.

## 9. Components
Buttons (primary gold, ghost, danger), chip, token pill, toast, modal, tabs, slider, progress ring, seal, tooltip. Every button: hover shimmer sweep, active press scale 0.97, focus ring 2 px `--gold-300` with 3 px offset.

## 10. Accessibility
- Full keyboard: Tab through cards, Space/Enter select, Arrow keys move within the hand, Esc closes sheets.
- `aria-live="polite"` region announcing phase changes ("Your opponent locked a bet", "You won 114 tokens").
- Colour never the only signal: suits have glyphs and names in labels.
- Reduced motion path for every animation; audio off by default until first interaction and always muteable.
- Minimum tap target 44 × 44 px.

## 11. Performance budget
- JS ≤ 250 KB gzip (GSAP ≈ 25 KB core), CSS ≤ 40 KB, no raster images, fonts ≤ 2 weights per family.
- Card SVGs generated once into `<symbol>`s and referenced with `<use>`.
- Canvas effects stop when the tab is hidden (`visibilitychange`).
