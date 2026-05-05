import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


// ROOM SESSION LOGIC
export const getRooms = query({
  handler: async (ctx) => {
    return await ctx.db.query("rooms").collect();
  },
});

export const addRoom = mutation({
  args: {
    name: v.string(),
    hourlyRate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rooms", {
      name: args.name,
      hourlyRate: args.hourlyRate,
      status: "available",
      foodTotal: 0,
    });
  },
});

export const updateRoom = mutation({
  args: {
    id: v.id("rooms"),
    name: v.string(),
    hourlyRate: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      hourlyRate: args.hourlyRate,
    });
  },
});

export const deleteRoom = mutation({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const startSession = mutation({
  args: { 
    id: v.id("rooms"), 
    isOpenTime: v.boolean(),
    hours: v.optional(v.number()) // Add this to capture 1, 2, or 3 hours
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    // Use the passed hours or default to 1
    const selectedHours = args.hours || 1;
    const durationMs = selectedHours * 60 * 60 * 1000;

    await ctx.db.patch(args.id, {
      status: "occupied",
      startTime: now,
      isOpenTime: args.isOpenTime,
      // Fixed logic: Save the agreed whole number of hours
      plannedDuration: args.isOpenTime ? undefined : selectedHours,
      currentSessionEnd: args.isOpenTime ? undefined : now + durationMs,
      foodTotal: 0,
    });
  },
});

export const endSession = mutation({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.id);
    if (!room || !room.startTime) return;

    const now = Date.now();
    const hoursUsed = (now - room.startTime) / (1000 * 60 * 60);
    const roomCharge = Math.ceil(hoursUsed) * room.hourlyRate;
    const foodCharge = room.foodTotal || 0;
    const total = roomCharge + foodCharge;

    await ctx.db.insert("sales", {
      roomName: room.name,
      roomCharge,
      foodCharge,
      totalAmount: total,
      duration: hoursUsed,
      paymentMethod: "Cash", // Default payment method
      completedAt: now,
    });

    // 2. RESET THE ROOM
    await ctx.db.patch(args.id, {
      status: "available",
      startTime: undefined,
      currentSessionEnd: undefined,
      foodTotal: 0,
    });

    return { total, roomCharge, foodCharge };
  },
});

export const extendSession = mutation({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.id);
    if (!room || !room.currentSessionEnd) return;

    const oneHour = (60 * 60 * 1000);
    
    await ctx.db.patch(args.id, {
      // Add 1 hour to the existing end time
      currentSessionEnd: room.currentSessionEnd + oneHour,
    });
  },
});

// FOOD SESSION LOGIC

export const addFoodOrder = mutation({
  args: { 
    id: v.id("rooms"), 
    amount: v.number() 
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.id);
    if (!room) return;

    await ctx.db.patch(args.id, {
      foodTotal: (room.foodTotal ?? 0) + args.amount,
    });
  },
});

export const getBill = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.id);
    if (!room || !room.startTime) return null;
    
    const duration = (Date.now() - room.startTime) / (1000 * 60 * 60);
    const roomCharge = Math.ceil(duration) * room.hourlyRate;
    const foodCharge = room.foodTotal || 0;
    
    return { 
      total: roomCharge + foodCharge, 
      roomCharge, 
      foodCharge 
    };
  }
});