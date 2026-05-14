import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all staff for the settings list
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Create a new user
export const createUser = mutation({
  args: {
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("super-admin")),
    status: v.string(),
    pin: v.optional(v.string()),
    username: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      name: args.name,
      role: args.role,
      status: args.status,
      pin: args.pin,
      username: args.username,
      password: args.password,
    });
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("super-admin")),
    status: v.string(),
    pin: v.optional(v.string()),
    username: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      role: args.role,
      status: args.status,
      pin: args.pin,
      username: args.username,
      password: args.password,
    });
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const loginAdmin = query({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (user && user.password === args.password) {
      return user;
    }
    return null;
  },
});
export const loginStaff = query({
  args: { pin: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_pin", (q) => q.eq("pin", args.pin))
      .unique();
    return user || null;
  },
});