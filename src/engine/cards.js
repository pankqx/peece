// Card ids 0..51: suit = floor(id / 13) (0 ♠, 1 ♥, 2 ♦, 3 ♣); rankIndex = id % 13 (0 = "2" … 12 = "A").

export const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'];
export const SUIT_GLYPH = ['♠', '♥', '♦', '♣'];
export const SUIT_NAME = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const RANK_NAME = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];

export const suitOf = (id) => Math.floor(id / 13);
export const rankOf = (id) => id % 13;
export const cardId = (rank, suit) => suit * 13 + rank;
export const isRed = (id) => suitOf(id) === 1 || suitOf(id) === 2;

/** Suit strength for tie-breaks: ♠ 3 > ♥ 2 > ♦ 1 > ♣ 0. */
export const suitStrength = (suit) => 3 - suit;

export const cardName = (id) => `${RANK_NAME[rankOf(id)]} of ${SUIT_NAME[suitOf(id)]}`;
export const cardShort = (id) => `${RANKS[rankOf(id)]}${SUIT_GLYPH[suitOf(id)]}`;

/** Parse "Q♥" / "10s" / "Ah" into an id — handy in tests. */
export function parseCard(s) {
  const m = String(s).trim().match(/^(10|[2-9JQKA])([♠♥♦♣shdc])$/i);
  if (!m) throw new Error(`bad card ${s}`);
  const rank = RANKS.indexOf(m[1].toUpperCase());
  const suit = '♠♥♦♣'.includes(m[2]) ? '♠♥♦♣'.indexOf(m[2]) : 'shdc'.indexOf(m[2].toLowerCase());
  return cardId(rank, suit);
}

export const freshDeck = () => Array.from({ length: 52 }, (_, i) => i);
