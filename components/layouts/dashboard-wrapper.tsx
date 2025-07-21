"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import ErrorBoundary from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { NetworkMonitor } from "@/components/network-monitor";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

// Pages that should have the dashboard layout
const DASHBOARD_ROUTES = [
  "/dashboard",
  "/documents",
  "/tasks",
  "/team",
  "/chat",
  "/meetings",
  "/code-editor",
  "/whiteboard",
];

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const pathname = usePathname();
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if current page should have dashboard layout
  const shouldShowDashboard = DASHBOARD_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If this page doesn't need dashboard layout, just render children
  if (!shouldShowDashboard) {
    return <>{children}</>;
  }

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
        <DashboardNav
          className={cn(
            "hidden md:flex border-r fixed left-0 top-16 h-[calc(100vh-4rem)] z-20",
            isNavCollapsed ? "p-2" : "p-6"
          )}
          isCollapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        />
        <main
          className={cn(
            "flex-1 overflow-auto",
            isNavCollapsed ? "md:ml-16" : "md:ml-64"
          )}
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <NetworkMonitor />
    </div>
  );
}
