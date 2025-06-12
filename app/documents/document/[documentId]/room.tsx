"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const documentId = params.documentId as string;
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_Kgtcnd5l2A3kd-s6N3_D1D_VYFN6ob8TnMZQTB3DnTHPXv_gKMA7ngiUVxPFJY4W"
      }
    >
      <RoomProvider id={documentId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
