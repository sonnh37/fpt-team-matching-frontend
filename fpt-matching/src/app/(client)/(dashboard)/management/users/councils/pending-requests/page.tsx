"use client";
import UserTable from "@/components/sites/management/users";
import CouncilIdeaRequestPendingTable from "@/components/sites/management/users/councils/idea-requests";

export default function Page() {
  return (
    <div>
      <CouncilIdeaRequestPendingTable />
    </div>
  );
}
