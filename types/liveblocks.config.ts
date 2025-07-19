import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Define types
type Presence = {
  cursor: { x: number; y: number } | null;
};

type Storage = Record<string, any>;

type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    color?: string;
  };
};

type RoomEvent = Record<string, any>;

type BaseMetadata = Record<string, any>;

// Create Liveblocks client
export const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

// Create typed hooks
export const {
  suspense: { RoomProvider, useRoom },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, BaseMetadata>(
  client
);
