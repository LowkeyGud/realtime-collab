"use client";

import { useSearchParams } from "next/navigation";
import { BoardList } from "./board-list";

interface DashboardContentProps {
  orgId: string;
}

export const DashboardContent = ({ orgId }: DashboardContentProps) => {
  const searchParams = useSearchParams();

  // Extract query parameters
  const query = {
    search: searchParams.get("search") || "",
    favourites: searchParams.get("favourites") || "",
  };

  return <BoardList orgId={orgId} query={query} />;
};
