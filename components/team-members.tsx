"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrganization, useUser } from "@clerk/nextjs";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";

interface TeamMembersProps {
  showAll?: boolean;
}

export function TeamMembers({ showAll = false }: TeamMembersProps) {
  const { organization } = useOrganization();
  const { user } = useUser();
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemberships() {
      if (!organization) return;

      try {
        const { data } = await organization.getMemberships();
        setMemberships(data);
      } catch (error) {
        console.log("Error fetching memberships:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMemberships();
  }, [organization]);

  // Transform real data to match component structure
  const members = memberships.map((membership) => {
    const member = membership.publicUserData;
    const fullName = `${member.firstName} ${member.lastName}`;
    const initials = `${member.firstName[0]}${member.lastName[0]}`;

    return {
      id: member.userId,
      name: fullName,
      email: member.identifier,
      role: membership.role.charAt(0).toUpperCase() + membership.role.slice(1),
      status: "online", // You can implement real status logic later
      avatar: member.imageUrl,
      initials: initials,
      isCurrentUser: member.userId === user?.id,
    };
  });

  // Show more members if showAll is true
  const displayMembers = showAll ? members : members.slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!organization || members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No team members found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {displayMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border p-3 text-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                  />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    member.status === "online" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>
              <div>
                <div className="font-medium">
                  {member.name}
                  {member.isCurrentUser && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {member.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  member.role === "Admin"
                    ? "default"
                    : member.role === "Editor"
                      ? "outline"
                      : "secondary"
                }
              >
                {member.role}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuItem>Change Role</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {!showAll && members.length > 4 && (
        <div className="text-center">
          <Button variant="outline">View All Team Members</Button>
        </div>
      )}
    </div>
  );
}
