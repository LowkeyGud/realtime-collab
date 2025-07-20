"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Crown, Mail, Shield, User, Users } from "lucide-react";
import { useEffect, useState } from "react";

type Member = {
  userId: string;
  firstName: string;
  lastName: string;
  identifier: string;
  imageUrl: string;
  hasImage: boolean;
};

export default function TeamPage() {
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

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "owner":
        return <Crown className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "owner":
        return "default";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Organization Selected
              </h3>
              <p className="text-muted-foreground mb-4">
                Please select an organization to view team members.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Organization Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={organization.imageUrl}
                alt={organization.name}
              />
              <AvatarFallback className="text-lg">
                {organization.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{organization.name}</CardTitle>
              <p className="text-muted-foreground">
                {memberships.length} member{memberships.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((membership) => {
                const member = membership.publicUserData;
                const fullName = `${member.firstName} ${member.lastName}`;
                const initials = `${member.firstName[0]}${member.lastName[0]}`;
                const joinedDate = new Date(
                  membership.createdAt
                ).toLocaleDateString();
                const isCurrentUser = member.userId === user?.id;

                return (
                  <TableRow key={member.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.imageUrl} alt={fullName} />
                          <AvatarFallback className="text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {fullName}
                            {isCurrentUser && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {member.identifier}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getRoleBadgeVariant(membership.role)}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getRoleIcon(membership.role)}
                        {membership.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {joinedDate}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
