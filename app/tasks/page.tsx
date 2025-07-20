"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
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

  const getMemberName = (userId: string) => {
    const member = members.find((m) => m.userId === userId);
    return member ? `${member.firstName} ${member.lastName}` : userId;
  };

  const getMember = (userId: string) => {
    return members.find((m) => m.userId === userId);
  };

  const MemberInfo = ({ userId, label }: { userId: string; label: string }) => {
    const member = getMember(userId);
    const name = member ? `${member.firstName} ${member.lastName}` : userId;
    const initials = member
      ? `${member.firstName[0]}${member.lastName[0]}`
      : userId.slice(0, 2).toUpperCase();

    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}:
        </span>
        <Avatar className="h-8 w-8 ring-1 ring-gray-200 dark:ring-gray-700">
          <AvatarImage src={member?.imageUrl} alt={name} />
          <AvatarFallback className="text-xs font-medium bg-gray-100 dark:bg-gray-800">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {name}
        </span>
      </div>
    );
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

  if (!tasks)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Tasks
        </h1>
        <Link href="/tasks/new">
          <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Task
          </Button>
        </Link>
      </div>
      <div className="space-y-6">
        {tasks.map((task) => (
          <Card
            key={task._id}
            className="shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                <Link
                  href={`/tasks/${task._id}`}
                  className="hover:underline hover:text-primary transition-colors duration-150"
                >
                  {task.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {task.description}
              </p>
              <div className="space-y-3 mb-4">
                <MemberInfo userId={task.assignerId} label="Assigned by" />
                <MemberInfo userId={task.assigneeId} label="Assigned to" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`text-sm font-medium ${
                    task.isDone
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {task.isDone ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="mt-6 flex gap-3">
                {(task.assignerId === user?.id ||
                  task.assigneeId === user?.id) && (
                  <Button
                    disabled={task.isDone}
                    onClick={() => handleComplete(task._id)}
                    className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    Mark Complete
                  </Button>
                )}
                {task.assignerId === user?.id && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
