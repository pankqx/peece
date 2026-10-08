# PEECE — Documentation Index

PEECE is a play-money, real-time, two-player card-duel lounge (midnight + emerald felt, antique gold, ivory). Tokens have no cash value. Formerly "Royal Clash".

## Document map

| # | File | Purpose |
|---|------|---------|
| 00 | 00-INDEX.md | This map, glossary, decision log, how to work phase by phase |
| 01 | 01-requirements.md | Vision, personas, user stories, functional and non-functional requirements, constraints, assumptions |
| 02 | 02-game-design.md | Shared mechanics, money flow, and the 4 games (rules, state machines, edge cases) |
| 03 | 03-architecture.md | Stack, system diagram, data model, API (RPC) list, realtime strategy, folder structure |
| 04 | 04-security-fairness.md | Threat model, fairness proofs, RLS rules, audit of the existing schema (bugs found) |
| 05 | 05-design-system.md | Visual language, tokens, typography, SVG card spec, motion, sound, screens, a11y |
| 06 | 06-phases-roadmap.md | 14 build phases, each sized for one session, with paste-ready prompts and done-criteria |
| 07 | 07-test-qa-plan.md | Test matrix, race-condition tests, release checklist |
| 08 | 08-free-tier-ops.md | Free-tier limits, deployment, env vars, runbook |
| — | AGENTS.md | Rules any AI agent must follow in this repo (drop in repo root) |
| — | STATUS.md | Living hand-off file, updated at the end of every phase |

## Glossary

- **Token**: fun money, no cash value. Everyone starts with 1000.
- **Table**: a room with a 4-letter code, 2 seats.
- **Round**: one bet-to-payout cycle.
- **Escrow**: tokens held by the house between bet lock and payout.
- **Rake**: 5% of the pot, rounded down, paid to the admin wallet.
- **Omen**: server-secret suit drawn before each Omen round; only its hash is public until reveal.
- **RPC**: a database function the browser may call; the only way to change anything.
- **Commit–reveal**: publish a hash of a secret first, reveal the secret later so anyone can verify nothing changed.

## Decision log (confirm or change these before Phase 1)

| ID | Decision | Default I am assuming | Why |
|----|----------|----------------------|-----|
| D1 | Backend | **Supabase free** (Postgres + RLS + Realtime + Auth) | Firebase Spark has no server code, so the Omen and dealing could not be hidden. Your schema already uses Supabase. |
| D2 | Payout size | **Stake = the lower of the two bets; any excess is refunded.** Pot = 2 × stake. Winner gets pot − 5% rake, loser loses stake. | Stops a 10-token player winning 1000 from a 1000 bet, matches your prototype rule ("winner gains the lower bet"). Your schema currently pays the whole pot; Phase 1 changes it. |
| D3 | Rake on ties | No rake, both stakes refunded | Matches DESIGN.md |
| D4 | Admin plays? | Never. Admin UID cannot sit at a table | Admin sees secrets |
| D5 | Frontend | Vite + vanilla JS + CSS + GSAP | Your original brief |
| D6 | Hosting | Vercel Hobby (static) | Your original brief |
| D7 | Games shipped | 4: The Omen (flagship), Vingt Duel, Liar's Throne, Three-Card Showdown | See 02 |
| D8 | Lockout | 0 tokens = 7-day lock, admin can restore | Your rule |
| D9 | Disconnect | 60 s grace, then forfeit-refund (see 02 §4) | Prevents stuck escrow |
| D10 | Language | English only for v1 | Scope |
| D11 | Rake base | 5% of the **winner's profit** (floor). Your DESIGN.md says 5% of the pot, which costs equal-stake winners 10% of winnings | Fairer; one-line change if you prefer pot-based |
| D12 | Lockout evasion | Accepted for v1 (anonymous accounts); optional Google-link later | See 04 §6 |

## How to work in phases (token-exhaustion protocol)

1. One phase = one chat session. Never start a second phase in the same session unless the first finished with room to spare.
2. Start each session by uploading: `AGENTS.md`, `STATUS.md`, and only the docs the phase prompt lists. Do not upload everything.
3. Paste the phase prompt from `06-phases-roadmap.md` verbatim.
4. End each session by asking: "Update STATUS.md with what was finished, files changed, open bugs, and the exact next step." Save the new STATUS.md into the repo.
5. If a session is running out of room, stop and ask for the STATUS.md update first; code can be resumed, lost context cannot.
6. Keep files small (under about 250 lines) so any one can be re-uploaded cheaply.

## Template for STATUS.md

```
# STATUS
Last phase completed: P_
Date: 
Files created/changed:
Decisions made:
Open bugs:
Next step (exact):
Env/setup done: (Supabase project, auth providers, schema run, Vercel)
```
