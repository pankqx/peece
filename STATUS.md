# STATUS

Living hand-off file. Updated with every commit so work can resume from any point.

**Mode chosen:** offline "vs the House" (no Supabase). Hosting: GitHub Pages (Actions) + vercel.json.
**Decisions:** all defaults D1–D12 from docs/00-INDEX.md (stake = lower bet, 5% rake on profit, ties refund, 7-day lockout).

## Done
- P0 Foundation — Vite, hash router, store, tokens, base CSS, toast, vercel.json, Pages workflow
- P1 Engine — `src/engine/*` (rng, cards, seal, bank, games/omen|vingt|throne|showdown, rivals) + `tests/engine.test.js` (31 passing)
- P2 Cards — `src/cards/*` (sprite, pips, courts, aceSpades, back, crown, renderCard, tilt), `/#/dev/cards`
- P3 Loader — `src/fx/fire.js`, `src/ui/screens/loader.js`, `src/styles/loader.css`

- P4 Foyer — `src/ui/screens/lobby.js`, header, art (emblems + rival portraits), lockout
- P5 Table + The Omen — `src/ui/screens/table.js` (round loop), `src/ui/games/omen.js`, bet panel, timer ring
- P6 Chat — `src/ui/components/chat.js`, `src/engine/banter.js`, emoji reactions
- P7 FX/sound — `src/fx/chips.js`, `src/fx/burst.js`, `src/audio/synth.js` (Web Animations API instead of GSAP)
- P10–P12 — `src/ui/games/vingt.js`, `throne.js`, `showdown.js` — all verified by automated play

- P8 How to Play — `src/ui/screens/howto.js`
- P9 Treasury — `src/ui/screens/treasury.js` (reconciliation, ledger, round verify, audited controls)
- P13 README + screenshots in `docs/screenshots/`
- Loader v2 — `src/cards/classicKing.js` (traditional-pattern King of Spades) burned by a WebGL shader in `src/fx/burnGL.js`; canvas fire (`src/fx/fire.js`) is the fallback. No paid assets used.

## Next (ideas, optional)
1. Online two-player mode with Supabase (spec in docs/03, docs/04) reusing `src/engine/*`
2. Lighthouse pass on the deployed site; per-rival head-to-head stats in the Foyer

## Notes
- Git identity: Pankaj <pankqx@gmail.com>, no co-author trailers.
- GitHub Pages must be enabled once: repo Settings → Pages → Source: GitHub Actions.
