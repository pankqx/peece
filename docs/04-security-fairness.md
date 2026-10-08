# 04 — Security and Fairness

Principle: **the browser is hostile.** It sends intents (`lock_bet`, `submit_pick`) and displays what the database lets it read. Everything else happens in Postgres.

## 1. Threat model

| # | Threat | Attacker | Control |
|---|--------|----------|---------|
| T1 | Forge a balance or payout | Player editing JS / calling the API | No table write grants; balances only change inside RPC functions; `tokens >= 0` check; ledger rows in the same transaction |
| T2 | See the opponent's cards | Player reading API/realtime | RLS on `round_hands`: `user_id = auth.uid()` |
| T3 | See the opponent's blind bet or call | Player | Stakes and picks in tables with owner-only or no read policy; `rounds` carries only public flags until `done` |
| T4 | Predict the Omen or deck | Player with an algorithm | CSPRNG only (`gen_random_bytes`), rejection sampling, secrets never reach the browser, commit–reveal |
| T5 | Double payout | Double click, retry, reconnect, two tabs | Row lock + `status` guard in `settle`; idempotent RPCs |
| T6 | Call internal functions directly | Player | `revoke execute` from `authenticated` on internal helpers; grant only the public list |
| T7 | Chat injection / XSS | Player | `textContent` only, 300-char cap, no HTML/links/images, CSP |
| T8 | Chat spam / flooding | Player | Server rate limit 1/s and 20/min, admin mute |
| T9 | Read other tables' chat | Player | RLS `seated(code)` |
| T10 | Become admin | Anyone | Admin UID hard-set in the database function; Google auth; every admin RPC calls `is_admin()` |
| T11 | Admin abuse / peeking | Owner | Admin cannot be seated; every Omen view is written to `admin_audit` |
| T12 | Stall to hold the opponent hostage | Player | Server deadlines + `tick`, forfeit rules |
| T13 | Dodge a lockout | Player clearing storage | **Cannot be fully stopped** with anonymous auth, see §6 |
| T14 | Secret leak through the repo | Developer | Only public `VITE_*` values; no `service_role` key anywhere in the client or repo |
| T15 | Brute-force table codes | Player | Joining a code just seats you or says "Table full"; codes give no extra power; 24⁴ = 331 776 combinations, collisions retried |

## 2. Fairness by construction

### 2.1 Randomness
- All shuffles use `gen_random_bytes` (CSPRNG) with rejection sampling: draw a byte, discard values at or above the largest multiple of `n`, so no modulo bias.
- `Math.random()` is banned anywhere in game logic (cosmetic particles may use it; see AGENTS.md).
- A player cannot predict outputs because they never see the generator state, only the results of shuffles they cannot influence.

### 2.2 Commit–reveal (Omen)
1. Server picks `suit` and a 128-bit `nonce`.
2. Server publishes `commit = sha256(suit || ':' || nonce)` before any bet (use this exact text format so client and server hash the same bytes).
3. Suit and nonce are published at settlement; the browser recomputes the hash with Web Crypto and shows a "Sealed fairly" check.
4. Therefore the house cannot swap the Omen after seeing bets or picks.

### 2.3 Simultaneous reveal
Picks go into `round_picks`, which has **no read policy**. Only `settle` (server) reads them and writes the result to `rounds`. A player never sees the opponent's pick before their own is locked, because it is not readable by anyone.

### 2.4 Honest limits
- Whoever controls the database (you, and Supabase as the host) can in theory see or change anything. Commit–reveal only stops cheating **after** a hash is published.
- The admin can see the Omen by design; the audit log exists so that this power is visible.
- Anonymous accounts are cheap to create (see §6).

## 3. Row Level Security summary

| Table | Policy |
|-------|--------|
| profiles | select: all authenticated (names and play tokens are public) |
| game_tables | select: seated players, admin |
| rounds | select: seated players, admin; contains no secret before `done` |
| round_stakes | select: own row only |
| round_hands | select: own row only |
| round_picks, round_secrets | RLS on, **no policy** (unreadable) |
| ledger, admin_wallet, admin_audit, reports | select: admin only |
| chat | select: `seated(code)` or admin |

No `insert`, `update` or `delete` policy exists on any table. All writes go through `SECURITY DEFINER` functions with `set search_path`.

## 4. Chat security (at launch, not later)
- Members only (two seated players + admin read).
- Rendering with `textContent`; no markdown, links, images or HTML.
- Server limits: 300 chars, 1 message/second, 20/minute.
- Muted players cannot insert; admin mute is audited.
- Chat table never holds game data (hands, Omen).
- Report button stores the last 20 messages into `reports`.
- Retention: delete chat older than 7 days and chat of closed tables (§5 item 11).

## 5. Audit of the uploaded `peece-schema.sql`

I read it line by line. The design is sound (RLS read-only, RPC-only writes, row-locked settlement), but these must be fixed in Phase 1 before any UI is built.

