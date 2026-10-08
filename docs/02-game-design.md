# 02 — Game Design

Four games share one table, one chat, one money flow and one engine. Players choose the game when creating the table. Only **The Omen** is the flagship; build it first (Phase 5), the others later (Phases 10–12) by reusing the same engine.

## 1. Shared foundations

### 1.1 Cards
- 52-card deck, integer ids `0..51`: `suit = id / 13` (0 ♠, 1 ♥, 2 ♦, 3 ♣), `rankIndex = id % 13` where 0 = rank 2 … 12 = Ace.
- Deck shuffled **on the server only**, Fisher–Yates with rejection sampling over a CSPRNG (`gen_random_bytes`).
- Suit order for tie-breaks: ♠ > ♥ > ♦ > ♣.
- **House rule "Deuce slays Ace"**: when two single cards meet, the higher rank wins, A is high, **but a 2 beats an Ace**. Games that need a total order (Showdown) use the "Deuce Supreme" variant described there.

### 1.2 Timers (server-enforced, no cron needed)
| Phase | Limit | If it expires |
|-------|-------|---------------|
| Bet | 60 s | Player who bet wins nothing, bet refunded; round cancelled. Both idle: round cancelled |
| Pick / action | 45 s | The idle player loses the round (opponent already acted); neither acted: cancelled and refunded |
| Rematch countdown | 6 s | Next round opens automatically |

Deadlines are stored in the round row. Any seated client calls `tick(code)` when a timer runs out and on reconnect; the function checks the clock on the server and applies the rule once (status-guarded). Three timeouts in a row marks that player "away" and pauses auto-rematch.

### 1.3 Money flow (double-entry ledger)

Every movement is one ledger row `from → to` and the balance update happens in the same transaction. No direct balance writes anywhere.

1. **Bet lock**: `player → escrow` for the amount typed.
2. **Stake fixing** (decision D2): when both bets are locked, `stake = min(bet1, bet2)`. The excess goes back `escrow → player` the same instant. Pot = 2 × stake.
3. **Win**: `rake = floor(profit × 5%)` where `profit` is what the winner takes from the loser. Winner receives own stake + (profit − rake). Rake goes `escrow → admin`.
4. **Tie / cancel**: both stakes refunded, no rake.
5. **Zero balance**: if a player's balance is 0 after settlement, `locked_until = now() + 7 days` in the same transaction.
6. **Rounding dust** goes to admin so the books always reconcile.

Worked example (Omen): both start at 1000. A bets 300, B bets 120, so stake = 120 and A gets 180 back (A 880, B 880, escrow 240). A wins: profit = 120, rake = floor(5% × 120) = 6. A receives 120 (own stake) + 114 = 234 and ends at 1114. B ends at 880. Admin wallet +6. Check: 1114 + 880 + 6 = 2000, nothing created or lost.

> If you prefer "winner takes the whole pot" (your schema today), change step 2 to keep both bets. Decision D1/D2 in the index.

### 1.4 Round lifecycle (all games)
`open → bet → deal → (game phases) → settle → done → countdown → open`
Every transition is a database function checking `round.status` under a row lock; a repeated call is a no-op.

### 1.5 Disconnect and leave
- Realtime presence shows "reconnecting…" after 5 s of silence.
- Leaving during `bet` or before any card is dealt: refund, table stays open for the other player.
- Leaving after cards are dealt: **forfeit**, the leaver loses the stake (rake applies), because the opponent already played on private information.
- Grace: a dropped player has 60 s to return before the forfeit applies.
- Opponent-left screen: "Your opponent left the table", buttons *Wait for someone* / *Leave*.

---

## 2. Game 1 — THE OMEN (flagship, bluff-sizing + suit call)

**Pitch**: A sealed envelope hides a secret suit. Bet blind, read your hand, optionally call the suit, pick one card. The Omen can turn a weak card into a winner.

### Rules
1. **Seal**: server draws the Omen suit (0–3) and a 128-bit nonce, publishes only `sha256(suit || nonce)`. The UI shows a wax-sealed envelope.
2. **Blind bet**: both lock a bet (hidden from each other). Stake fixed per 1.3.
3. **Deal**: 5 cards each, own hand visible, opponent shows backs.
4. **Call (optional)**: name a suit. Call is hidden until reveal.
5. **Pick** one card. When both picks exist, both cards flip together.
6. **Power**: rank (A high, Deuce slays Ace), then suit, then Omen shift: card played with a **right call = +1 rank** (max A), **wrong call = −1 rank** (min 2), no call = 0. Shift is applied before comparing. Equal power after shifts: higher suit wins; if the suits are also equal, **tie, refund**.
7. **Reveal**: Omen suit and nonce shown; the browser re-hashes and shows a green "Sealed fairly" check.

### State machine
`bet → pick → done` (+ `cancelled`). Hands are dealt at the moment the second bet lands.

### Why it is deep
- Bet sizing in the dark; reading whether the opponent over-bets.
- A call is +EV only if you believe the suit; bluffing a call to scare is free because it is hidden.
- A weak 2 can win by guessing the Omen (+1 to 3) but still loses to most cards, so calls are a gamble inside a gamble.

### Edge cases
- Both pick at the same millisecond: row lock serialises; second pick triggers settlement.
- A call with no pick or a pick with no call is legal.
- Admin may read the Omen via `admin_omen` (audited); players cannot, even through realtime.

---

## 3. Game 2 — VINGT DUEL (push-your-luck, twenty-one)

