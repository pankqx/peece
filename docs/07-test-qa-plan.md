# 07 — Test and QA Plan

## 1. Levels
| Level | Tool | Scope |
|-------|------|-------|
| Database | SQL DO-blocks in `supabase/99_tests.sql` (impersonating users via JWT claims) | money, fairness, permissions, concurrency |
| Unit | Vitest (optional, free) | card ranking, hand evaluator, hash check, formatters |
| Manual two-window | Chrome + a private window (or two browsers) | full flows |
| Mobile | A real phone on the Vercel preview URL | layout, performance |
| Accessibility | Lighthouse, keyboard-only pass, screen reader spot check | WCAG AA |
| Simulation | SQL or Node script, 100 000 rounds | balance and seat symmetry |

## 2. Money and fairness tests (must all pass before P5 UI work)

| ID | Test | Expected |
|----|------|----------|
| M-01 | Sum of all balances + escrow + admin wallet before and after any round | identical |
| M-02 | A bets 300, B bets 120 | stake 120, A refunded 180 |
| M-03 | Win payout, rake = floor(5% × profit) | ledger rows sum to zero |
| M-04 | Tie | both stakes refunded, rake 0 |
| M-05 | Call `lock_bet` 10 times quickly | one ledger row |
| M-06 | Call `submit_pick` twice, two tabs | one settlement |
| M-07 | Bet more than balance, 0, negative, null | rejected |
| M-08 | Loser at 0 tokens | `locked_until` ≈ now + 7 days; cannot create or join |
| M-09 | Admin `set_tokens` | balance updated, lockout cleared, audit row written |
| M-10 | Player without profile calls `lock_bet` | rejected |
| M-11 | Leave before deal | refund; after deal | forfeit |
| M-12 | Idle past deadline then `tick` twice | resolved once |

## 3. Privacy and permission tests

| ID | Test | Expected |
|----|------|----------|
| S-01 | B selects A's `round_hands` | 0 rows |
| S-02 | B selects `round_picks`, `round_secrets`, `ledger`, `admin_wallet` | denied or 0 rows |
| S-03 | Any `insert/update/delete` on any table from the client | denied |
| S-04 | `rpc('settle')`, `rpc('open_round')`, `rpc('move')`, `rpc('new_deck')` | permission denied |
| S-05 | `rpc('admin_set_tokens')` as a player | exception |
| S-06 | B reads `rounds` before both locked | no bet amounts |
| S-07 | Realtime sniff as B | no hand, pick, call or secret ever delivered |
| S-08 | Outsider reads a table's chat | 0 rows |
| S-09 | Chat `<img onerror=…>` | shown as text |
| S-10 | 25 chat messages in a minute | rejected after 20 |
| S-11 | Admin joins a table | rejected |
| S-12 | Verify the Omen hash after the round | matches |

## 4. Gameplay functional tests

| ID | Scenario | Expected |
|----|----------|----------|
| G-01 | Create table, copy link, join in window 2 | both see names; progress ring stops |
| G-02 | Third browser joins | "Table full" |
| G-03 | Wrong code | "No such table" |
| G-04 | Full Omen round with call right/wrong/none | power shifts correctly |
| G-05 | 2 vs Ace | 2 wins |
| G-06 | Same rank, different suits | ♠ > ♥ > ♦ > ♣ |
| G-07 | Refresh mid-bet, mid-pick, at reveal | state restored |
| G-08 | Close tab for 60 s, return at 30 s / 90 s | continues / forfeit applied |
| G-09 | Opponent leaves | opponent-left state, Wait/Leave |
| G-10 | All-in loss | lockout screen with countdown |
| G-11 | Rematch countdown | new round opens once |
| G-12 | Vingt: hit after stand / after bust | rejected |
| G-13 | Vingt: Lucky suit Ace values | 2 or 12 |
| G-14 | Throne: believe/call, true/false claim, each band | payouts per 02 §4 |
| G-15 | Showdown: all hand ranks, K-A-2 straight | evaluator correct |
| G-16 | Showdown: raise with insufficient tokens | raise disabled |

## 5. Hand-ranking unit table (Showdown, Deuce Supreme)
| Hand A | Hand B | Winner |
|--------|--------|--------|
| 7♠ 7♥ 7♦ | K♠ K♥ A♣ | A (Triple beats Pair) |
| 5♥ 6♥ 7♥ | 9♠ 9♥ 9♦ | B (Triple beats Straight flush? **No**: Straight flush beats Triple only if ranks as listed; verify against the order in 02 §5: Triple › Straight flush) |
| K♣ A♣ 2♣ | Q♠ K♠ A♠ | A (straight flush K-A-2 beats Q-K-A, 2 is top) |
| A♠ K♦ 4♣ | 2♥ 9♦ 8♣ | B (high card 2 is top) |
Use the first column as the definitive expected-value list and fix the doc if the evaluator disagrees.

## 6. Simulation targets
- Omen seat win rate 50% ± 0.5% over 100 000 random rounds (with random calls).
- Vingt: seat symmetry within 0.5%; bust rate for "stand at 17+" about 25–30%.
- Throne: always-believe vs always-call EV within ±5% of each other at stake 100.
- Showdown: pair-or-better 25–30%; triple ≈ 0.24%.

## 7. Performance and accessibility
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95.
- DevTools Performance: reveal sequence with zero frames over 50 ms on a mid-range phone profile (4× CPU throttle).
- Keyboard-only completes a full round and a chat message.
- `prefers-reduced-motion` on: no flames, bursts or flips; fades only.
- Color contrast verified for gold on midnight and ivory on felt.

## 8. Release checklist
- [ ] Supabase: Anonymous and Google providers on, admin UID set, SQL run in order, tests PASS
- [ ] No `service_role` key in repo, `.env` ignored, `.env.example` present
- [ ] Vercel env vars set, preview and production work
- [ ] CSP active, no console errors
- [ ] 99_tests.sql PASS again after the last SQL change
- [ ] Keep-alive action added
- [ ] README with screenshots, architecture, free-tier notes
- [ ] Two-window and phone test done, STATUS.md updated
