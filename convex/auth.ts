import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const checkPassword = query({
  args: { password: v.string(), username: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("settings").first();
    
    if (!settings) return { role: null, error: "System not initialized" };

    if (args.username === settings.adminUsername && args.password === settings.adminPassword) {
      return { role: "admin" };
    }

    if (args.password === settings.staffPassword) {
      return { role: "staff" };
    }

    return { role: null };
  },
});