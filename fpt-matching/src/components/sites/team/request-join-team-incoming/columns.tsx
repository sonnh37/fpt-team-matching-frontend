"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { projectService } from "@/services/project-service";
import { InvitationStatus } from "@/types/enums/invitation";
import { Invitation } from "@/types/invitation";
import { InvitationUpdateCommand } from "@/types/models/commands/invitation/invitation-update-command";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "sender.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email người dùng" />
    ),
    cell: ({ row }) => {
      const email = row.original.sender?.email ?? "-";
      const senderId = row.original.senderId ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/social/blog/profile-social/${senderId}`}>{email}</Link>
        </Button>
      );
    },
  },

  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ghi chú quy trình" />
    ),
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getTeamInfo"],
    queryFn: projectService.getProjectInfo,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    toast.error("Failed to load team information.", {
      description: error.message,
    });
    return <p>Error: {error.message}</p>;
  }
  if (!result) {
    toast.error("No data found.");
    return <p>No data found</p>;
  }

  const project = result?.data;
 
  const isHasTopic = project?.topicId ? true : false;

  let availableSlots = 6;
  if (!isHasTopic) {
    availableSlots = availableSlots - (project?.teamMembers?.length ?? 0);
  } else {
    availableSlots =
      (project?.topic?.ideaVersion?.teamSize ?? 0) -
      (project?.teamMembers?.length ?? 0);
  }

  const handleCancel = async () => {
    try {
      if (!model.projectId) throw new Error("Project ID is undefined");
      const command: InvitationUpdateCommand = {
        id: model.id,
        status: InvitationStatus.Rejected,
      };

      const promise =
        invitationService.approveOrRejectFromPersonalizeByLeader(command);

      toast.promise(promise, {
        loading: "Đang xử lí...",
        success: (res) => {
          if (res.status === 1) {
            queryClient.refetchQueries({ queryKey: ["data"] });
            return res.message;
          } else {
            throw new Error(res.message);
          }
        },
        error: (err) => err.message || "Không thể từ chối lời mời",
      });
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleApprove = async () => {
    if (availableSlots === 0) {
      toast.error("Nhóm đã đầy đủ");
      return;
    }

    if (availableSlots === 1) {
      setShowConfirmDialog(true);
      return;
    } else {
      await proceedWithApproval();
    }
  };

  const proceedWithApproval = async () => {
    try {
      if (!model.projectId) throw new Error("Project ID is undefined");

      const approvalPromise = async () => {
        const command: InvitationUpdateCommand = {
          id: model.id,
          status: InvitationStatus.Accepted,
        };
        const res =
          await invitationService.approveOrRejectFromPersonalizeByLeader(
            command
          );

        if (res.status !== 1) {
          throw new Error(res.message);
        }

        return res;
      };

      toast.promise(approvalPromise(), {
        loading: "Đang xử lí...",
        success: (res) => {
          queryClient.refetchQueries({ queryKey: ["data"] });
          queryClient.refetchQueries({ queryKey: ["getTeamInfo"] });

          if (availableSlots === 1) {
            toast.success("Nhóm hiện tại đã khóa");
          }

          return res.message;
        },
        error: (err) => err.message || "Không thể chấp nhận lời mời",
      });
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="isolate flex -space-x-px">
      <Button className="rounded-r-none focus:z-10" onClick={handleApprove}>
        Đồng ý
      </Button>
      <Button
        variant="outline"
        className="rounded-l-none focus:z-10"
        onClick={handleCancel}
      >
        Hủy
      </Button>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cảnh báo vị trí cuối cùng</DialogTitle>
            <DialogDescription>
            Đây sẽ là vị trí cuối cùng còn trống. Việc chấp nhận sẽ khóa nhóm
            và từ chối mọi lời mời đang chờ xử lý khác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                proceedWithApproval();
              }}
            >
              Tiếp tục
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowConfirmDialog(false)}
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
