"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface TaskListProps {
  showAll?: boolean;
}

export function TaskList({ showAll = false }: TaskListProps) {
  // Mock data for tasks
  const [tasks, setTasks] = useState([
    {
      id: "task1",
      title: "Complete project proposal",
      completed: false,
      priority: "high",
      dueDate: "Today",
      assignee: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
    },
    {
      id: "task2",
      title: "Review design mockups",
      completed: false,
      priority: "medium",
      dueDate: "Tomorrow",
      assignee: {
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SM",
      },
    },
    {
      id: "task3",
      title: "Fix authentication bug",
      completed: true,
      priority: "high",
      dueDate: "Yesterday",
      assignee: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
    },
    {
      id: "task4",
      title: "Prepare for client meeting",
      completed: false,
      priority: "medium",
      dueDate: "Apr 25",
      assignee: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EC",
      },
    },
    {
      id: "task5",
      title: "Update documentation",
      completed: false,
      priority: "low",
      dueDate: "Apr 28",
      assignee: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
    },
  ]);

  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Show more tasks if showAll is true
  const displayTasks = showAll ? tasks : tasks.slice(0, 4);

  // Get priority badge variant
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return { variant: "destructive", label: "High" };
      case "medium":
        return { variant: "default", label: "Medium" };
      case "low":
        return { variant: "secondary", label: "Low" };
      default:
        return { variant: "outline", label: priority };
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {displayTasks.map((task) => {
          const priorityBadge = getPriorityBadge(task.priority);

          return (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                <div>
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </label>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Due {task.dueDate}</span>
                    <Badge variant={priorityBadge.variant as any}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={task.assignee.avatar || "/placeholder.svg"}
                    alt={task.assignee.name}
                  />
                  <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Reassign</DropdownMenuItem>
                    <DropdownMenuItem>Change Priority</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {!showAll && tasks.length > 4 && (
        <div className="text-center">
          <Button variant="outline">View All Tasks</Button>
        </div>
      )}
    </div>
  );
}
