"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MentorTopicRequestStatus } from "@/types/enums/mentor-idea-request";
import { Invitation } from "@/types/invitation";
import { MentorTopicRequest } from "@/types/mentor-topic-request";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const columns: ColumnDef<MentorTopicRequest>[] = [
  {
    accessorKey: "project.teamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên nhóm" />
    ),
    cell: ({ row }) => {
      const teamName = row.original.project?.teamName ?? "-"; // Tránh lỗi undefined
      const projectId = row.original.project?.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/team-detail/${projectId}`}>{teamName}</Link>
        </Button>
      );
    },
  },

  {
    accessorKey: "idea.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
    cell: ({ row }) => {
      const englishName = row.original.topic?.ideaVersion?.englishName ?? "-"; // Tránh lỗi undefined
      const ideaId = row.original.topic?.ideaVersion?.idea?.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/idea-detail/${ideaId}`}>{englishName}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.original.status as MentorTopicRequestStatus;

      // Map status to Vietnamese text
      const statusText =
        {
          [MentorTopicRequestStatus.Pending]: "Chờ phê duyệt",
          [MentorTopicRequestStatus.Approved]: "Đã chấp nhận",
          [MentorTopicRequestStatus.Rejected]: "Đã từ chối",
          // Add other statuses if needed
        }[status] || "Khác";

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case MentorTopicRequestStatus.Pending:
          badgeVariant = "secondary"; // Neutral color for pending state
          break;
        case MentorTopicRequestStatus.Approved:
          badgeVariant = "default"; // Positive color for approved
          break;
        case MentorTopicRequestStatus.Rejected:
          badgeVariant = "destructive"; // Negative color for rejected
          break;
        default:
          badgeVariant = "outline"; // Outline for unknown states
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => null,
    cell: ({ row }) => null,
  },
  // {
  //   accessorKey: "actions",
  //   header: "Thao tác",
  //   cell: ({ row }) => {
  //     return <Actions row={row} />;
  //   },
  // },
];

interface ActionsProps {
  row: Row<Invitation>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const router = useRouter();
  const pathName = usePathname();
  const handleViewDetailsClick = () => {
    // router.push(`${pathName}/${model.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleViewDetailsClick}>
            Xem chi tiết
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
