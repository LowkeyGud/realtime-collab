// convex/messages.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendMessage = mutation({
  args: {
    chatGroupId: v.id("chatGroups"),
    body: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    await ctx.db.insert("messages", {
      chatGroupId: args.chatGroupId,
      userId,
      username: identity.name || "Anonymous",
      body: args.body,
      imageStorageId: args.imageStorageId,
      timestamp: Date.now(),
    });
  },
});

export const getMessages = query({
  args: { chatGroupId: v.id("chatGroups") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatGroupId", (q) => q.eq("chatGroupId", args.chatGroupId))
      .order("asc")
      .collect();

    return Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db
          .query("codeUsers")
          .withIndex("by_user_id", (q) => q.eq("userId", message.userId))
          .unique();
        const imageUrl = message.imageStorageId
          ? await ctx.storage.getUrl(message.imageStorageId)
          : null;
        return { ...message, user, imageUrl };
      })
    );
  },
});
