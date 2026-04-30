import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    rooms: defineTable({
    name: v.string(),
    status: v.union(v.literal("available"), v.literal("occupied")),
    hourlyRate: v.number(),
    foodTotal: v.optional(v.number()), 
    startTime: v.optional(v.number()),
    currentSessionEnd: v.optional(v.number()),
    isOpenTime: v.optional(v.boolean()),
  }),
  sales: defineTable({
    roomName: v.string(),
    roomCharge: v.number(),
    foodCharge: v.number(),
    totalAmount: v.number(),
    duration: v.number(), 
    paymentMethod: v.string(), 
    completedAt: v.number(),
  }),
});