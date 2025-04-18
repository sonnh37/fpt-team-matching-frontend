"use client";
import { useParams } from "next/navigation";

import UserXRoleAssignmentTable from "@/components/sites/management/users/assignments/roles/detail";

export default function Page() {
  const { userId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <UserXRoleAssignmentTable userId={userId.toString()} />
    </div>
  );
}
