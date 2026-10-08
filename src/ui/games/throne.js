// Placeholder until this game's UI lands: resolves the round as a tie (stakes refunded).
export async function play(ctx) {
  ctx.setBanner('This game is being built — stakes returned', 'muted');
  await ctx.wait(800);
  return { winner: null, profit: 0, headline: 'Coming soon' };
}
