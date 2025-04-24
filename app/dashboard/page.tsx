import { ActivityFeed } from "@/components/activity-feed";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RecentDocuments } from "@/components/recent-documents";
import { TaskList } from "@/components/task-list";
import { TeamMembers } from "@/components/team-members";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | RealTime Collab",
  description: "Dashboard for RealTime Collab application",
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +4 from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">3 due today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">2 online now</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Next in 2 hours
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>
                    Your recently edited documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentDocuments />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>
                    Recent activity in your workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityFeed />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Your assigned and upcoming tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>People in your workspace</CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamMembers />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Documents</CardTitle>
                <CardDescription>
                  Manage your documents and files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentDocuments showAll />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>View and manage all tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList showAll />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Manage your team and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamMembers showAll />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
