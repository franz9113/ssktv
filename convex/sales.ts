import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save Entry
export const recordSale = mutation({
  args: {
    roomName: v.string(),
    roomCharge: v.number(),
    foodCharge: v.number(),
    totalAmount: v.number(),
    duration: v.number(),
    paymentMethod: v.string(),
    completedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sales", args);
  },
});

// "Sales History" tab
export const getSalesHistory = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("sales")
      .order("desc") // Newest sales first
      .collect();
  },
});