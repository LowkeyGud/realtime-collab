import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

type OrganizationClaims = {
  id: string;
  rol: string;
  slg: string;
};

export async function POST(req: NextRequest) {
  try {
    console.log("Liveblocks auth request received");

    const { userId, sessionClaims } = await auth();
    const sessionOrganizationId = (sessionClaims?.o as OrganizationClaims)?.id;

    const user = await currentUser();

    if (!userId || !user || !sessionClaims) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { room } = await req.json();
    if (!room) {
      return new NextResponse(
        JSON.stringify({ error: "Room ID is required" }),
        { status: 400 }
      );
    }

    // Check if the room is for Code Editor (starts with "snippet_")
    let isAuthorized = false;
    if (room.startsWith("snippet_")) {
      // Query codeSnippets table for Code Editor
      const snippetId = room.replace("snippet_", "");
      console.log(`Checking snippet with ID: ${snippetId}`);

      const snippet = await convex.query(api.codeSnippets.getSnippetById, {
        snippetId: snippetId,
      });

      if (
        snippet &&
        (snippet.userId === userId ||
          (sessionOrganizationId &&
            snippet.organizationId === sessionOrganizationId))
      ) {
        isAuthorized = true;
      }
    } else {
      // Query documents table for Google Docs Clone
      const document = await convex.query(api.documents.getById, { id: room });
      if (document) {
        const isOwner = document.ownerId === userId;
        const isOrganizationMember =
          document.organizationId &&
          sessionOrganizationId === document.organizationId;
        if (isOwner || isOrganizationMember) {
          isAuthorized = true;
        }
      }
    }

    console.log(isAuthorized, "is authorized for room:", room);

    if (!isAuthorized) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const name =
      user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
    const nameToNumber = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = Math.abs(nameToNumber) % 360;
    const color = `hsl(${hue}, 80%, 60%)`;

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name,
        avatar: user.imageUrl,
        color,
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();
    return new NextResponse(body, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
