import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get tasks for the current organization
export const get = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError("Unauthorized!");
    return await ctx.db
      .query("tasks")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

// Create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    assigneeId: v.string(),
    orgId: v.string(),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError("Unauthorized!");

    const userId = user.subject; // Clerk user ID
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      isDone: false,
      assignerId: userId!,
      assigneeId: args.assigneeId,
      orgId: args.orgId,
      priority: args.priority,
      dueDate: args.dueDate,
      createdAt: Date.now(),
    });
  },
});

// Mark a task as complete
export const complete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError("Unauthorized!");
    const userId = user.subject; // Clerk user ID

    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    if (task.assignerId !== userId && task.assigneeId !== userId) {
      throw new Error("Only assigner or assignee can mark as complete");
    }
    await ctx.db.patch(args.id, { isDone: true });
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError("Unauthorized!");
    const userId = user.subject; // Clerk user ID
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    if (task.assignerId !== userId) {
      throw new Error("Only assigner can delete the task");
    }
    await ctx.db.delete(args.id);
  },
});

// Update an existing task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assigneeId: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError("Unauthorized!");
    const userId = user.subject; // Clerk user ID

    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    if (task.assignerId !== userId) {
      throw new Error("Only assigner can update the task");
    }

    const updateData: any = {};
    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined)
      updateData.description = args.description;
    if (args.assigneeId !== undefined) updateData.assigneeId = args.assigneeId;
    if (args.priority !== undefined) updateData.priority = args.priority;
    if (args.dueDate !== undefined) updateData.dueDate = args.dueDate;

    await ctx.db.patch(args.id, updateData);
  },
});

// Get a single task by ID
export const getById = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new ConvexError("Unauthorized!");

    const task = await ctx.db.get(args.id);
    if (!task) return null;

    return task;
  },
});
