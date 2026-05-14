import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const loginUser = mutation({
  args: {
    role: v.union(v.literal("staff"), v.literal("admin"), v.literal("super-admin")),
    username: v.optional(v.string()),
    password: v.optional(v.string()),
    pin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.role === "staff") {
      if (!args.pin) return { role: null, error: "PIN is required" };

      const user = await ctx.db
        .query("users")
        .withIndex("by_pin", (q) => q.eq("pin", args.pin))
        .unique();

      if (!user || user.role !== "staff") {
        return { role: null, error: "Invalid staff PIN" };
      }

      return { role: "staff", name: user.name };
    }

    if (!args.username || !args.password) {
      return { role: null, error: "Username and password are required" };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user || user.password !== args.password || user.role !== args.role) {
      return { role: null, error: "Invalid credentials" };
    }

    return { role: user.role, name: user.name };
  },
});