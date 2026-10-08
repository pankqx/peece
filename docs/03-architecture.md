# 03 — Architecture

## 1. Stack (free only)

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Vite + vanilla JS (ES modules) + CSS | GSAP for animation, no framework |
| Backend | Supabase Free: Postgres, Row Level Security, Realtime, Auth | Replaces Firebase (D1): server functions are needed to hide the Omen and deal fairly |
| Auth | Anonymous sign-in (players), Google (admin) | |
| Hosting | Vercel Hobby, static build | No Node server |
| Source | GitHub | |
| Fonts | Google Fonts: Cormorant Garamond (display), Inter (UI) | With system fallbacks |

## 2. System diagram

```
                    ┌──────────────────────────────┐
                    │          Browser (SPA)       │
                    │  Vite build, vanilla JS      │
                    │  ┌────────┐ ┌─────────────┐  │
                    │  │ UI /   │ │ Card SVG +  │  │
                    │  │ router │ │ GSAP + audio│  │
                    │  └───┬────┘ └─────────────┘  │
                    │      │ supabase-js (anon key)│
                    └──────┼───────────────────────┘
          static assets    │ HTTPS / WebSocket
   ┌────────────┐          │
   │  Vercel    │          ▼
   │  (CDN)     │   ┌───────────────────────────────────────┐
   └────────────┘   │               Supabase                │
                    │  Auth ── anonymous + Google (admin)   │
                    │                                       │
                    │  PostgREST ── SELECT only, via RLS    │
                    │  RPC functions (SECURITY DEFINER):    │
                    │     create_table, join_table,         │
                    │     lock_bet, submit_pick, ...        │
                    │     settle (row-locked, idempotent)   │
                    │                                       │
                    │  Tables: profiles, game_tables,       │
                    │   rounds, round_hands, round_picks*,  │
                    │   round_secrets*, ledger*, chat ...   │
                    │   (* = no browser read, admin only)   │
                    │                                       │
                    │  Realtime ── change feed filtered by  │
                    │   RLS (only public tables published)  │
                    └───────────────────────────────────────┘
```

The browser can **read** what RLS allows and **call** the listed RPC functions. It can never insert, update or delete a table directly.

## 3. Data flow of one Omen round

```
A: create_table() ─► code ABCD            B: join_table('ABCD')
                          └── open_round: seal Omen, publish hash
A: lock_bet(300)   B: lock_bet(120)  ──► stake=120, excess refunded
                          └── deck shuffled, 5+5 cards into round_hands
A: submit_pick(i,call)  B: submit_pick(j,call)
                          └── settle(): lock row, compare, ledger, payout
Realtime pushes rounds row (status=done, cards, omen revealed)
Both clients animate flip → winner burst → chips fly → countdown
next_round() ─► new round
```

## 4. Data model (target, after Phase 1 fixes)

| Table | Key columns | Who can read |
|-------|-------------|--------------|
| profiles | id, name, tokens ≥ 0, locked_until, muted, last_seen | all signed-in users |
| admin_wallet | id=1, tokens | admin |
| game_tables | code, game, p1, p2, status, round_id, created_at | seated players, admin |
| rounds | id, code, game, status, p1, p2, deadline, omen_commit, public result fields (cards, winner, pot, rake, omen reveal) | seated players, admin |
| round_stakes | round_id, user_id, locked bool, amount (**amount unreadable until both locked**) | see §6 |
| round_hands | round_id, user_id, cards int[] | owner only |
| round_picks | round_id, user_id, idx, call, action | nobody (admin RPC) |
| round_secrets | round_id, omen_suit, nonce | admin RPC only |
| ledger | id, round_id, kind, from_acct, to_acct, amount | admin |
| chat | id, code, user_id, body | seated players, admin |
| reports | id, code, reporter, last_msgs jsonb | admin |
| admin_audit | id, action, detail, at | admin |

> The uploaded schema stores `bet1`/`bet2` on `rounds`, which both players can read, so a blind bet would leak. §6 and doc 04 describe the fix.

Added columns for the new games: `game_tables.game` (`omen|vingt|throne|showdown`), `rounds.state jsonb` (public per-game state, e.g. lucky suit, who is on the Throne), `round_hands.cards` reused for every game, plus a generic `round_picks.action text`.

## 5. RPC contract (the only write path)

