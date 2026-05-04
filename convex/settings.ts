import { query } from "./_generated/server";

export const getSettings = query({
  handler: async (ctx) => {
    // This fetches the first (and only) settings document
    return await ctx.db.query("settings").first();
  },
});