"use client";
import { Room } from "@/app/documents/document/[documentId]/room";
import { useParams } from "next/navigation";
import { EditorPanel } from "../../_components/EditorPanel";
import Header from "../../_components/Header";
import OutputPanel from "../../_components/OutputPanel";

export default function Home() {
  const params = useParams();
  const roomId = (params?.snippetId as string) || "default-room";

  return (
    <Room roomId={roomId}>
      <div className="min-h-screen">
        <div className="max-w-[1800px] mx-auto p-4">
          <Header />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditorPanel />
            <OutputPanel />
          </div>
        </div>
      </div>
    </Room>
  );
}
