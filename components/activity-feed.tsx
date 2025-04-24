"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, MessageSquare, CheckSquare, FileCode, Layers } from "lucide-react"

export function ActivityFeed() {
  // Mock data for activity feed
  const activities = [
    {
      id: "activity1",
      type: "document",
      action: "edited",
      target: "Project Roadmap",
      time: "2 hours ago",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
    },
    {
      id: "activity2",
      type: "chat",
      action: "sent a message in",
      target: "Team Chat",
      time: "3 hours ago",
      user: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SM",
      },
    },
    {
      id: "activity3",
      type: "task",
      action: "completed",
      target: "Fix authentication bug",
      time: "Yesterday",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
    },
    {
      id: "activity4",
      type: "code",
      action: "committed changes to",
      target: "Authentication Service",
      time: "Yesterday",
      user: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EC",
      },
    },
    {
      id: "activity5",
      type: "whiteboard",
      action: "created",
      target: "UI Design Mockups",
      time: "2 days ago",
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
    },
  ]

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "chat":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "task":
        return <CheckSquare className="h-4 w-4 text-green-500" />
      case "code":
        return <FileCode className="h-4 w-4 text-orange-500" />
      case "whiteboard":
        return <Layers className="h-4 w-4 text-indigo-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{activity.user.name}</span>
              <span className="text-muted-foreground">{activity.action}</span>
              <div className="flex items-center gap-1">
                {getActivityIcon(activity.type)}
                <span className="font-medium">{activity.target}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
