// Define Liveblocks types for your application

import { LiveList, LiveMap, LiveObject } from "@liveblocks/node";
import { Layer } from "./types/canvas";

// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { x: number; y: number } | null;
      selection: string[];
      pencilDraft: number[][] | null;
      penColor: { r: number; g: number; b: number } | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Whiteboard-specific storage
      layers: LiveMap<string, LiveObject<Layer>>;
      layerIds: LiveList<string>;

      // Document editor-specific storage
      leftMargin: number;
      rightMargin: number;

      // Code editor-specific storage
      code: string;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        picture: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {};
