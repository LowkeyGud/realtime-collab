"use client";

import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatRedirect() {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (organization?.id) {
        // Redirect to the organization's chat
        router.replace(`/chat/org/${organization.id}`);
      } else {
        // If no organization, redirect to dashboard to select one
        router.replace("/dashboard");
      }
    }
  }, [isLoaded, organization, router]);

  // Show loading while checking organization
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
}
