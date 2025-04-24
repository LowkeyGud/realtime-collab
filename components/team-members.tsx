"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

interface TeamMembersProps {
  showAll?: boolean
}

export function TeamMembers({ showAll = false }: TeamMembersProps) {
  // Mock data for team members
  const members = [
    {
      id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    {
      id: "user2",
      name: "Sarah Miller",
      email: "sarah.miller@example.com",
      role: "Editor",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    {
      id: "user3",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "Viewer",
      status: "offline",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    {
      id: "user4",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      role: "Editor",
      status: "offline",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EC",
    },
    {
      id: "user5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "Viewer",
      status: "offline",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MB",
    },
  ]

  // Show more members if showAll is true
  const displayMembers = showAll ? members : members.slice(0, 4)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {displayMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${member.status === "online" ? "bg-green-500" : "bg-gray-300"}`}
                />
              </div>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={member.role === "Admin" ? "default" : member.role === "Editor" ? "outline" : "secondary"}>
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
                  <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
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
  )
}
