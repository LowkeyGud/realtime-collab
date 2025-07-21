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
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { MoreVertical, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Member = {
  userId: string;
  firstName: string;
  lastName: string;
  identifier: string;
  imageUrl: string;
  hasImage: boolean;
};

export default function TaskList() {
  const { organization } = useOrganization();
  const { user } = useUser();
  const tasks = useQuery(api.tasks.get, { orgId: organization?.id || "" });
  const completeTask = useMutation(api.tasks.complete);
  const deleteTask = useMutation(api.tasks.remove);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    async function fetchMembers() {
      if (!organization) return;

      try {
        const { data } = await organization.getMemberships();
        const extractedMembers = data
          .filter(
            (item: any) =>
              typeof item === "object" &&
              item !== null &&
              "publicUserData" in item
          )
          .map((item: any) => item.publicUserData);

        setMembers(extractedMembers);
      } catch (error) {
        console.log("An error occurred:", error);
      }
    }

    fetchMembers();
  }, [organization]);

  const getMember = (userId: string) => {
    return members.find((m) => m.userId === userId);
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "high":
        return { variant: "destructive" as const, label: "High" };
      case "medium":
        return { variant: "default" as const, label: "Medium" };
      case "low":
        return { variant: "secondary" as const, label: "Low" };
      default:
        return { variant: "outline" as const, label: "No Priority" };
    }
  };

  const formatDueDate = (timestamp?: number) => {
    if (!timestamp) return "No due date";
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString();
  };

  const handleComplete = async (taskId: Id<"tasks">) => {
    try {
      await completeTask({ id: taskId });
      toast.success("Task marked as complete");
    } catch (error) {
      toast.error("Failed to mark task as complete");
    }
  };

  const handleDelete = async (taskId: Id<"tasks">) => {
    try {
      await deleteTask({ id: taskId });
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (!tasks) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link href="/tasks/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Task
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const assigneeMember = getMember(task.assigneeId);
          const assigneeInitials = assigneeMember
            ? `${assigneeMember.firstName[0]}${assigneeMember.lastName[0]}`
            : task.assigneeId.slice(0, 2).toUpperCase();
          const assigneeName = assigneeMember
            ? `${assigneeMember.firstName} ${assigneeMember.lastName}`
            : task.assigneeId;

          const priorityBadge = getPriorityBadge(task.priority);

          return (
            <div
              key={task._id}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`task-${task._id}`}
                  checked={task.isDone}
                  onCheckedChange={() => handleComplete(task._id)}
                  disabled={
                    task.assigneeId !== user?.id && task.assignerId !== user?.id
                  }
                />
                <div>
                  <label
                    htmlFor={`task-${task._id}`}
                    className={`font-medium cursor-pointer ${
                      task.isDone ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </label>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Due {formatDueDate(task.dueDate)}</span>
                    <Badge variant={priorityBadge.variant}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={assigneeMember?.imageUrl}
                    alt={assigneeName}
                  />
                  <AvatarFallback className="text-xs">
                    {assigneeInitials}
                  </AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/tasks/${task._id}`}>Edit</Link>
                    </DropdownMenuItem>
                    {task.assignerId === user?.id && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No tasks found. Create your first task to get started.
        </div>
      )}
    </div>
  );
}
