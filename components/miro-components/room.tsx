"use client";

import {
  getDocuments,
  getUsers,
} from "@/app/documents/document/[documentId]/actions";
import { editorMargin } from "@/config/editor";
import { Id } from "@/convex/_generated/dataModel";
import { Layer } from "@/types/canvas";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

type RoomProps = {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
};

type User = { id: string; name: string; avatar: string; color: string };

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list.map((list) => ({ ...list, color: "" })));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch users!"
        );
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return (
    <LiveblocksProvider
      authEndpoint={async () => {
        const endpoint = "/api/liveblocks-auth";
        const room = roomId;

        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ room }),
        });

        return await response.json();
      }}
      throttle={16}
      resolveUsers={({ userIds }) => {
        return userIds.map((userId) => {
          const user = users.find((user) => user.id === userId);
          if (!user) return undefined;
          return {
            name: user.name,
            picture: user.avatar, // Map 'avatar' to 'picture'
          };
        });
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;

        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<"docsDocuments">[]);

        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }));
      }}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: [],
          pencilDraft: null,
          penColor: null,
        }}
        initialStorage={{
          // Whiteboard-specific storage
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList([]),
          // Document editor-specific storage
          leftMargin: editorMargin,
          rightMargin: editorMargin,
          // Code editor-specific storage
          code: "",
        }}
      >
        <ClientSideSuspense fallback={fallback}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
