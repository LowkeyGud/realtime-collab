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