| # | Severity | Finding | Fix |
|---|----------|---------|-----|
| 1 | **Blocker** | `lock_bet` has an extra `)` in `insert into round_hands values(...),(...));`, so the script fails to run | Remove the extra parenthesis |
| 2 | **High** | **Internal functions are callable by any user.** `revoke ... from public, anon` does not remove the explicit `authenticated` grants that Supabase adds by default, so `settle`, `open_round`, `move`, `rand_int`, `new_deck` stay callable | `revoke execute on all functions in schema public from public, anon, authenticated;` then grant only the public list; also `alter default privileges in schema public revoke execute on functions from anon, authenticated;` |
| 3 | **High** | **Blind bets leak.** `bet1` and `bet2` live on `rounds`, readable by both players and published by realtime | Move amounts to `round_stakes` (own-row policy), expose only `p1_locked`/`p2_locked` booleans and, after both lock, the final `stake` |
| 4 | **High** | **Free bets when no profile exists.** If `ensure_profile` was never called, `select ... into p` yields NULL, the `if` condition evaluates to NULL (not true), no exception, and the bet is recorded without deducting tokens | `if p.id is null then raise exception 'no profile'; end if;` and require a profile in `create_table`/`join_table` |
| 5 | Medium | **Ties are not handled.** `beats()` returns false on full equality, so seat 2 silently wins | Return a tri-state (`1/0/-1`); `0` refunds both stakes with no rake |
| 6 | Medium | **Payout ignores unequal bets** (pays the whole pot) | Apply decision D2: `stake = min(bet1, bet2)`, refund the excess |
| 7 | Medium | **No leave/forfeit/timeouts.** A vanished player leaves tokens in escrow forever and the seat taken | Add `leave_table`, deadlines on `rounds`, `tick()` (doc 02 §1.2) |
| 8 | Medium | **Table-code collision** (`insert` fails on duplicate) and **old chat reappears** for a new table that reuses a code | Retry loop in `create_table`; on table close delete its chat and tombstone the code for 24 h |
| 9 | Medium | **`next_round` does not check the opponent**: a locked or broke player stays seated and the other waits | In `next_round`, if a player is locked/0 tokens, mark seat "out" and show the lockout state |
| 10 | Medium | **Admin can sit at a table** and then see the opponent's play context | `create_table`/`join_table` reject `is_admin()` |
| 11 | Medium | **pgcrypto location.** On Supabase, extensions often live in the `extensions` schema; `set search_path=public` then breaks `gen_random_bytes`/`digest` ("function does not exist") | Create the extension in `extensions` and use `set search_path=public, extensions` in the functions that call it. Check on the first run |
| 12 | Low | `ensure_profile` accepts an empty or 1-char name | Enforce 2–14 chars, strip control characters |
| 13 | Low | Omen hash input `s||n` is ambiguous | Use `s::text || ':' || n` and document it |
| 14 | Low | Omen shift can leave equal power with equal suit → current code gives seat 2 the win | Covered by #5 (tie → refund) |
| 15 | Low | `settle` takes rake on the **whole pot**; DESIGN.md also says "5% of pot" | See decision D11 below |
| 16 | Info | `ADMIN_UID` is a placeholder inside a function; must be replaced before running | Keep it in one `app_config` table row set once, or in the function; never commit your real UID publicly if you prefer privacy (it is not a secret, but it is identifying) |
| 17 | Info | `profiles` readable by everyone | Accepted: play money. Don't add emails or real names to this table |
| 18 | Info | Concurrency of `submit_pick` | Verified safe under READ COMMITTED (the second transaction's settle sees the first pick after the row lock). Still take the round row lock **before** inserting a pick for clarity |

**D11 (rake base)**: DESIGN.md says rake = 5% of the pot; doc 02 says 5% of the profit (the winnings). On equal stakes, pot-based rake costs the winner 10% of their winnings, profit-based costs 5%. Default here: profit-based. Say so if you want pot-based; it is a one-line change.

## 6. The lockout limit (important, be honest in the README)

Players are anonymous. A locked-out player can clear browser storage, get a new anonymous account and a fresh 1000 tokens. **No free design can fully prevent this without identifying people.** Options:

| Option | Strength | Cost |
|--------|----------|------|
| Accept it (play money) | none | zero friction. Recommended for v1 |
| Remember the device with a long-lived cookie + localStorage flag | stops casual users | easy to bypass |
| Optional "Save my tokens with Google" link to a profile | permanent for those who link | extra step; Google account becomes the identity |
| Require Google to play | strong | removes the "no signup" promise |

v1 recommendation: accept + optional Google link in a later phase. Document that the lockout is a game rule enforced per account.

## 7. Abuse and rate limits
- Chat: see §4. Reactions: client throttle 4/s, broadcast only.
- RPC calls: Supabase default API limits; add per-user counters in `send_chat`, `create_table` (max 5 new tables / hour), `join_table` failures (max 20 / minute).
- Profile name: 2–14 chars.
- Table code: only A–Z without I and O.

## 8. Web hardening (Vercel `vercel.json`)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
    ]
  }]
}
```
`'unsafe-inline'` for styles is needed for dynamic SVG/GSAP inline styles; scripts stay strict.

## 9. Admin security
- Google sign-in, then the database checks `auth.uid()` against the single admin UID in every `admin_*` function and in admin-only RLS policies.
- The `/admin` route being hidden is cosmetic; the protection is server-side.
- Admin actions (set tokens, mute, view Omen) append to `admin_audit`.
- Admin can never be seated.
- Enable the Supabase **leaked-password and email confirmation** defaults; no password auth is used.

## 10. Security test checklist (run in Phase 13, see 07)
- Browser console: try `supabase.from('profiles').update(...)`, `.insert`, `.delete` on every table, expect permission errors.
- Call `rpc('settle')`, `rpc('open_round')`, `rpc('move')` as a player, expect "permission denied".
- With player B's token, select `round_hands` for A, expect no rows.
- With player B, select `rounds` before both locked, confirm no bet amounts.
- Subscribe to realtime as B and confirm no events carry A's hand or any secret.
- Double-click lock/pick 10 times, expect one ledger entry per event.
- Two tabs, one account: no double payout.
- Lock a profile to 0 tokens: confirm lockout and that admin restore works.
