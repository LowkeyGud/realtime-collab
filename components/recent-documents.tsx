"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileCode, FileText, Layers, MoreVertical } from "lucide-react";
import Link from "next/link";

interface RecentDocumentsProps {
  showAll?: boolean;
}

export function RecentDocuments({ showAll = false }: RecentDocumentsProps) {
  // Mock data for recent documents
  const documents = [
    {
      id: "doc1",
      title: "Project Roadmap",
      type: "document",
      updatedAt: "2 hours ago",
      updatedBy: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
    },
    {
      id: "doc2",
      title: "Meeting Notes - April 15",
      type: "document",
      updatedAt: "Yesterday",
      updatedBy: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SM",
      },
    },
    {
      id: "doc3",
      title: "Product Requirements",
      type: "document",
      updatedAt: "2 days ago",
      updatedBy: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
    },
    {
      id: "doc4",
      title: "Authentication Service",
      type: "code",
      updatedAt: "3 days ago",
      updatedBy: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EC",
      },
    },
    {
      id: "doc5",
      title: "UI Design Mockups",
      type: "whiteboard",
      updatedAt: "5 days ago",
      updatedBy: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
    },
  ];

  // Show more documents if showAll is true
  const displayDocuments = showAll ? documents : documents.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {displayDocuments.map((doc) => (
          <div
            key={doc.id}
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
                  }/${doc.id}`}
                  className="font-medium hover:underline"
                >
                  {doc.title}
                </Link>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Updated {doc.updatedAt}</span>
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
