import { v } from "convex/values";
import { query } from "./_generated/server";

export const getRecentDocuments = query({
  args: {
    orgId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const limit = args.limit || 5;
    const userId = identity.subject;

    // Fetch recent documents
    const docs = await ctx.db
      .query("docsDocuments")
      .filter((q) =>
        args.orgId
          ? q.eq(q.field("organizationId"), args.orgId)
          : q.eq(q.field("ownerId"), userId)
      )
      .order("desc")
      .take(limit);

    // Fetch recent code snippets
    const snippets = await ctx.db
      .query("codeSnippets")
      .filter((q) =>
        args.orgId
          ? q.eq(q.field("organizationId"), args.orgId)
          : q.eq(q.field("userId"), userId)
      )
      .order("desc")
      .take(limit);

    // Fetch recent boards
    const boards = await ctx.db
      .query("miroBoards")
      .filter((q) =>
        args.orgId
          ? q.eq(q.field("orgId"), args.orgId)
          : q.eq(q.field("authorId"), userId)
      )
      .order("desc")
      .take(limit);

    // Combine and sort by creation time
    const allDocuments = [
      ...docs.map((doc) => ({
        ...doc,
        type: "document" as const,
        updatedAt: doc._creationTime,
        updatedBy: {
          name: "You",
          avatar: "",
          initials: "ME",
        },
      })),
      ...snippets.map((snippet) => ({
        ...snippet,
        type: "code" as const,
        updatedAt: snippet._creationTime,
        updatedBy: {
          name: snippet.userName,
          avatar: "",
          initials: snippet.userName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
        },
      })),
      ...boards.map((board) => ({
        ...board,
        type: "whiteboard" as const,
        updatedAt: board._creationTime,
        updatedBy: {
          name: board.authorName,
          avatar: board.imageUrl,
          initials: board.authorName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
        },
      })),
    ];

    // Sort by most recent and take limit
    return allDocuments
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  },
});
