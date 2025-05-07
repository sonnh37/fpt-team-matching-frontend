"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { InvitationStatus } from "@/types/enums/invitation";
import { Invitation } from "@/types/invitation";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const columns: ColumnDef<Invitation>[] = [
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
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return formatDate(date);
    },
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ghi chú" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as InvitationStatus;
      
      // Ánh xạ status sang tiếng Việt
      const statusText: Record<InvitationStatus, string> = {
        [InvitationStatus.Pending]: "Đang chờ",
        [InvitationStatus.Accepted]: "Đã chấp nhận",
        [InvitationStatus.Rejected]: "Đã từ chối",
        [InvitationStatus.Cancel]: "Đã bị hủy",
      };

      const statusDisplay = statusText[status] || "Không xác định";
  
      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";
  
      switch (status) {
        case InvitationStatus.Pending:
          badgeVariant = "secondary";
          break;
        case InvitationStatus.Accepted:
          badgeVariant = "default";
          break;
        case InvitationStatus.Rejected:
          badgeVariant = "destructive";
          break;
        default:
          badgeVariant = "outline";
      }
  
      return <Badge variant={badgeVariant}>{statusDisplay}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  }
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
            View details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
