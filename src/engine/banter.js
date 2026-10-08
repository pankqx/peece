// What the rivals say. Each line is plain text (rendered with textContent).
import { pick, chance } from './rng.js';

const LINES = {
  marquis: {
    greet: ['Good evening. Shall we keep it civil?', 'Sit. The cards do not care who we are.', 'Ah, a new account to balance. Welcome.'],
    lock: ['My figure is set.', 'Locked. Your move, as they say.', 'Sealed and sensible.'],
    bigBet: ['A bold number. I have noted it.', 'You bet like someone who has not read the ledger.'],
    think: ['One moment. Arithmetic.', 'Considering the probabilities…', 'Hm.'],
    win: ['As the numbers foretold.', 'The ledger favours patience.', 'A small, tidy profit. Thank you.'],
    lose: ['Well played. I shall revise my model.', 'An outlier. They happen.', 'Hm. Noted.'],
    tie: ['A balanced book. How satisfying.', 'Even. Nobody is poorer.'],
    omenRight: ['You read the Omen. Remarkable.'],
    caught: ['The numbers never lie. You, however…', 'Called. Your claim did not add up.'],
    fooled: ['I believed you. I shall not make that mistake twice.'],
    restored: ['The Treasury has kindly restored my purse. Shall we?'],
    idle: ['Take your time. Time is the only thing here that is free.', 'The clock is running, I am afraid.'],
  },
  countess: {
    greet: ['Darling! Finally, someone with nerve.', 'Sit, sit. Let us make this expensive.', 'I hope you brought more than pocket change.'],
    lock: ['Locked — and it is not small.', 'There. Try to keep up.', 'My bet is in, darling.'],
    bigBet: ['Now THAT is a bet. I adore you already.', 'Oh, you want to play properly. Delicious.'],
    think: ['Mm, choices…', 'Let me feel this one.', 'Hush, I am being brilliant.'],
    win: ['Fortune adores me. It always has.', 'Thank you, darling. Again?', 'Too easy. Raise the stakes next time.'],
    lose: ['Ugh. Lucky. Again — now.', 'Enjoy it while it lasts.', 'I let you have that one.'],
    tie: ['A draw? How dreadfully dull.', 'Nobody wins? Unbearable.'],
    omenRight: ['You called the Omen? Witchcraft.'],
    caught: ['Liar! I knew it from your face.', 'Caught you, sweetheart.'],
    fooled: ['You little fox. Well played.'],
    restored: ['The Treasury paid my bills again. Where were we?'],
    idle: ['Darling, I am aging over here.', 'Any decade now.'],
  },
  jester: {
    greet: ['Hello hello! Shall we be fools together?', 'A new victim — I mean, friend!', 'Hee hee. Pick a card, any card. No, not that one.'],
    lock: ['Bet locked! Or is it?', 'I bet… something. Ha!', 'Locked tight like my secrets.'],
    bigBet: ['Ooh, brave or bonkers? Both!', 'All those tokens! Are you sure? I would be.'],
    think: ['Eeny, meeny, miny…', 'Let the bells decide!', 'Thinking is overrated.'],
    win: ['Ha! The fool wins again!', 'Jingle jingle, your tokens are mine.', 'Did not see that coming, did you?'],
    lose: ['Oh no! Anyway…', 'Hee — that was on purpose. Probably.', 'Ouch! My bells!'],
    tie: ['A tie! Everybody gets a balloon.', 'Nobody wins? Everybody wins!'],
    omenRight: ['You guessed the Omen! Are you secretly a jester too?'],
    caught: ['Liar liar, robes on fire!', 'Gotcha! Takes one to know one.'],
    fooled: ['You fooled the fool! I respect it.'],
    restored: ['Broke again! The Treasury loves me. Again!'],
    idle: ['Tick tock, tick tock…', 'Are you napping? Can I nap too?'],
  },
};

const REPLIES = [
  [/\b(hi|hello|hey|evening|greetings)\b/i, { marquis: 'Good evening to you.', countess: 'Hello, darling.', jester: 'Hellooo!' }],
  [/\b(rig+ed|cheat|fair|scam)\b/i, { marquis: 'Every deck is sealed before you bet. Press Verify after the round — the hash will not lie.', countess: 'Rigged? Darling, check the seal. I win honestly.', jester: 'Cheat? Me? Check the seal, it is all in the hash!' }],
  [/\b(gg|good game|well played|wp)\b/i, { marquis: 'Likewise. A pleasure.', countess: 'You were adequate. That is a compliment.', jester: 'Good game, good game, GOOD game!' }],
  [/\b(bluff|liar|lying|lie)\b/i, { marquis: 'I rarely bluff. Rarely.', countess: 'Everyone bluffs, darling. The trick is doing it beautifully.', jester: 'I always bluff. Except when I do not.' }],
  [/\b(luck|lucky)\b/i, { marquis: 'Luck is variance with good marketing.', countess: 'Luck is just talent in a nice dress.', jester: 'Luck is my middle name! My first name is Lucky too.' }],
  [/\b(who are you|your name)\b/i, { marquis: 'Marquis Noir. I keep the books.', countess: 'Countess Rouge. You may have heard.', jester: 'The Jester! Obviously!' }],
  [/\b(thanks|thank you|ty)\b/i, { marquis: 'You are welcome.', countess: 'Of course.', jester: 'Any time, friend!' }],
  [/\?\s*$/, { marquis: 'An interesting question. Play, and find out.', countess: 'Questions, questions. Just play.', jester: 'Ask the cards! They know everything.' }],
];

const FALLBACK = {
  marquis: ['Indeed.', 'Quite.', 'Let us focus on the cards.'],
  countess: ['Mm-hm.', 'Charming. Now bet.', 'Talk is cheap, tokens are not.'],
  jester: ['Hee hee!', 'Ha! Yes! What?', 'Bells and whistles!'],
};

export function line(rival, event) {
  const set = LINES[rival]?.[event];
  return set ? pick(set) : null;
}

/** A reply to the player's chat message, or null to stay quiet. */
export function reply(rival, text) {
  for (const [re, by] of REPLIES) if (re.test(text)) return by[rival];
  return chance(0.55) ? pick(FALLBACK[rival]) : null;
}

/** Emoji the rival throws back on certain events. */
export const RIVAL_EMOJI = {
  win: { marquis: '🎩', countess: '💋', jester: '🤪' },
  lose: { marquis: '😐', countess: '😤', jester: '😵' },
  bigBet: { marquis: '🧐', countess: '🔥', jester: '😮' },
};