| Function | Caller | Does |
|----------|--------|------|
| ensure_profile(name) | player | Create or rename profile |
| create_table(game) | player | New table, 4-letter code |
| join_table(code) | player | Take seat 2, open the first round |
| leave_table(code) | player | Refund or forfeit per 02 §1.5, free the seat |
| lock_bet(code, amount) | player | Escrow bet; when both locked, fix stake, deal |
| submit_pick(code, idx, call) | player | Omen pick/call, settles when both in |
| vingt_hit / vingt_stand(code) | player | Vingt Duel actions |
| throne_claim(code, idx, band) / throne_answer(code, call) | player | Liar's Throne |
| showdown_decide(code, action) / showdown_answer(code, action) | player | Three-Card Showdown |
| next_round(code) | player | Open next round after `done` |
| tick(code) | player | Apply timeouts and presence rules once |
| send_chat(code, msg) / react(code, emoji) | player | Chat with rate limit; reactions broadcast |
| report_chat(code) | player | Save last 20 messages for admin |
| admin_* | admin | omen, set_tokens, mute, ledger views, reconcile; all audited |

Each function: validates caller, phase and amounts, takes a row lock, checks `status`, writes the ledger in the same transaction, and is a no-op when called twice.

## 6. Hiding blind bets and picks

- `round_stakes` has a RLS policy `user_id = auth.uid()`, so you read only your own stake. Both clients learn "opponent locked" from the public boolean on `rounds` (`p1_locked`, `p2_locked`).
- After both lock, the stake is public through `rounds.stake`; the unequal original bets are revealed in the result (nice drama beat) once the round is `done`.
- `round_picks` has no policy; reveal data is copied onto `rounds` at settlement.

## 7. Realtime strategy

- Subscribe per table to: `rounds` (filter `code=eq.X`), `chat` (filter `code`), `game_tables` (filter `code`), your own `round_hands` row.
- Reactions use a Realtime **broadcast** channel (no database writes, no storage cost); rate-limited on the client and by Supabase.
- Presence (who is online) uses a Realtime presence channel keyed by table code.
- On reconnect: fetch current `game_tables`, `rounds`, `round_hands`, last 50 chat rows, then resubscribe; call `tick(code)`.
- Never rely on realtime alone for correctness; the database is the truth, realtime is a nudge.

## 8. Frontend structure (Vite)

```
peece/
├─ index.html
├─ vite.config.js
├─ package.json
├─ .env.example               # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_HINT
├─ AGENTS.md  STATUS.md  README.md
├─ docs/                      # these documents
├─ supabase/
│  ├─ 01_schema.sql           # tables, RLS
│  ├─ 02_functions.sql        # shared helpers + settle
│  ├─ 03_game_omen.sql
│  ├─ 04_game_vingt.sql  05_game_throne.sql  06_game_showdown.sql
│  └─ 99_tests.sql            # self-checks
├─ public/
│  └─ favicon.svg  crown-mark.svg
└─ src/
   ├─ main.js                 # boot, router
   ├─ config.js               # reads import.meta.env
   ├─ api/
   │  ├─ supabase.js          # client
   │  ├─ auth.js  tables.js  rounds.js  chat.js  admin.js
   ├─ state/store.js          # tiny observable store
   ├─ ui/
   │  ├─ screens/ loader.js lobby.js table.js howto.js lockout.js admin.js
   │  ├─ components/ chips.js betPanel.js chatPanel.js reactions.js toast.js progressRing.js
   │  └─ games/ omen.js vingt.js throne.js showdown.js   # one UI module per game
   ├─ cards/
   │  ├─ deck.js              # id → {rank, suit}
   │  ├─ renderCard.js        # SVG builder
   │  ├─ courts.js  pips.js  aceSpades.js  back.js
   │  └─ tilt.js
   ├─ fx/
   │  ├─ fire.js (canvas flames)  burst.js  chipsFly.js  countUp.js
   ├─ audio/synth.js         # WebAudio only
   └─ styles/
      ├─ tokens.css base.css cards.css table.css chat.css loader.css admin.css
```

## 9. Routing
Hash or `history` router with: `/` (lobby), `/t/CODE` or `?t=CODE` (table), `/how-to-play`, `/admin` (not linked, guarded). Vercel `vercel.json` rewrites everything to `index.html`.

## 10. State and rendering
- One tiny store (`state/store.js`): `session`, `profile`, `table`, `round`, `hand`, `chat`, `ui`.
- Screens are functions `mount(root)` / `unmount()`; they subscribe to the store and update only changed DOM nodes.
- All user text is set via `textContent`. No `innerHTML` with user data.

## 11. Technology risks and fallbacks
| Risk | Fallback |
|------|----------|
| Anonymous auth blocked on free plan | Use email-less magic "device id" via signInAnonymously alternative: edge-less username + signed local secret is **not** acceptable; escalate and switch to free email OTP |
| Realtime rate limits | Poll `rounds` every 2 s while a round is active |
| Canvas fire too heavy on phones | Cap particles by `navigator.hardwareConcurrency` and fall back to CSS flame |
