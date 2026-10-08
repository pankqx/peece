# 01 — Requirements (Gathering and Specification)

## 1. Vision

A portfolio-grade, award-level web app where two friends meet at a private "members' lounge" table and duel with cards for play-money tokens, chatting live. It must feel luxurious (midnight/emerald/gold/ivory), be fair by construction (the browser can never deal, resolve or move tokens), and cost nothing to run.

**Success looks like**: two people on two phones open a link, play a full round with chat and animations, and the owner can inspect any round as admin, all on free tiers with no card on file.

## 2. Stakeholders and personas

| Persona | Needs |
|---------|-------|
| Player (anonymous guest) | No signup, enter a name, create/join by code or link, feel the luxury, trust the game is fair |
| Friend joining by link | One tap to join, instantly understand rules |
| Admin (owner) | See all players, balances, lockouts, ledger, admin wallet, secret Omen per round, restore tokens, mute players |
| Recruiter / reviewer | Clear README, live demo, clean code, architecture diagram |

## 3. Scope

**In scope**: 4 two-player games, chat, reactions, How to Play, loader, admin page, sound, animations, docs.
**Out of scope (v1)**: real money, payments, more than 2 players per table, spectators, native apps, accounts with email, matchmaking queue, tournaments, i18n.

## 4. Functional requirements

IDs are used in the roadmap and tests. Priority: M = must, S = should, C = could.

### 4.1 Identity and sessions
- FR-01 (M) Anonymous sign-in on first visit; display name 2–14 chars, stored in profile.
- FR-02 (M) Session survives refresh; reconnect returns the player to their table and phase.
- FR-03 (M) Admin signs in with Google; only the configured UID gets admin rights.
- FR-04 (S) Player can change their name between rounds.

