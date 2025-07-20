"use client";

import { useOrganization } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { BoardList } from "./_components/board-list";
import { EmptyOrg } from "./_components/empty-org";

// Separate component to handle search params inside Suspense
const DashboardContent = ({ orgId }: { orgId: string }) => {
  const searchParams = useSearchParams();

  // Extract query parameters
  const query = {
    search: searchParams.get("search") || "",
    favourites: searchParams.get("favourites") || "",
  };

  return <BoardList orgId={orgId} query={query} />;
};

const DashboardPage = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardContent orgId={organization.id} />
        </Suspense>
      )}
    </div>
  );
};

export default DashboardPage;
