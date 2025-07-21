"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { FileCode, FileText, Layers, MoreVertical } from "lucide-react";
import Link from "next/link";

interface RecentDocumentsProps {
  showAll?: boolean;
}

export function RecentDocuments({ showAll = false }: RecentDocumentsProps) {
  const { organization } = useOrganization();
  const documents = useQuery(api.recentDocuments.getRecentDocuments, {
    orgId: organization?.id,
    limit: showAll ? 20 : 4,
  });

  if (!documents) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-pulse bg-gray-200 rounded" />
                <div className="space-y-1">
                  <div className="h-4 w-32 animate-pulse bg-gray-200 rounded" />
                  <div className="h-3 w-24 animate-pulse bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Less than an hour ago";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between rounded-lg border p-3 text-sm"
          >
            <div className="flex items-center gap-3">
              {doc.type === "document" && (
                <FileText className="h-5 w-5 text-blue-500" />
              )}
              {doc.type === "code" && (
                <FileCode className="h-5 w-5 text-green-500" />
              )}
              {doc.type === "whiteboard" && (
                <Layers className="h-5 w-5 text-purple-500" />
              )}
              <div>
                <Link
                  href={`/dashboard/${
                    doc.type === "code"
                      ? "code"
                      : doc.type === "whiteboard"
                        ? "whiteboard"
                        : "documents"
                  }/${doc._id}`}
                  className="font-medium hover:underline"
                >
                  {doc.title}
                </Link>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Updated {formatRelativeTime(doc.updatedAt)}</span>
                  <span>•</span>
                  <span>by {doc.updatedBy.name}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={doc.updatedBy.avatar || "/placeholder.svg"}
                  alt={doc.updatedBy.name}
                />
                <AvatarFallback>{doc.updatedBy.initials}</AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Open</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {!showAll && (
        <div className="text-center">
          <Link href="/documents">
            <Button variant="outline">View All Documents</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
