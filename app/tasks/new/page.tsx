"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "../../../convex/_generated/api";

type Member = {
  userId: string;
  firstName: string;
  lastName: string;
  identifier: string;
  hasImage: boolean;
  imageUrl: string;
};

const formSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
});

export default function TaskForm() {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      assigneeId: "",
    },
  });

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
        toast.error("Failed to fetch members");
      }
    }

    fetchMembers();
  }, [organization]);

  const createTask = useMutation(api.tasks.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organization) {
      toast.error("Please select an organization");
      return;
    }
    try {
      await createTask({
        title: values.title,
        description: values.description || "",
        assigneeId: values.assigneeId || "",
        orgId: organization.id,
      });
      form.reset();
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create New Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter task title"
                        {...field}
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter task description"
                        {...field}
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.userId} value={member.userId}>
                            {`${member.firstName} ${member.lastName}` ||
                              member.identifier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Task
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
