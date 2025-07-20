"use client";

import { ClerkProvider, SignIn, useAuth } from "@clerk/nextjs";
import {
  AuthLoading,
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

import ErrorBoundary from "./error-boundary";
import { FullscreenLoader } from "./fullscreen-loader";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/reset-password",
    "/verify-email",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonAvatarBox: {
            height: "2.5rem",
            width: "2.5rem",
          },
          organizationSwitcherTrigger: {
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            borderRadius: "9999px",
          },
        },
      }}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {isPublicRoute ? (
          // For public routes, render children without auth guards
          <ErrorBoundary>{children}</ErrorBoundary>
        ) : (
          // For protected routes, use auth guards
          <>
            <Authenticated>
              <ErrorBoundary>{children}</ErrorBoundary>
            </Authenticated>

            <Unauthenticated>
              <div className="flex min-h-screen items-center justify-center">
                <SignIn routing="hash" />
              </div>
            </Unauthenticated>

            <AuthLoading>
              <FullscreenLoader label="Loading..." />
            </AuthLoading>
          </>
        )}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
