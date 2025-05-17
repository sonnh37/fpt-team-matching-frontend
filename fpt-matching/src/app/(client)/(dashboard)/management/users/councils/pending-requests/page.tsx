"use client";
import UserTable from "@/components/sites/management/users";
import CouncilTopicVersionRequestPendingTable from "@/components/sites/management/users/councils/topic-requests";

export default function Page() {
  return (
    <div>
      <CouncilTopicVersionRequestPendingTable />
    </div>
  );
}
