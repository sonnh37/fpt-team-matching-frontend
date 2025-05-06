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
import { ProjectStatus } from "@/types/enums/project";
import { Project } from "@/types/project";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "teamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Name" />
    ),
  },
  {
    accessorKey: "teamCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team code" />
    ),
  },
  {
    accessorKey: "leader.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Leader" />
    ),
  },
  {
    accessorKey: "topic.ideaVersion.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea name" />
    ),
  },

  {
    accessorKey: "teamSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team size" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as ProjectStatus;
      
      // Map status to Vietnamese text
      const statusText = {
        [ProjectStatus.Pending]: "Đang chờ",
        [ProjectStatus.InProgress]: "Đang thực hiện",
        [ProjectStatus.Completed]: "Hoàn thành",
        [ProjectStatus.Canceled]: "Đã hủy",
        // Add other statuses if needed
      }[status] || "Khác";
  
      let badgeVariant: "secondary" | "destructive" | "default" | "outline" | null = "default";
  
      switch (status) {
        case ProjectStatus.Pending:
          badgeVariant = "secondary";
          break;
        case ProjectStatus.InProgress:
          badgeVariant = "outline";
          break;
        case ProjectStatus.Completed:
          badgeVariant = "default";
          break;
        case ProjectStatus.Canceled:
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
    accessorKey: "roles",
    header: () => null,
    cell: () => null,
    enableHiding: false,
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
  row: Row<Project>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const router = useRouter();
  const pathName = usePathname();
  const handleViewClick = () => {
    router.push(`${pathName}/detail/${model.id}`);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(model.id!);
      toast.info("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
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
          <DropdownMenuItem onClick={handleCopyId}>
            Copy model ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewClick}>
            View detail
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
