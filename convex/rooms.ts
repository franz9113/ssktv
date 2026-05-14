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
    const selectedHours = args.hours || 1;
    const durationMs = selectedHours * 60 * 60 * 1000;

    await ctx.db.patch(args.id, {
      status: "occupied",
      startTime: now,
      isOpenTime: args.isOpenTime,
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
    if (!room) return;

    const isOpenTime = room.isOpenTime ?? true;
    const now = Date.now();
    const elapsedHours = room.startTime ? (now - room.startTime) / (1000 * 60 * 60) : 0;

    const finalDuration = isOpenTime
      ? Math.max(1, Math.ceil(elapsedHours))
      : room.plannedDuration || 1;

    const roomCharge = finalDuration * room.hourlyRate;
    const foodCharge = room.foodTotal || 0;
    const total = roomCharge + foodCharge;

    // Reset the room to available
    await ctx.db.patch(args.id, {
      status: "available",
      startTime: undefined,
      currentSessionEnd: undefined,
      plannedDuration: undefined, // Clear the counter
      foodTotal: 0,
    });

    return { total, roomCharge, foodCharge, duration: finalDuration };
  },
});

export const extendSession = mutation({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.id);
    if (!room) return;

    const oneHourMs = 60 * 60 * 1000;
    const currentPlanned = room.plannedDuration || 1;

    await ctx.db.patch(args.id, {
      currentSessionEnd: (room.currentSessionEnd || Date.now()) + oneHourMs,
      plannedDuration: currentPlanned + 1,
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