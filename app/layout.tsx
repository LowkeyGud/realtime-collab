import ErrorBoundary from "@/components/error-boundary";
import { ThemeInitializer } from "@/components/theme-init";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RealTime Collab",
  description: "Collaborate in real-time with your team",
  keywords: "collaboration, real-time, document editing, team, workspace",
  authors: [{ name: "RealTime Collab Team" }],
  viewport: "width=device-width, initial-scale=1",
  generator: "v0.dev",
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
          <ErrorBoundary>
            {children}
            <Toaster richColors />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