### 4.2 Tables and lobby
- FR-10 (M) Create a table: returns a 4-letter code (no I or O) and a shareable link `?t=CODE`.
- FR-11 (M) Join by typing the code or opening the link.
- FR-12 (M) Third person sees "Table full". Unknown code sees "No such table".
- FR-13 (M) Creator picks the game (Omen, Vingt, Liar's Throne, Showdown) at table creation; can change it between rounds if both agree (S).
- FR-14 (M) "Copy invite link" button with a toast.
- FR-15 (M) Waiting state with a thin gold progress ring until the opponent joins.
- FR-16 (M) Leave table at any time; opponent sees an "opponent left" state and can wait or leave.

### 4.3 Tokens and bets
- FR-20 (M) Everyone starts with 1000 tokens.
- FR-21 (M) Blind bet via chips, slider and All-in; min 1, max current balance; hidden from the opponent until both are locked.
- FR-22 (M) Bets move into escrow immediately on lock (see 02 §3).
- FR-23 (M) Winner receives pot − 5% rake (floor); rake goes to the admin wallet; loser loses stake; tie refunds both.
- FR-24 (M) Balance reaching 0 sets a 7-day lockout; locked players cannot create/join tables and see a lockout screen with a countdown.
- FR-25 (M) Every token movement is a double-entry ledger row.
- FR-26 (S) Player sees their own recent history (last 20 rounds).

### 4.4 Gameplay
- FR-30 (M) Server shuffles and deals; each player reads only their own cards.
- FR-31 (M) Picks are secret until both exist; reveal is simultaneous.
- FR-32 (M) Ranking rule shared by card games: A high, but a 2 beats an Ace; ties by suit ♠ > ♥ > ♦ > ♣.
- FR-33 (M) Auto-rematch with a visible countdown (default 6 s); either player can pause the rematch by leaving.
- FR-34 (M) Each of the 4 games implements its own rules from 02, driven by a server-side state machine.
- FR-35 (M) Omen game: sealed Omen with published hash, revealed and verifiable after the round.
- FR-36 (S) "Verify" button recomputes the hash in the browser and shows a green seal.

### 4.5 Chat and reactions (primary interface)
- FR-40 (M) Live chat inside the table; right rail on desktop, bottom sheet on mobile.
- FR-41 (M) Only the two seated players can read/write; admin can read.
- FR-42 (M) 300-char cap, 1 msg/s, 20 msg/min, rendered as text only.
- FR-43 (M) Emoji quick reactions float up over the table for both players.
- FR-44 (S) System messages ("Ayaan locked a bet", "Round revealed").
- FR-45 (S) Typing indicator; unread badge on mobile.
- FR-46 (C) Report button that stores the last 20 messages for admin review.
- FR-47 (M) Admin can mute a player.

### 4.6 Presentation
- FR-50 (M) Loading screen: burning King of Spades, PEECE logo igniting.
- FR-51 (M) Custom crown logo mark, also the favicon.
- FR-52 (M) SVG cards (full 52 + back), court cards with layered art, ceremonial Ace of Spades.
- FR-53 (M) Deal, hover tilt, selection glow, 3D flip, win burst, loser fade, flying chips with count-up.
- FR-54 (M) WebAudio-only sounds with a persistent mute toggle.
- FR-55 (M) How to Play carousel (3 steps + per-game rules), reachable from lobby and table.
- FR-56 (M) Premium lobby / empty state.

### 4.7 Admin
- FR-60 (M) Hidden `/admin` route (not linked), Google auth, UID check on the server.
- FR-61 (M) List players: name, tokens, lockout, muted, last seen.
- FR-62 (M) Set tokens / clear lockout (audited).
- FR-63 (M) View admin wallet and full ledger with filters.
- FR-64 (M) View the secret Omen for any round (audited).
- FR-65 (S) View recent rounds with full reveal data; mute/unmute.
- FR-66 (S) Reconciliation panel: sum of all balances + escrow + admin wallet equals total ever minted.

## 5. Non-functional requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Cost | Zero cost, no credit card on any service |
| NFR-02 | Fairness | No client-side randomness, dealing, resolution or balance writes |
| NFR-03 | Security | RLS on every table, execute grants minimal, rate limits, text-only chat rendering, CSP headers |
| NFR-04 | Performance | 60 fps animations, first load under 250 KB JS gzipped (excluding fonts), LCP under 2.5 s on 4G |
| NFR-05 | Realtime | Opponent action visible in under 1 s typical |
| NFR-06 | Reliability | Idempotent settlement: double click, retry, or reconnect never pays twice |
| NFR-07 | Accessibility | WCAG AA contrast, keyboard operable, ARIA labels on cards, `prefers-reduced-motion` respected |
| NFR-08 | Responsive | Mobile-first, playable on 360 × 640 portrait |
| NFR-09 | Maintainability | Files under about 250 lines, commented, no framework, readable by a student |
| NFR-10 | Browser | Latest Chrome, Safari, Firefox, Edge; iOS Safari 16+ |
| NFR-11 | Privacy | No emails or real names stored for players; admin email lives only in Supabase Auth |
| NFR-12 | Observability | Admin audit log for every privileged action |

## 6. Constraints

- Free tiers only (Supabase Free, Vercel Hobby, GitHub). No Node server.
- No heavy frameworks. GSAP allowed.
- Secrets only in env vars; only public `VITE_*` values in the browser; the Supabase anon key is public by design, so safety comes from RLS.
- One AI session has limited output; work is split into phases (06).

## 7. Assumptions

- Players trust each other enough to play on honest devices; cheating on the server side is what we prevent.
- Supabase Anonymous Sign-ins is available on the free plan.
- Expected load: tens of concurrent tables, not thousands.

## 8. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Supabase free project pauses after inactivity | Demo is down | Weekly keep-alive ping (GitHub Action cron), documented in 08 |
| Realtime leaks hidden data | Cheating | Never put secrets in realtime-published tables; test with a second user (07) |
| Stuck escrow when a player vanishes | Tokens lost | Forfeit/refund rules and a server sweep (02 §4) |
| AI session runs out mid-build | Lost context | Phases + STATUS.md |
| Heavy animations hurt phones | Jank | Canvas budgets, `will-change`, reduced-motion path |
| Anonymous accounts abused to farm tokens | Meaningless, play money | Accept for v1; optional per-IP limits later |

## 9. Open questions for you

1. Confirm D1–D10 in the decision log (especially D2, the payout size).
2. Do you want a player leaderboard (public) in v1? Default: no.
3. Should the loading screen play every visit or once per session? Default: once per session, skippable.
4. Hosting domain: default `peece.vercel.app` style subdomain.
