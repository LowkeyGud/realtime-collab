import { ConvexClientProvider } from "@/components/convex-client-provider";
import { DashboardWrapper } from "@/components/layouts/dashboard-wrapper";
import { ThemeInitializer } from "@/components/theme-init";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import "@liveblocks/react-ui/styles.css"; // Default styles
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RealTime Collab",
  description: "Collaborate in real-time with your team",
  keywords: "collaboration, real-time, document editing, team, workspace",
  authors: [{ name: "RealTime Collab Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ThemeInitializer />
          <NuqsAdapter>
            <Toaster theme="light" closeButton richColors />
            <ConvexClientProvider>
              <DashboardWrapper>{children}</DashboardWrapper>
            </ConvexClientProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