**Pitch**: Head-to-head twenty-one with hidden hands and a lucky suit. Every extra card is greed.

### Rules
1. Blind bet; stake fixed per 1.3.
2. **Lucky suit**: one card is flipped face up from the deck. Its suit is Lucky for both players this round.
3. Each player is dealt 2 hidden cards. Values: 2–10 face value, J Q K = 10, Ace = 1 or 11 (best fit), **a card of the Lucky suit is worth +1** (an Ace of the Lucky suit is 2 or 12).
4. Each player independently chooses **Hit** (draw from the shared server deck) or **Stand**, as often as they like up to 5 cards. Bust at over 21.
5. Reveal when both have stood or busted.
6. **Winner**: 21 or nearest below. A bust loses to a non-bust. **Five-Card Charlie** (5 cards, 21 or less) beats everything except a natural 21 (Ace + 10-value, 2 cards). Equal totals: fewer cards wins; still equal: **tie, refund**. Both bust: **tie, refund**.

### State machine
`bet → play (each player: drawing | stood | bust) → done`

### Edge cases
- Draws come from one server deck in the order requested, so two quick hits cannot duplicate a card.
- Hit after Stand or after bust is rejected by the server.
- Timer applies per player; an idle player auto-stands once (45 s), then the round resolves.

---

## 4. Game 3 — LIAR'S THRONE (bluff and call)

**Pitch**: One of you sits on the Throne and claims a card band. The other decides: believe or call the lie. Higher claims pay more and risk the same.

### Rules
1. Blind bet; stake fixed per 1.3. The Throne alternates each round (creator starts).
2. Each player is dealt 5 hidden cards.
3. **Throne player** secretly plays one card face down and declares a band:
   - LOW (2–6), MID (7–10), COURT (J Q K), ACE (Ace, **and the Deuce, because a 2 slays the Ace**; every 2 counts as ACE band).
4. A claim is true if the real band is **equal or higher** than claimed.
5. **Challenger** answers:
   - **Believe (fold)**: Throne player wins a share of the stake by band: LOW 10%, MID 25%, COURT 50%, ACE 75% (floor). Card is never revealed.
   - **Call**: card is flipped. Claim true → Throne wins the **full stake** from the challenger. Claim false → challenger wins the **full stake**.
6. Rake 5% (floor) of the profit. No ties exist.
7. Challenger may never see the played card unless they call.

### State machine
`bet → claim → answer → done`

### Edge cases
- Claim is a band, not a rank, so the server can validate it against the hidden card at call time only.
- A timed-out challenger counts as Believe; a timed-out Throne player forfeits the round with a LOW loss of 25% of stake (stops stalling).
- Role swap after each round; role is shown with a throne icon.

---

## 5. Game 4 — THREE-CARD SHOWDOWN (poker-lite with a raise)

**Pitch**: Three cards, one decision, a hand that can flip the table. Hold, raise, or fold.

### Rules
1. Blind bet (the ante); stake fixed per 1.3.
2. Each player is dealt 3 hidden cards.
3. **Deuce Supreme order** for this game only: `3 4 5 6 7 8 9 10 J Q K A 2` (the 2 is the top card, so there is a clean total order; no wraparound).
4. Hand ranks, high to low: **Triple** › **Straight flush** › **Flush** › **Straight** (three consecutive in the order above, e.g. K-A-2) › **Pair** › **High card**.
5. Both choose secretly and at once: **Hold**, **Raise** (lock an extra stake equal to the current stake, only if balance allows), or **Fold**.
6. Resolution of the choices:
   - Hold + Hold → showdown at the stake.
   - Raise + Raise → showdown at 2 × stake each.
   - Raise + Hold → the holder gets one more choice: **Call** (match the raise, showdown at 2 ×) or **Fold**.
   - Any Fold → the folder loses the stake they have in (folded stake only, not a raise they never matched) and the hand is never shown.
7. Showdown compares hand rank, then cards from high to low, then top-card suit (♠ › ♥ › ♦ › ♣); equal in every respect is impossible with a single deck except mirrored hands, which are a **tie, refund**.
8. Rake 5% (floor) of profit.

### State machine
`bet → decide → (answer, only on Raise+Hold) → done`

### Edge cases
- A raise needs tokens beyond the stake; if you have fewer, Raise is disabled and shows why.
- Excess tokens above the locked stake can be used for the raise; the server checks balance under a row lock.
- Straight evaluation is a lookup on positions in the order string, so it has no special cases.

---

## 6. Game selection UI
Four cards in the lobby, each with an emblem, a 1-line pitch, a "How to play" link, and a difficulty pip rating (Omen ●●●, Vingt ●●, Throne ●●●, Showdown ●●). The creator's choice is stored on the table row (`game text`) and shown in the table header.

## 7. How to Play content (Phase 8)
- A global 3-step illustrated carousel: **1 Bet** (blind, chips/slider/All-in) → **2 Read and call** → **3 Pick and flip**.
- Per-game rules sheet from sections 2–5, each ending with one worked example.
- Footer: money flow, "winner takes the pot minus 5%", lockout rule, play-money notice.

## 8. Balance sanity checks (to run in test phase)
- Simulate 100 000 Omen rounds with random plays: win rate for each seat must be 50% ± 0.5%.
- Vingt: dealer-less, so seat symmetry must hold; verify with the same simulation.
- Liar's Throne: expected value of always-believe vs always-call should be close to even across band mix; tune the band percentages if one strategy dominates.
- Showdown: pair-or-better frequency should be about 25–30% per hand.
