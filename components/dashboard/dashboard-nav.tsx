"use client";

import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckSquare,
  Code,
  FileText,
  HelpCircle,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  className?: string;
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Documents",
      href: "/documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Code Editor",
      href: "/code",
      icon: <Code className="h-5 w-5" />,
    },
    {
      title: "Chat",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Meetings",
      href: "/meetings",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: "Whiteboard",
      href: "/whiteboard",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      title: "Team",
      href: "/team",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
      <div className="mt-auto pt-4">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/dashboard/settings"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <Link
          href="/dashboard/settings/theme"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/dashboard/settings/theme"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          <Sun className="h-5 w-5" />
          <span>Theme</span>
        </Link>
        <Link
          href="/dashboard/help"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Help & Support</span>
        </Link>
      </div>
    </nav>
  );
}
