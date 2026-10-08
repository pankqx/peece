# 06 — Phased Build Roadmap

Rule: **one phase per chat session**. Each phase lists what to upload, a paste-ready prompt, deliverables and a "done when" checklist. End every session with the STATUS.md update (see 00-INDEX).

```
P0 Setup ► P1 Database ► P2 Cards ► P3 Loader ► P4 Lobby+Auth ► P5 Omen game ► P6 Chat
        ► P7 Motion+Sound ► P8 How to Play ► P9 Admin ► P10 Vingt ► P11 Throne ► P12 Showdown ► P13 Harden+Ship
```
MVP (playable and shareable) is complete after **P6**. Everything after is polish and extra games.

Size guide: S ≈ 1 short session, M ≈ 1 normal session, L ≈ may need splitting in two (a/b).

---

## P0 — Project foundation (S)
**Upload**: AGENTS.md, STATUS.md, 03-architecture.md, 05-design-system.md (§2–3 only)
**Prompt**: "Phase P0 of PEECE. Create the Vite vanilla-JS project exactly per 03 §8: package.json, vite.config.js, index.html, vercel.json (04 §8), .env.example, src/main.js with a hash/history router and a store, tokens.css, base.css, config.js, a toast component, and empty screen modules that render a placeholder. No game code."
**Deliverables**: runnable `npm run dev` skeleton, README stub.
**Done when**: app loads, routes `/`, `/t/ABCD`, `/how-to-play`, `/admin` render placeholders; fonts load; no console errors.

## P1 — Database, security and fixes (L, split a/b)
**Upload**: AGENTS.md, STATUS.md, 02 (§1 only), 03 (§4–6), 04 (all), peece-schema.sql
**Prompt a**: "Phase P1a. Rewrite peece-schema.sql into supabase/01_schema.sql and 02_functions.sql applying every fix in 04 §5 (findings 1–13, 15, 16, 18) and decisions D2 and D11: stake = min bet with refund, rake on profit, ties refund, leave_table, tick with deadlines, round_stakes table, revoke on internal functions, search_path including extensions. Output full SQL, plus a short list of what changed."
**Prompt b**: "Phase P1b. Add supabase/99_tests.sql: plain SQL DO-blocks simulating two users (use set_config('request.jwt.claims') to impersonate) that test: balance conservation, double lock_bet, tie refund, stake refund, lockout at 0, forbidden calls to settle/open_round, hand privacy, blind bet privacy. Also write a Supabase setup checklist."
**Done when**: SQL runs without errors in the Supabase SQL editor; all tests print PASS; sum(balances)+escrow+admin equals minted.

## P2 — SVG card system (L, split a/b)
**Upload**: AGENTS.md, STATUS.md, 05 (§4), the old royal-clash.html (to reuse any good card code)
**Prompt a**: "Phase P2a. Build src/cards/: deck.js, renderCard.js, pips.js, back.js, aceSpades.js and cards.css. Number cards 2–10 with classic pip layouts, ivory paper with grain, double gold border, corner indices, ARIA labels, symbol-based reuse. Create a dev page /dev/cards showing all 52 + back at three sizes."
**Prompt b**: "Phase P2b. Build src/cards/courts.js: King, Queen, Jack for all four suits using the named layers in 05 §4.3 (base, robe, ermine, crown, face, prop, filigree), richly detailed but geometric. Add tilt.js (parallax tilt + moving sheen). Show them large on /dev/cards for review."
**Done when**: all 52 cards look crisp at 60 px and 600 px; courts approved by you; tilt is smooth.

## P3 — Brand and loader (M)
**Upload**: AGENTS.md, STATUS.md, 05 (§1, §5), the King of Spades output from P2b
**Prompt**: "Phase P3. Build the crown logo SVG and favicon, the burning King of Spades loader (canvas flames in 3 layers, embers, heat shimmer filter, wordmark ignition, gold progress ring, skip button, reduced-motion and low-end fallbacks) per 05 §5."
**Done when**: 60 fps on desktop, graceful on phone, skip works, once per session.

## P4 — Lobby, auth and tables (M)
**Upload**: AGENTS.md, STATUS.md, 03 (§5, §7), 01 (FR-01..FR-16), supabase 01/02 files (list of RPCs only)
**Prompt**: "Phase P4. Implement api/supabase.js, auth.js (anonymous sign-in, name), tables.js (create/join/leave RPC wrappers), the Lobby screen (premium design per 05 §8), game picker (4 games, only Omen enabled), waiting screen with progress ring, copy-invite toast, ?t=CODE auto-join, Table full / No such table states, lockout screen."
**Done when**: two browser windows can create and join the same table and both see each other's names.

