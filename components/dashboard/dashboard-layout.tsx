"use client";

import type React from "react";

import ErrorBoundary from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { NetworkMonitor } from "@/components/network-monitor";
import { useAuth, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardNav } from "./dashboard-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state while checking authentication
  if (!isLoaded || !isMounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      </div>
    );
  }

  // If not authenticated, this should be handled by the middleware
  // But we'll add an extra check here just in case
  if (!user && isMounted) {
    // Redirect will be handled by middleware
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav className="hidden md:flex w-64 border-r p-6" />
        <main className="flex-1 overflow-auto">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <NetworkMonitor />
    </div>
  );
}
