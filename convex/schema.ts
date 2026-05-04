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
  settings: defineTable({
    adminUsername: v.string(),
    adminPassword: v.string(), 
    staffPassword: v.string(),
    systemLive: v.boolean(),
  }),
  users: defineTable({
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
    status: v.string(),
    
    // For Staff
    pin: v.optional(v.string()), 
    
    // For Admin
    username: v.optional(v.string()),
    password: v.optional(v.string()),
  }).index("by_pin", ["pin"]).index("by_username", ["username"]),
});