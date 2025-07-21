/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as board from "../board.js";
import type * as boards from "../boards.js";
import type * as chatGroups from "../chatGroups.js";
import type * as codeExecutions from "../codeExecutions.js";
import type * as codeSnippets from "../codeSnippets.js";
import type * as codeUsers from "../codeUsers.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as message from "../message.js";
import type * as recentDocuments from "../recentDocuments.js";
import type * as storage from "../storage.js";
import type * as tasks from "../tasks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  board: typeof board;
  boards: typeof boards;
  chatGroups: typeof chatGroups;
  codeExecutions: typeof codeExecutions;
  codeSnippets: typeof codeSnippets;
  codeUsers: typeof codeUsers;
  documents: typeof documents;
  http: typeof http;
  message: typeof message;
  recentDocuments: typeof recentDocuments;
  storage: typeof storage;
  tasks: typeof tasks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