## P5 — The Omen gameplay (L, split a/b)
**Upload**: AGENTS.md, STATUS.md, 02 (§1–2), 03 (§3, §6, §7), 05 (§4.6, §6, §8)
**Prompt a**: "Phase P5a. Build src/api/rounds.js and src/ui/games/omen.js: bet panel (chips, slider, All-in), hand display, secret pick, call-suit selector, realtime subscription to rounds/round_hands, reconnect recovery, sealed envelope UI with hash. Plain styling first, correct behaviour."
**Prompt b**: "Phase P5b. Add reveal sequence (suspense, flip, win/lose), payout summary, Omen unseal with browser hash verification, auto rematch countdown, opponent-left state, timers display, ARIA live announcements."
**Done when**: a full round plays end to end between two windows; refresh mid-round restores state; balances match the ledger.

## P6 — Chat and reactions (M)
**Upload**: AGENTS.md, STATUS.md, 01 (§4.5), 04 (§4), 05 (§8 layout)
**Prompt**: "Phase P6. Build chatPanel (right rail desktop, bottom sheet mobile, unread badge), send_chat wrapper with client-side throttle, system messages, typing indicator via presence, emoji quick reactions via Realtime broadcast floating over the table, report button. Render text with textContent only."
**Done when**: messages arrive in under 1 s, reactions float for both players, flooding is rejected, no HTML renders.
**MVP milestone: deploy to Vercel and test with a friend.**

## P7 — Motion, effects and sound (L)
**Upload**: AGENTS.md, STATUS.md, 05 (§6, §7, §11)
**Prompt**: "Phase P7. Add GSAP timelines for deal fan/arc, hover tilt, select glow, 3D flip with suspense beat, winner golden burst, loser fade, flying chips with count-up, screen transitions; synth.js WebAudio sounds with persisted mute; honour prefers-reduced-motion; keep 60 fps (transform/opacity only)."
**Done when**: Performance panel shows no long frames during a reveal on a mid phone; reduced-motion mode verified.

## P8 — How to Play (S)
**Upload**: AGENTS.md, STATUS.md, 02 (§7 and the rules of Omen)
**Prompt**: "Phase P8. Build the How to Play screen: 3-step illustrated carousel (SVG illustrations using real card components), per-game rule tabs (Omen now, others marked coming soon), money-flow footer, lockout and play-money notice. Keyboard and swipe operable."

## P9 — Admin console (M)
**Upload**: AGENTS.md, STATUS.md, 01 (§4.7), 04 (§9), supabase function list
**Prompt**: "Phase P9. Build /admin with Google sign-in, players table, set tokens and clear lockout, mute, admin wallet, ledger viewer with filters, round inspector showing the secret Omen (via admin_omen, audited), audit log, and the reconciliation panel (FR-66). Add the needed admin_* SQL if missing."
**Done when**: a non-admin cannot read anything (test it), admin sees everything, every action is audited.

## P10 — Game 2: Vingt Duel (M)
**Upload**: AGENTS.md, STATUS.md, 02 (§1, §3), supabase 02 (helpers), omen.js (as the pattern)
**Prompt**: "Phase P10. Add supabase/04_game_vingt.sql (vingt_hit, vingt_stand, settlement incl. Lucky suit, Five-Card Charlie, ties) and src/ui/games/vingt.js. Enable it in the game picker, add to How to Play, add SQL tests."

## P11 — Game 3: Liar's Throne (M)
**Prompt**: "Phase P11. Add supabase/05_game_throne.sql (throne_claim, throne_answer, band payouts, timeouts) and src/ui/games/throne.js with the throne role UI and claim picker. Enable in picker, How to Play, tests."

## P12 — Game 4: Three-Card Showdown (M)
**Prompt**: "Phase P12. Add supabase/06_game_showdown.sql (hand evaluator in Deuce Supreme order, decide/answer, raise escrow) and src/ui/games/showdown.js. Enable in picker, How to Play, tests including a hand-ranking table test."

## P13 — Hardening, QA and launch (M)
**Upload**: AGENTS.md, STATUS.md, 04 (§10), 07, 08
**Prompt**: "Phase P13. Run through 07 test matrix, fix bugs, add Lighthouse/a11y pass, finalise vercel.json CSP, add the keep-alive GitHub Action, write README (features, stack, ASCII architecture, screenshot placeholders, free-tier section, beginner setup guide for Supabase + GitHub + Vercel + two-window test)."

---

## Dependency rules
- P5 needs P1, P2, P4. P6 needs P4. P7 needs P5. P9 needs P1. P10–P12 need P5 and P8's structure.
- You can reorder P3, P8 and P9 freely after P6.
- Never skip P1b: security tests are what protects your money flow.

## Estimated checkpoints
| Milestone | After | What you can show |
|-----------|-------|-------------------|
| Look and feel | P3 | Cards and the burning King loader |
| Playable | P5 | Two players, full round |
| MVP | P6 | Chat + reactions, deployed |
| Award polish | P8 | Animations, sound, How to Play |
| Complete | P13 | 4 games, admin, README |

## If a session runs out early
Ask: "Stop coding. Update STATUS.md: files finished, files half-done (list function names), exact next step." Start the next session with that STATUS.md and the half-done files only.
