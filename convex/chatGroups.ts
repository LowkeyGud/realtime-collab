import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChatGroup = mutation({
  args: {
    organizationId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Ensure only one chat group per organization
    const existingGroup = await ctx.db
      .query("chatGroups")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();
    if (existingGroup) {
      return existingGroup._id;
    }
    return await ctx.db.insert("chatGroups", {
      organizationId: args.organizationId,
      name: args.name,
    });
  },
});

export const getByOrgId = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatGroups")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();
  },
});
