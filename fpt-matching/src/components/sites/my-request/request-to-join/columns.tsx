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
    accessorKey: "project.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => {
      const projectName = row.original.project?.name ?? "Unknown"; // Tránh lỗi undefined
      const projectId = row.original.project?.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/project/${projectId}`}>{projectName}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "project.teamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team" />
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return formatDate(date);
    },
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Process Note" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as InvitationStatus;
      const statusText = InvitationStatus[status];

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

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
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
       <div className="isolate flex -space-x-px">
        <Button className="rounded-r-none focus:z-10">
          Accept
        </Button>
        <Button variant="outline" className="rounded-l-none focus:z-10">
          Cancel
        </Button>
      </div>
    </>
  );
};
