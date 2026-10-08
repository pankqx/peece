# STATUS

Living hand-off file. Updated with every commit so work can resume from any point.

**Mode chosen:** offline "vs the House" (no Supabase). Hosting: GitHub Pages (Actions) + vercel.json.
**Decisions:** all defaults D1–D12 from docs/00-INDEX.md (stake = lower bet, 5% rake on profit, ties refund, 7-day lockout).

## Done
- P0 Foundation — Vite, hash router, store, tokens, base CSS, toast, vercel.json, Pages workflow
- P1 Engine — `src/engine/*` (rng, cards, seal, bank, games/omen|vingt|throne|showdown, rivals) + `tests/engine.test.js` (31 passing)
- P2 Cards — `src/cards/*` (sprite, pips, courts, aceSpades, back, crown, renderCard, tilt), `/#/dev/cards`
- P3 Loader — `src/fx/fire.js`, `src/ui/screens/loader.js`, `src/styles/loader.css`

## Next (exact)
1. P4 Foyer (lobby): name, rival picker (3 rivals), game picker (4 games), balance, lockout screen, header with mute
2. P5 Table + The Omen: table shell, bet panel, sealed-shoe seal UI, reveal, payout, rematch
3. P6 Chat with the rival (banter engine) + emoji reactions
4. P7 Motion (GSAP) + WebAudio synth; P8 How to Play; P9 Treasury console (#/treasury)
5. P10–P12 Vingt, Throne, Showdown UIs (engines already exist and are tested)
6. P13 README, a11y pass, screenshots

## Notes
- Git identity: Pankaj <pankqx@gmail.com>, no co-author trailers.
- GitHub Pages must be enabled once: repo Settings → Pages → Source: GitHub Actions.
