import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    name: v.string(),
    status: v.string(), // "available", "occupied", "cleaning"
    hourlyRate: v.number(),
    startTime: v.optional(v.number()),
    // These must be defined here to stop the red lines:
    isOpenTime: v.optional(v.boolean()),
    isFixedTime: v.optional(v.boolean()), // Useful for your logic
    currentSessionEnd: v.optional(v.number()),
    plannedDuration: v.optional(v.number()), 
    foodTotal: v.optional(v.number()),
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