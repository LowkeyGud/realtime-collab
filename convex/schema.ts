import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // App 1: Miro Clone
  miroBoards: defineTable({
    title: v.string(),
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
  })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    }),
  miroUserFavourites: defineTable({
    orgId: v.string(),
    userId: v.string(),
    boardId: v.id("miroBoards"),
  })
    .index("by_board", ["boardId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_user_board_org", ["userId", "boardId", "orgId"]),

  // App 2: Google Docs Clone
  docsDocuments: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    snippetId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),

  // App 3: Code Editor
  codeUsers: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    isPro: v.boolean(),
    proSince: v.optional(v.number()),
  }).index("by_user_id", ["userId"]),
  codeExecutions: defineTable({
    userId: v.string(),
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
  codeSnippets: defineTable({
    userId: v.string(),
    title: v.string(),
    language: v.string(),
    code: v.string(),
    userName: v.string(),
    roomId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
  codeSnippetComments: defineTable({
    snippetId: v.id("codeSnippets"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(),
  }).index("by_snippet_id", ["snippetId"]),
  codeStars: defineTable({
    userId: v.string(),
    snippetId: v.id("codeSnippets"),
  })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),
});
