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
import { invitationService } from "@/services/invitation-service";
import { InvitationStatus } from "@/types/enums/invitation";
import { Invitation } from "@/types/invitation";
import { InvitationUpdateCommand } from "@/types/models/commands/invitation/invitation-update-command";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
  },
  {
    accessorKey: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const model = row.original;

      return (
        <>
          {model.status === InvitationStatus.Pending && <Actions row={row} />}
        </>
      );
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
  const queryClient = useQueryClient();
  const [isApproving, setIsApproving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancel = async () => {
    setIsCanceling(true);
    try {
      // Gọi API cancelInvite
      if (!model.projectId) throw new Error("Project ID is undefined");
      const command: InvitationUpdateCommand = {
        id: model.id,
        status: InvitationStatus.Rejected,
      };
      const res = await invitationService.approveOrRejectFromTeamByMe(command);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      queryClient.refetchQueries({ queryKey: ["data"] });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // Gọi API approveInvite
      if (!model.projectId) throw new Error("Project ID is undefined");
      const command: InvitationUpdateCommand = {
        id: model.id,
        status: InvitationStatus.Accepted,
        senderId: model.senderId,
        receiverId: model.receiverId,
      };
      const res = await invitationService.approveOrRejectFromTeamByMe(command);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      queryClient.refetchQueries({ queryKey: ["data"] });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <>
      <div className="isolate flex -space-x-px">
        <Button 
          className="rounded-r-none focus:z-10" 
          onClick={handleApprove}
          disabled={isApproving || isCanceling}
        >
          {isApproving ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xử lý...
            </div>
          ) : "Đồng ý"}
        </Button>
        <Button
          variant="outline"
          className="rounded-l-none focus:z-10"
          onClick={handleCancel}
          disabled={isApproving || isCanceling}
        >
          {isCanceling ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xử lý...
            </div>
          ) : "Từ chối"}
        </Button>
      </div>
    </>
  );
};
