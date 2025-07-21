"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
  roomId: string;
}

export const Document = ({ preloadedDocument, roomId }: DocumentProps) => {
  const document = usePreloadedQuery(preloadedDocument);

  return (
    <Room roomId={roomId}>
      <div className="min-h-screen bg-[#fafbfd]">
        <div className="fixed top-16 z-20 flex flex-col gap-y-2 bg-[#FAFBFD] px-4 pt-2 print:hidden justify-center items-center w-10/12">
          <Navbar data={document} />
          <Toolbar />
        </div>

        <div className="pt-[130px] print:pt-0 md:w-full justify-center">
          <Editor initialContent={document.initialContent} />
        </div>
      </div>
    </Room>
  );
};
