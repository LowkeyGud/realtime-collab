"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DashboardNav({
  className,
  isCollapsed = false,
  onToggleCollapse,
}: DashboardNavProps) {
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
      href: "/code-editor/snippets",
      icon: <Code className="h-5 w-5" />,
    },
    {
      title: "Chat",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
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
    <nav
      className={cn(
        "flex flex-col gap-2 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center mb-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? item.title : undefined}
        >
          {item.icon}
          {!isCollapsed && item.title}
        </Link>
      ))}
    </nav>
  );
}
